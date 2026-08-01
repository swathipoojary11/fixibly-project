import supabase from '../config/supabase.js';
import { createNotification } from '../services/notificationService.js';
import { logAuditEvent } from '../services/auditService.js';

// 1. Assign Technician
export const assignTechnician = async (req, res) => {
  const bookingId = req.body.bookingId || req.body.booking_id || req.params.bookingId || req.params.id;
  const rawTechId = req.body.technicianId || req.body.technician_id;
  const dispatcherUserId = req.body.dispatcherUserId || req.user?.user_id;

  try {
    if (!bookingId || !rawTechId) {
      return res.status(400).json({ success: false, message: 'Both bookingId and technicianId are required.' });
    }

    const cleanTechId = Number(String(rawTechId).replace(/\D/g, '')) || rawTechId;

    // Fetch booking
    const { data: booking, error: bErr } = await supabase
      .from('bookings')
      .select('*, users!customer_id(user_id, full_name, phone, address)')
      .eq('booking_id', bookingId)
      .single();

    if (bErr || !booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    // Try finding technician by technician_id first, then user_id
    let { data: technician } = await supabase
      .from('technicians')
      .select('*, users(full_name, phone, email)')
      .eq('technician_id', cleanTechId)
      .maybeSingle();

    if (!technician) {
      const { data: techByUser } = await supabase
        .from('technicians')
        .select('*, users(full_name, phone, email)')
        .eq('user_id', cleanTechId)
        .maybeSingle();
      technician = techByUser;
    }

    if (!technician) {
      return res.status(404).json({ success: false, message: 'Technician not found in database' });
    }

    const targetTechId = technician.technician_id;

    // Update Booking status to Assigned
    const { data: updatedBooking, error: bookingErr } = await supabase
      .from('bookings')
      .update({
        technician_id: targetTechId,
        booking_status: 'Assigned',
        updated_at: new Date().toISOString()
      })
      .eq('booking_id', bookingId)
      .select()
      .single();

    if (bookingErr) throw bookingErr;

    // Set technician status to Busy
    await supabase
      .from('technicians')
      .update({ availability_status: 'Busy', updated_at: new Date().toISOString() })
      .eq('technician_id', targetTechId);

    // Notifications
    const customerInfo = booking.users;
    const customerAddress = `${booking.house_number || ''} ${booking.street || ''} ${booking.area || ''} ${booking.city || ''}`.trim() || customerInfo?.address || 'Provided address';

    await createNotification({
      recipientRole: 'TECHNICIAN',
      userId: technician.user_id,
      bookingId,
      title: 'New Job Assigned',
      description: `New Job #${bookingId}! Customer: ${customerInfo?.full_name || 'Customer'}, Phone: ${customerInfo?.phone || 'N/A'}, Address: ${customerAddress}, Issue: ${booking.issue_description || 'General Service'}`,
      notificationType: 'Assignment',
      priority: 'High'
    });

    if (booking.customer_id) {
      await createNotification({
        recipientRole: 'CUSTOMER',
        userId: booking.customer_id,
        bookingId,
        title: 'Technician Assigned',
        description: `Technician ${technician.users?.full_name || 'Service Tech'} has been assigned to your booking #${bookingId}! Contact: ${technician.users?.phone || 'N/A'}, Rating: ${technician.rating || '5.0'}.`,
        notificationType: 'Booking',
        priority: 'Medium'
      });
    }

    await createNotification({
      recipientRole: 'ADMIN',
      bookingId,
      title: 'Technician Assigned',
      description: `Dispatcher assigned Tech #${targetTechId} (${technician.users?.full_name || ''}) to Booking #${bookingId}.`,
      notificationType: 'System',
      priority: 'Low'
    });

    await logAuditEvent(
      dispatcherUserId || req.user?.user_id,
      'Dispatcher',
      'Technician Assignment',
      `Assigned Tech #${targetTechId} to Booking #${bookingId}`,
      bookingId
    );

    return res.status(200).json({
      success: true,
      message: 'Technician assigned successfully',
      booking: updatedBooking,
      assignedTechnician: technician
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// 2. Reassign Technician
export const reassignTechnician = async (req, res) => {
  const bookingId = req.body.bookingId || req.body.booking_id;
  const oldTechId = req.body.oldTechnicianId || req.body.old_technician_id;
  const newTechId = req.body.newTechnicianId || req.body.new_technician_id;
  const reassignReason = req.body.reassignReason || req.body.reason;
  const dispatcherUserId = req.body.dispatcherUserId || req.user?.user_id;

  try {
    const cleanNewTechId = Number(String(newTechId).replace(/\D/g, '')) || newTechId;

    let { data: newTech } = await supabase
      .from('technicians')
      .select('*, users(full_name, phone)')
      .eq('technician_id', cleanNewTechId)
      .maybeSingle();

    if (!newTech) {
      const { data: techByUser } = await supabase
        .from('technicians')
        .select('*, users(full_name, phone)')
        .eq('user_id', cleanNewTechId)
        .maybeSingle();
      newTech = techByUser;
    }

    if (!newTech) {
      return res.status(404).json({ success: false, message: 'New technician not found' });
    }

    const targetTechId = newTech.technician_id;

    // Update Booking
    const { data: updatedBooking, error } = await supabase
      .from('bookings')
      .update({
        technician_id: targetTechId,
        booking_status: 'Assigned',
        updated_at: new Date().toISOString()
      })
      .eq('booking_id', bookingId)
      .select()
      .single();

    if (error) throw error;

    // Free up old technician and set new tech to Busy
    if (oldTechId) {
      await supabase
        .from('technicians')
        .update({ availability_status: 'Available' })
        .eq('technician_id', oldTechId);

      const { data: oldTech } = await supabase.from('technicians').select('user_id').eq('technician_id', oldTechId).maybeSingle();
      if (oldTech) {
        await createNotification({
          recipientRole: 'TECHNICIAN',
          userId: oldTech.user_id,
          bookingId,
          title: 'Job Unassigned',
          description: `Booking #${bookingId} has been reassigned to another technician.`,
          notificationType: 'Assignment',
          priority: 'Low'
        });
      }
    }

    await supabase
      .from('technicians')
      .update({ availability_status: 'Busy' })
      .eq('technician_id', targetTechId);

    if (newTech) {
      await createNotification({
        recipientRole: 'TECHNICIAN',
        userId: newTech.user_id,
        bookingId,
        title: 'New Job Assigned (Reassigned)',
        description: `Booking #${bookingId} reassigned to you. Reason: ${reassignReason || 'Dispatch adjustment'}`,
        notificationType: 'Assignment',
        priority: 'High'
      });
    }

    return res.status(200).json({ success: true, message: 'Technician reassigned successfully', booking: updatedBooking });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// 3. Update Booking Status (Dispatcher Override)
export const updateBookingStatus = async (req, res) => {
  const { bookingId, status, dispatcherUserId, reason } = req.body;

  try {
    const { data: updatedBooking, error } = await supabase
      .from('bookings')
      .update({
        booking_status: status,
        updated_at: new Date().toISOString()
      })
      .eq('booking_id', bookingId)
      .select()
      .single();

    if (error) throw error;

    await logAuditEvent(
      dispatcherUserId || req.user?.user_id,
      'Dispatcher',
      'Status Override',
      `Updated Booking #${bookingId} status to '${status}'. Reason: ${reason || 'Manual override'}`,
      bookingId
    );

    return res.status(200).json({ success: true, message: `Booking status updated to ${status}`, booking: updatedBooking });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// 4. Live Statistics for Dispatcher Dashboard Cards
export const getDispatcherDashboardStats = async (req, res) => {
  try {
    const { data: bookings, error: bErr } = await supabase.from('bookings').select('*');
    if (bErr) throw bErr;

    const { data: technicians, error: tErr } = await supabase.from('technicians').select('*, service_categories(category_name), users(full_name, phone, email)');
    if (tErr) throw tErr;

    const pendingBookings = (bookings || []).filter(b => b.booking_status === 'Pending').length;
    const assignedBookings = (bookings || []).filter(b => b.booking_status === 'Assigned' || b.booking_status === 'Accepted' || b.booking_status === 'On The Way' || b.booking_status === 'Arrived' || b.booking_status === 'Working' || b.booking_status === 'Waiting for Customer Confirmation').length;
    const availableTechnicians = (technicians || []).filter(t => t.availability_status === 'Available').length;
    const busyTechnicians = (technicians || []).filter(t => t.availability_status === 'Busy').length;
    const offlineTechnicians = (technicians || []).filter(t => t.availability_status === 'Offline').length;
    const emergencyJobs = (bookings || []).filter(b => b.emergency_flag && b.booking_status !== 'Completed' && b.booking_status !== 'Cancelled').length;
    const completedCount = (bookings || []).filter(b => b.booking_status === 'Completed').length;
    const cancelledCount = (bookings || []).filter(b => b.booking_status === 'Cancelled').length;

    const formattedTechs = (technicians || []).map(t => ({
      ...t,
      id: `TECH-${t.technician_id}`,
      name: t.users?.full_name || 'Technician Specialist',
      email: t.users?.email || 'N/A',
      phone: t.users?.phone || 'N/A',
      category: t.service_categories?.category_name || 'General Service',
      availability: t.availability_status || 'Available',
      avgRating: t.rating || 5.0,
      avgResponseTime: '15 mins',
      completedJobs: 12,
      delayedJobs: 0
    }));

    return res.status(200).json({
      success: true,
      stats: {
        totalBookings: (bookings || []).length,
        pendingBookings,
        assignedBookings,
        availableTechnicians,
        busyTechnicians,
        offlineTechnicians,
        emergencyJobs,
        completedCount,
        cancelledCount
      },
      intakeStream: bookings || [],
      emergencyBroadcasts: (bookings || []).filter(b => b.emergency_flag && b.booking_status !== 'Completed' && b.booking_status !== 'Cancelled'),
      technicians: formattedTechs
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// 5. Manual Booking Endpoint
export const createManualBooking = async (req, res) => {
  const {
    customerName, customerPhone, customerEmail, categoryId, problemId,
    description, address, street, area, city, pincode, priority, emergencyFlag, emergencyReason,
    preferredDate, preferredTime, anytimeService, dispatcherUserId
  } = req.body;

  try {
    let customerId = req.body.customerId;

    if (!customerId && customerEmail) {
      const { data: existingUser } = await supabase.from('users').select('user_id').ilike('email', customerEmail.trim()).maybeSingle();
      if (existingUser) {
        customerId = existingUser.user_id;
      } else {
        const { data: newUser } = await supabase.from('users').insert([{
          full_name: customerName || 'Walk-in Customer',
          email: customerEmail.trim().toLowerCase(),
          phone: customerPhone || '9999999999',
          address: address || `${street || ''} ${area || ''} ${city || ''}`.trim(),
          password_hash: 'manual-booking-placeholder',
          role_id: 1
        }]).select().single();
        customerId = newUser.user_id;
      }
    }

    if (!customerId) {
      const { data: firstCustomer } = await supabase.from('users').select('user_id').eq('role_id', 1).limit(1).single();
      customerId = firstCustomer?.user_id || 1;
    }

    const { data: booking, error } = await supabase
      .from('bookings')
      .insert([
        {
          customer_id: customerId,
          category_id: Number(categoryId),
          problem_id: problemId ? Number(problemId) : null,
          issue_description: description || 'Manual booking intake',
          street: street || 'Manual Address',
          area: area || 'Central Area',
          city: city || 'City',
          pincode: pincode || '575001',
          priority: emergencyFlag ? 'Emergency' : (priority || 'Normal'),
          emergency_flag: Boolean(emergencyFlag),
          emergency_reason: emergencyReason || null,
          preferred_date: preferredDate || null,
          preferred_time: preferredTime || null,
          anytime_service: Boolean(anytimeService),
          booking_status: 'Pending',
          created_at: new Date().toISOString()
        }
      ])
      .select()
      .single();

    if (error) throw error;

    await logAuditEvent(
      dispatcherUserId || req.user?.user_id,
      'Dispatcher',
      'Booking Creation',
      `Manual booking #${booking.booking_id} created by Dispatcher`,
      booking.booking_id
    );

    if (emergencyFlag) {
      await createNotification({
        recipientRole: 'TECHNICIAN',
        bookingId: booking.booking_id,
        title: '🚨 EMERGENCY JOB BROADCAST',
        description: `Manual emergency booking #${booking.booking_id} created!`,
        notificationType: 'Emergency',
        priority: 'High'
      });
    }

    return res.status(201).json({ success: true, message: 'Manual booking created successfully', booking });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// 6. Emergency Broadcast Endpoint
export const triggerEmergencyBroadcast = async (req, res) => {
  const { bookingId, dispatcherUserId } = req.body;

  try {
    const { data: booking, error: bErr } = await supabase
      .from('bookings')
      .select('*')
      .eq('booking_id', bookingId)
      .single();

    if (bErr || !booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    const { data: availableTechs } = await supabase
      .from('technicians')
      .select('*, users(full_name)')
      .eq('category_id', booking.category_id)
      .eq('availability_status', 'Available');

    if (availableTechs && availableTechs.length > 0) {
      for (const tech of availableTechs) {
        await createNotification({
          recipientRole: 'TECHNICIAN',
          userId: tech.user_id,
          bookingId,
          title: '🚨 EMERGENCY BROADCAST',
          description: `Urgent emergency booking #${bookingId} requires immediate action! Area: ${booking.area || booking.city}`,
          notificationType: 'Emergency',
          priority: 'High'
        });
      }
    }

    await logAuditEvent(
      dispatcherUserId || req.user?.user_id,
      'Dispatcher',
      'Administrative Action',
      `Triggered emergency broadcast for Booking #${bookingId}`,
      bookingId
    );

    return res.status(200).json({
      success: true,
      message: `Emergency broadcast sent to ${availableTechs?.length || 0} available category technicians.`
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// 7. Downgrade Emergency
export const downgradeEmergency = async (req, res) => {
  const { bookingId, dispatcherUserId, reason } = req.body;

  try {
    const { data: updatedBooking, error } = await supabase
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
      dispatcherUserId || req.user?.user_id,
      'Dispatcher',
      'Emergency Downgrade',
      `Downgraded emergency flag for Booking #${bookingId}. Reason: ${reason || 'Operational adjustment'}`,
      bookingId
    );

    return res.status(200).json({
      success: true,
      message: 'Emergency status downgraded successfully',
      booking: updatedBooking
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// 8. Technician Summary Stats
export const getTechnicianSummaryStats = async (req, res) => {
  try {
    const { data: technicians, error } = await supabase
      .from('technicians')
      .select('*, service_categories(category_name), users(full_name, phone, email)');

    if (error) throw error;

    const total = (technicians || []).length;
    const available = (technicians || []).filter(t => t.availability_status === 'Available').length;
    const busy = (technicians || []).filter(t => t.availability_status === 'Busy').length;
    const offline = (technicians || []).filter(t => t.availability_status === 'Offline').length;

    const formattedTechs = (technicians || []).map(t => ({
      ...t,
      id: `TECH-${t.technician_id}`,
      name: t.users?.full_name || 'Technician Specialist',
      email: t.users?.email || 'N/A',
      phone: t.users?.phone || 'N/A',
      category: t.service_categories?.category_name || 'General Service',
      availability: t.availability_status || 'Available',
      avgRating: t.rating || 5.0,
      avgResponseTime: '15 mins',
      completedJobs: 12,
      delayedJobs: 0
    }));

    return res.status(200).json({
      success: true,
      summary: { total, available, busy, offline },
      technicians: formattedTechs
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// 9. Get All Intake Bookings with Joined Info
export const getIntakeBookings = async (req, res) => {
  try {
    const { data: bookings, error } = await supabase
      .from('bookings')
      .select(`
        *,
        service_categories (category_name, category_image_url),
        service_problems (problem_name, fixed_price),
        users!customer_id (user_id, full_name, email, phone, address),
        technicians (technician_id, rating, availability_status, users(full_name, phone))
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return res.status(200).json({
      success: true,
      count: (bookings || []).length,
      bookings: bookings || []
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export default {
  assignTechnician,
  reassignTechnician,
  updateBookingStatus,
  getDispatcherDashboardStats,
  createManualBooking,
  triggerEmergencyBroadcast,
  downgradeEmergency,
  getTechnicianSummaryStats,
  getIntakeBookings
};