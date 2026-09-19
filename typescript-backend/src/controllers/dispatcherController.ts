import { Request, Response } from 'express';

const { supabaseAdmin } = require('../config/supabase');
const { createNotification } = require('../services/notificationService');
const { logAuditEvent } = require('../services/auditService');
// const { data, error } = await supabaseAdmin
type IdType = string | number;

type CustomError = {
  message?: string;
};

// Request with optional authenticated user
type AuthRequest = Request & {
  user?: {
    user_id?: IdType;
    id?: IdType;
  };
};

// Generic DB record helper
type DbRecord = Record<string, any>;

// Payloads for dispatcher operations
type AssignBody = {
  bookingId?: IdType;
  technicianId?: IdType;
  dispatcherUserId?: IdType;
};

type ReassignBody = {
  bookingId?: IdType;
  oldTechnicianId?: IdType;
  newTechnicianId?: IdType;
  reassignReason?: string;
  dispatcherUserId?: IdType;
};

type UpdateStatusBody = {
  bookingId?: IdType;
  status?: string;
  cancelReason?: string;
  userId?: IdType;
  userRole?: string;
};

type BroadcastBody = {
  bookingId?: IdType;
  dispatcherUserId?: IdType;
  technicianId?: IdType;
};

type DowngradeBody = {
  bookingId?: IdType;
  dispatcherUserId?: IdType;
  reason?: string;
};

type ManualBookingBody = {
  customerId?: IdType;
  categoryId?: IdType;
  problemId?: IdType | null;
  issueDescription?: string;
  emergencyFlag?: boolean;
  emergencyReason?: string | null;
  priority?: string;
  preferredDate?: string | null;
  preferredTime?: string | null;
  houseNumber?: string | null;
  apartmentName?: string | null;
  street?: string;
  area?: string;
  city?: string;
  state?: string;
  pincode?: string;
  customerName?: string;
  customerPhone?: string;
  dispatcherUserId?: IdType;
};
const getBookingIssue = (booking: DbRecord): string | null =>
  booking?.service_problems?.problem_name ||
  booking?.service_problems?.[0]?.problem_name ||
  booking?.issue_description ||
  null;



// 1. Assign Technician (Exchanges Customer & Technician Data + Notifies Admin)
export const assignTechnician = async (req: Request, res: Response) => {
  const { bookingId, technicianId, dispatcherUserId } = req.body as AssignBody;

  try {
    // A. Fetch full Booking details with joined Customer (users) information
    const { data: booking, error: bookingFetchErr } = await supabaseAdmin
      .from('bookings')
      .select('*, customers:users!fk_booking_customer(user_id, full_name, phone, address)')
      .eq('booking_id', bookingId)
      .single();

    if (bookingFetchErr || !booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    // B. Fetch full Technician details (joining technicians with users table)
    const { data: technician, error: techFetchErr } = await supabaseAdmin
      .from('technicians')
      .select('technician_id, user_id, experience, rating, availability_status, users(full_name, phone, address)')
      .eq('technician_id', technicianId)
      .single();

    if (techFetchErr || !technician) {
      return res.status(404).json({ error: 'Technician not found' });
    }

    // Flatten technician object structure for easy use
    const techDetails = {
      technician_id: technician.technician_id,
      name: technician.users?.full_name,
      phone: technician.users?.phone,
      rating: technician.rating,
      availability_status: technician.availability_status
    };

    // C. Update Booking status to Assigned and attach technician_id
    const { data: updatedBooking, error: bookingErr } = await supabaseAdmin
      .from('bookings')
      .update({
        technician_id: technicianId,
        booking_status: 'Assigned',
        updated_at: new Date().toISOString()
      })
      .eq('booking_id', bookingId)
      .select()
      .single();

    if (bookingErr) throw bookingErr;

    // D. Set technician availability status to Busy
    await supabaseAdmin
      .from('technicians')
      .update({ availability_status: 'Busy' })
      .eq('technician_id', technicianId);

    // E. SEND CUSTOMER DETAILS TO TECHNICIAN
    const customerInfo = booking.customers;

    await createNotification({
      recipientRole: 'TECHNICIAN',
      userId: technician.user_id,
      bookingId,
      title: 'New Job Assigned',
      description: `You are requested to work for ${customerInfo?.full_name || 'a customer'}`,
      notificationType: 'Assignment',
      priority: 'High'
    });

    // F. SEND TECHNICIAN DETAILS TO CUSTOMER
    if (booking.customer_id) {
      await createNotification({
        recipientRole: 'CUSTOMER',
        userId: booking.customer_id,
        bookingId,
        title: 'Technician Assigned',
        description: `Technician ${techDetails.name} has been assigned to your booking #${bookingId}. Contact: ${techDetails.phone}, Rating: ${techDetails.rating}.`,
        notificationType: 'Assignment',
        priority: 'Medium'
      });
    }

    // G. NOTIFY ADMIN
    await createNotification({
      recipientRole: 'ADMIN',
      bookingId,
      title: 'Technician Assigned',
      description: `Dispatcher #${dispatcherUserId} assigned Tech #${technicianId} (${techDetails.name}) to Booking #${bookingId}.`,
      notificationType: 'System',
      priority: 'Medium'
    });

    // H. LOG AUDIT EVENT
    await logAuditEvent(
      dispatcherUserId,
      'DISPATCHER',
      'Technician Assignment',
      `Assigned Tech #${technicianId} (${techDetails.name}) to Booking #${bookingId}`
    );

    return res.status(200).json({
      success: true,
      booking: updatedBooking,
      assignedTechnician: techDetails,
      customerDetails: customerInfo
    });
  } catch (err) {
    const error = err as CustomError;
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
};

// 2. Reassign Technician (Notifies New Tech, Old Tech, Customer & Admin)
export const reassignTechnician = async (req: Request, res: Response) => {
  const { bookingId, oldTechnicianId, newTechnicianId, reassignReason, dispatcherUserId } = req.body as ReassignBody;

  try {
    const { data: booking } = await supabaseAdmin
      .from('bookings')
      .select('customer_id')
      .eq('booking_id', bookingId)
      .single();

    // Fetch New Tech Details (joined with users) for Customer Notification
    const { data: newTech } = await supabaseAdmin
      .from('technicians')
      .select('user_id, rating, users(full_name, phone)')
      .eq('technician_id', newTechnicianId)
      .single();

    // Update Booking
    await supabaseAdmin
      .from('bookings')
      .update({
        technician_id: newTechnicianId,
        booking_status: 'Assigned',
        updated_at: new Date().toISOString()
      })
      .eq('booking_id', bookingId);

    // Free up old technician and mark new technician as Busy
    await supabaseAdmin
      .from('technicians')
      .update({ availability_status: 'Available' })
      .eq('technician_id', oldTechnicianId);

    await supabaseAdmin
      .from('technicians')
      .update({ availability_status: 'Busy' })
      .eq('technician_id', newTechnicianId);

    // Fetch Old Tech User ID for notification
    const { data: oldTechData } = await supabaseAdmin
      .from('technicians')
      .select('user_id')
      .eq('technician_id', oldTechnicianId)
      .single();

    // Notify Old Tech
    if (oldTechData) {
      await createNotification({
        recipientRole: 'TECHNICIAN',
        userId: oldTechData.user_id,
        bookingId,
        title: 'Job Unassigned',
        description: `Booking #${bookingId} has been reassigned to another technician.`,
        notificationType: 'Assignment',
        priority: 'Medium'
      });
    }

    // Notify New Tech
    if (newTech) {
      await createNotification({
        recipientRole: 'TECHNICIAN',
        userId: newTech.user_id,
        bookingId,
        title: 'Reassigned Job Received',
        description: `You have been reassigned to Booking #${bookingId}. Reason: ${reassignReason}`,
        notificationType: 'Assignment',
        priority: 'High'
      });
    }

    // Notify Customer with New Tech Details
    if (booking?.customer_id) {
      await createNotification({
        recipientRole: 'CUSTOMER',
        userId: booking.customer_id,
        bookingId,
        title: 'Technician Updated',
        description: `Your booking #${bookingId} was reassigned to ${newTech?.users?.full_name || 'a new technician'} (Phone: ${newTech?.users?.phone || 'N/A'}).`,
        notificationType: 'Booking',
        priority: 'Medium'
      });
    }

    // Notify Admin
    await createNotification({
      recipientRole: 'ADMIN',
      bookingId,
      title: 'Job Reassigned',
      description: `Booking #${bookingId} reassigned from Tech #${oldTechnicianId} to Tech #${newTechnicianId}. Reason: ${reassignReason}`,
      notificationType: 'System',
      priority: 'Medium'
    });

    await logAuditEvent(
      dispatcherUserId,
      'DISPATCHER',
      'Reassignment',
      `Reassigned Booking #${bookingId} from Tech #${oldTechnicianId} to #${newTechnicianId}`
    );

    return res.status(200).json({ success: true, message: 'Technician reassigned successfully' });
  } catch (err) {
    const error = err as CustomError;
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
};

// 3. Get Dispatcher Profile
export const getDispatcherProfile = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.user_id || req.user?.id || (req.query?.user_id as string);

    if (!userId) {
      return res.status(200).json({
        success: false,
        message: 'No user_id provided'
      });
    }

    const { data, error } = await supabaseAdmin
      .from('users')
      .select('user_id, full_name, email, phone, address, role_id')
      .eq('user_id', userId)
      .single();

    if (error || !data) {
      return res.status(404).json({
        success: false,
        message: 'Dispatcher not found'
      });
    }

    return res.json({
      success: true,
      data
    });
  } catch (err) {
    const error = err as CustomError;
    return res.status(500).json({
      success: false,
      message: error.message || 'Internal server error'
    });
  }
};

// 4. Complete or Cancel Job (Notifies All Lifecycle Parties)
export const updateBookingStatus = async (req: Request, res: Response) => {
  const { bookingId, status, cancelReason, userId, userRole } = req.body as UpdateStatusBody;

  try {
    const { data: booking } = await supabaseAdmin
      .from('bookings')
      .select('customer_id, technician_id')
      .eq('booking_id', bookingId)
      .single();

    const updatePayload: DbRecord = {
      booking_status: status,
      updated_at: new Date().toISOString()
    };

    if (status === 'Cancelled') {
      updatePayload.cancellation_reason = cancelReason || null;
      updatePayload.cancelled_at = new Date().toISOString();
      updatePayload.cancelled_by = userId || null;
    }

    await supabaseAdmin
      .from('bookings')
      .update(updatePayload)
      .eq('booking_id', bookingId);

    // Log in status history table
    await supabaseAdmin
      .from('booking_status_history')
      .insert([{ booking_id: bookingId, status }]);

    // If job finished or cancelled, free up technician
    if ((status === 'Completed' || status === 'Cancelled') && booking?.technician_id) {
      await supabaseAdmin
        .from('technicians')
        .update({ availability_status: 'Available' })
        .eq('technician_id', booking.technician_id);
    }

    // Get technician's user_id if needed for notification
    let techUserId: IdType | null = null;
    if (booking?.technician_id) {
      const { data: techData } = await supabaseAdmin
        .from('technicians')
        .select('user_id')
        .eq('technician_id', booking.technician_id)
        .single();
      techUserId = techData?.user_id;
    }

    // Broadcast Notifications
    const rolesToNotify = ['ADMIN', 'DISPATCHER', 'CUSTOMER'];
    if (booking?.technician_id) rolesToNotify.push('TECHNICIAN');

    for (const role of rolesToNotify) {
      let targetUserId: IdType | null = null;
      if (role === 'CUSTOMER') targetUserId = booking.customer_id;
      if (role === 'TECHNICIAN') targetUserId = techUserId;

      await createNotification({
        recipientRole: role,
        userId: targetUserId,
        bookingId,
        title: `Booking ${status}`,
        description: `Booking #${bookingId} was marked as ${status}.${cancelReason ? ` Reason: ${cancelReason}` : ''}`,
        notificationType: status === 'Cancelled' ? 'Cancellation' : 'Booking',
        priority: status === 'Cancelled' ? 'High' : 'Medium'
      });
    }

    await logAuditEvent(userId, userRole, 'Status Update', `Booking #${bookingId} status changed to ${status}`);

    return res.status(200).json({ success: true, message: `Booking marked as ${status}` });
  } catch (err) {
    const error = err as CustomError;
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
};

// 5. Live Statistics for Dispatcher Dashboard Cards
export const getDispatcherDashboardStats = async (req: Request, res: Response) => {
  try {
    const { data: bookings, error: bErr } = await supabaseAdmin
      .from('bookings')
      .select('*, service_problems(problem_name), customers:users!fk_booking_customer(full_name, phone, email), technicians(technician_id, rating, availability_status, category_id, users(full_name, phone, email))');
    if (bErr) throw bErr;

    const { data: technicians, error: tErr } = await supabaseAdmin
      .from('technicians')
      .select('*, users(full_name, phone, email)');
    if (tErr) throw tErr;

    const safeBookings: DbRecord[] = bookings || [];
    const safeTechnicians: DbRecord[] = technicians || [];

    const pendingBookings = safeBookings.filter(b => b.booking_status === 'Pending').length;
    const availableTechnicians = safeTechnicians.filter(t => t.availability_status === 'Available').length;
    const busyTechnicians = safeTechnicians.filter(t => t.availability_status === 'Busy').length;

    const emergencyJobsList = safeBookings.filter(
      b => b.emergency_flag === true && b.booking_status !== 'Completed' && b.booking_status !== 'Cancelled'
    );

    const cancelledList = safeBookings.filter(b => b.booking_status === 'Cancelled');

    return res.status(200).json({
      success: true,
      stats: {
        pendingBookings,
        availableTechnicians,
        busyTechnicians,
        emergencyJobs: emergencyJobsList.length,
        cancelledToday: cancelledList.length
      },
      bookings: safeBookings
        .filter(b => !b.emergency_flag && b.booking_status !== 'Cancelled')
        .map(b => ({ ...b, issue: getBookingIssue(b) })),
      emergencies: emergencyJobsList.map(b => ({ ...b, issue: getBookingIssue(b) })),
      cancelledBookings: cancelledList.map(b => ({ ...b, issue: getBookingIssue(b) })),
      technicians: safeTechnicians
    });
  } catch (err) {
    const error = err as CustomError;
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
};

// 6. Search Customers by Query (Phone or Email)
export const searchCustomers = async (req: Request, res: Response) => {
  const { phone, email } = req.query;

  try {
    let query = supabaseAdmin
      .from('users')
      .select('user_id, full_name, email, phone');

    if (phone) {
      query = query.eq('phone', phone as string);
    } else if (email) {
      query = query.eq('email', email as string);
    } else {
      return res.status(400).json({
        success: false,
        message: 'Phone or email is required'
      });
    }

    const { data, error } = await query.single();

    if (error || !data) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found'
      });
    }

    return res.json({
      success: true,
      customer: data
    });
  } catch (err) {
    const error = err as CustomError;
    return res.status(500).json({
      success: false,
      message: error.message || 'Internal server error'
    });
  }
};

// 7. Search Customer by Phone
export const searchCustomerByPhone = async (req: Request, res: Response) => {
  try {
    const { phone } = req.query;

    const { data, error } = await supabaseAdmin
      .from('users')
      .select('user_id, full_name, phone')
      .eq('phone', phone as string)
      .single();

    if (error || !data) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found'
      });
    }

    return res.json({
      success: true,
      customer: data
    });
  } catch (err) {
    const error = err as CustomError;
    return res.status(500).json({
      success: false,
      message: error.message || 'Internal server error'
    });
  }
};

// 8. Emergency Broadcast Endpoint
export const triggerEmergencyBroadcast = async (req: Request, res: Response) => {
  const { bookingId, dispatcherUserId } = req.body as BroadcastBody;

  try {
    const { data: booking, error: bErr } = await supabaseAdmin
      .from('bookings')
      .select('*')
      .eq('booking_id', bookingId)
      .single();

    if (bErr || !booking) {
      return res.status(404).json({ error: 'Booking not found for broadcast' });
    }

    const { data: availableTechs, error: tErr } = await supabaseAdmin
      .from('technicians')
      .select('technician_id, user_id')
      .eq('availability_status', 'Available');

    if (tErr) throw tErr;

    if (availableTechs && availableTechs.length > 0) {
      for (const tech of availableTechs) {
        await createNotification({
          recipientRole: 'TECHNICIAN',
          userId: tech.user_id,
          bookingId,
          title: '🚨 EMERGENCY BROADCAST JOB',
          description: `Urgent booking #${bookingId} requires immediate attention! Address: ${booking.street}, ${booking.city}`,
          notificationType: 'Emergency',
          priority: 'High'
        });
      }
    }

    await logAuditEvent(
      dispatcherUserId,
      'DISPATCHER',
      'Emergency Downgrade',
      `Triggered emergency broadcast for Booking #${bookingId}`
    );

    return res.status(200).json({
      success: true,
      message: `Emergency broadcast sent to ${availableTechs?.length || 0} available technicians.`
    });
  } catch (err) {
    const error = err as CustomError;
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
};

// 9. Manual Booking Creation (Walk-in / Phone customer)
export const createManualBooking = async (req: Request, res: Response) => {
  try {
    const {
      customerId,
      categoryId,
      problemId,
      issueDescription,
      emergencyFlag,
      emergencyReason,
      preferredDate,
      preferredTime,
      houseNumber,
      apartmentName,
      street,
      area,
      city,
      state,
      pincode,
      customerName,
      customerPhone,
      dispatcherUserId
    } = req.body as ManualBookingBody;

    let resolvedCustomerId = customerId || null;

    if (!resolvedCustomerId) {
      if (customerPhone) {
        const { data: existingUser } = await supabaseAdmin
          .from('users')
          .select('user_id')
          .eq('phone', customerPhone)
          .maybeSingle();

        if (existingUser) {
          resolvedCustomerId = existingUser.user_id;
        }
      }

      if (!resolvedCustomerId) {
        const { data: roleRow } = await supabaseAdmin
          .from('roles')
          .select('role_id')
          .eq('role_name', 'Customer')
          .maybeSingle();

        const guestEmail = `guest-${Date.now()}@fixibly.walkin`;
        const guestPasswordHash = Math.random().toString(36).substring(2);

        const { data: newUser, error: userErr } = await supabaseAdmin
          .from('users')
          .insert([
            {
              full_name: customerName || 'Walk-in Customer',
              phone: customerPhone || null,
              email: guestEmail,
              password_hash: guestPasswordHash,
              role_id: roleRow?.role_id || null,
              created_at: new Date().toISOString()
            }
          ])
          .select('user_id')
          .single();

        if (userErr) {
          console.error('Error creating guest user:', userErr);
        } else if (newUser) {
          resolvedCustomerId = newUser.user_id;
        }
      }
    }

    if (!resolvedCustomerId) {
      return res.status(400).json({ success: false, error: 'Customer could not be identified or created.' });
    }

    const { data: booking, error } = await supabaseAdmin
      .from('bookings')
      .insert([
        {
          customer_id: resolvedCustomerId,
          category_id: categoryId,
          problem_id: problemId,
          issue_description: issueDescription,
          emergency_flag: emergencyFlag || false,
          emergency_reason: emergencyReason || null,
          priority: emergencyFlag ? 'Emergency' : 'Normal',
          preferred_date: preferredDate,
          preferred_time: preferredTime,
          house_number: houseNumber,
          apartment_name: apartmentName || null,
          street,
          area,
          city,
          state,
          pincode,
          booking_status: 'Pending',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ])
      .select()
      .single();

    if (error) throw error;

    await createNotification({
      recipientRole: 'DISPATCHER',
      bookingId: booking.booking_id,
      title: 'New Manual Booking',
      description: `Manual Booking #${booking.booking_id} created.`,
      notificationType: 'Booking',
      priority: 'Medium'
    });

    await logAuditEvent(
      dispatcherUserId || null,
      'DISPATCHER',
      'Manual Booking',
      `Created Booking #${booking.booking_id}`
    );

    return res.status(201).json({ success: true, booking });
  } catch (err) {
    const error = err as CustomError;
    return res.status(500).json({ success: false, error: error.message || 'Internal server error' });
  }
};

// 10. Downgrade Emergency Status
export const downgradeEmergency = async (req: Request, res: Response) => {
  const { bookingId, dispatcherUserId, reason } = req.body as DowngradeBody;

  try {
    const { data: updatedBooking, error } = await supabaseAdmin
      .from('bookings')
      .update({
        emergency_flag: false,
        priority: 'Normal',
        updated_at: new Date().toISOString()
      })
      .eq('booking_id', bookingId)
      .select()
      .single();

    if (error) throw error;

    await logAuditEvent(
      dispatcherUserId,
      'DISPATCHER',
      'Emergency Broadcast',
      `Downgraded emergency flag for Booking #${bookingId}. Reason: ${reason || 'Not specified'}`
    );

    return res.status(200).json({
      success: true,
      message: 'Emergency status downgraded successfully',
      booking: updatedBooking
    });
  } catch (err) {
    const error = err as CustomError;
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
};

// 11. Technician Summary Stats for Dispatcher UI
export const getTechnicianSummaryStats = async (req: Request, res: Response) => {
  try {
    const { data: technicians, error } = await supabaseAdmin
      .from('technicians')
      .select(`
        technician_id,
        user_id,
        category_id,
        experience,
        rating,
        availability_status,
        profile_picture,
        users (full_name, phone, address, email)
      `);

    if (error) throw error;

    const safeTechs: DbRecord[] = technicians || [];
    const total = safeTechs.length;
    const available = safeTechs.filter(t => t.availability_status === 'Available').length;
    const busy = safeTechs.filter(t => t.availability_status === 'Busy').length;
    const offline = safeTechs.filter(t => t.availability_status === 'Offline').length;

    return res.status(200).json({
      success: true,
      summary: {
        total,
        available,
        busy,
        offline
      },
      technicians: safeTechs
    });
  } catch (err) {
    const error = err as CustomError;
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
};

// 12. Active Bookings with Technician Location (for Polling)
export const getActiveBookingsWithLocation = async (req: Request, res: Response) => {
  try {
    const { data: bookings, error: bErr } = await supabaseAdmin
      .from('bookings')
      .select('booking_id, booking_status, customer_id, technician_id, issue_description, category_id, preferred_date, preferred_time, house_number, street, area, city, pincode, service_problems(problem_name), customers:users!fk_booking_customer(full_name, phone), technicians(technician_id, users(full_name, phone))')
      .not('booking_status', 'in', '(Completed,Cancelled)');

    if (bErr) throw bErr;

    const safeBookings: DbRecord[] = bookings || [];
    const techIds = [...new Set(safeBookings.map(b => b.technician_id).filter(Boolean))];

    const locationMap: Record<string, DbRecord> = {};
    if (techIds.length > 0) {
      const { data: locations } = await supabaseAdmin
        .from('technician_locations')
        .select('technician_id, latitude, longitude, updated_at')
        .in('technician_id', techIds);

      (locations || []).forEach((l: DbRecord) => {
        locationMap[l.technician_id] = l;
      });
    }

    const result = safeBookings.map(b => ({
      bookingId: b.booking_id,
      status: b.booking_status,
      customerName: b.customers?.full_name || null,
      customerPhone: b.customers?.phone || null,
      technicianId: b.technician_id,
      technicianName: b.technicians?.users?.full_name || null,
      technicianPhone: b.technicians?.users?.phone || null,
      issue: getBookingIssue(b),
      address: [b.house_number, b.street, b.area, b.city].filter(Boolean).join(', '),
      location: locationMap[b.technician_id]
        ? {
            lat: locationMap[b.technician_id].latitude,
            lng: locationMap[b.technician_id].longitude,
            updatedAt: locationMap[b.technician_id].updated_at
          }
        : null
    }));

    return res.status(200).json({ success: true, bookings: result });
  } catch (err) {
    const error = err as CustomError;
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
};

// 13. Accept Emergency Broadcast
export const acceptEmergencyBroadcast = async (req: Request, res: Response) => {
  const { bookingId, technicianId } = req.body as BroadcastBody;

  try {
    const { data: booking, error: bErr } = await supabaseAdmin
      .from('bookings')
      .select('booking_id, booking_status, technician_id, customer_id, issue_description, street, city')
      .eq('booking_id', bookingId)
      .single();

    if (bErr || !booking) return res.status(404).json({ error: 'Booking not found' });
    if (booking.technician_id) return res.status(409).json({ error: 'Already assigned to another technician' });

    const { data: tech, error: tErr } = await supabaseAdmin
      .from('technicians')
      .select('technician_id, user_id, rating, users(full_name, phone)')
      .eq('technician_id', technicianId)
      .single();

    if (tErr || !tech) return res.status(404).json({ error: 'Technician not found' });

    await supabaseAdmin
      .from('bookings')
      .update({ technician_id: technicianId, booking_status: 'Assigned', updated_at: new Date().toISOString() })
      .eq('booking_id', bookingId);

    await supabaseAdmin
      .from('technicians')
      .update({ availability_status: 'Busy' })
      .eq('technician_id', technicianId);

    await createNotification({
      recipientRole: 'TECHNICIAN',
      userId: tech.user_id,
      bookingId,
      title: 'Emergency Job Accepted',
      description: `You have been assigned to emergency booking #${bookingId}. Address: ${booking.street}, ${booking.city}`,
      notificationType: 'Assignment',
      priority: 'High'
    });

    if (booking.customer_id) {
      await createNotification({
        recipientRole: 'CUSTOMER',
        userId: booking.customer_id,
        bookingId,
        title: 'Technician Assigned',
        description: `Technician ${tech.users?.full_name} has accepted your emergency booking #${bookingId}. Contact: ${tech.users?.phone}, Rating: ${tech.rating}.`,
        notificationType: 'Assignment',
        priority: 'High'
      });
    }

    await createNotification({
      recipientRole: 'DISPATCHER',
      bookingId,
      title: 'Emergency Accepted',
      description: `Technician ${tech.users?.full_name} accepted emergency booking #${bookingId}.`,
      notificationType: 'Emergency',
      priority: 'High'
    });

    return res.status(200).json({
      success: true,
      message: `${tech.users?.full_name} assigned to booking #${bookingId}`
    });
  } catch (err) {
    const error = err as CustomError;
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
};
module.exports = {
  assignTechnician,
  reassignTechnician,
  downgradeEmergency,
  getTechnicianSummaryStats,
  updateBookingStatus,
  getDispatcherDashboardStats,
  triggerEmergencyBroadcast,
  searchCustomers,
  searchCustomerByPhone,
  createManualBooking,
  getDispatcherProfile,
  getActiveBookingsWithLocation,
  acceptEmergencyBroadcast
};
