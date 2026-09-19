

const { supabaseAdmin } = require('../config/supabase');
const { createNotification } = require('../services/notificationService');
const { logAuditEvent } = require('../services/auditService');
// const { data, error } = await supabaseAdmin

const getBookingIssue = (booking) =>
  booking?.service_problems?.problem_name
  || booking?.service_problems?.[0]?.problem_name
  || booking?.issue_description
  || null;

// 1. Assign Technician (Exchanges Customer & Technician Data + Notifies Admin)
const assignTechnician = async (req, res) => {
  const { bookingId, technicianId, dispatcherUserId } = req.body;

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
    const customerAddress = `${booking.house_number || ''} ${booking.street}, ${booking.area}, ${booking.city} - ${booking.pincode}`.trim();

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
    return res.status(500).json({ error: err.message });
  }
};

// 2. Reassign Technician (Notifies New Tech, Old Tech, Customer & Admin)
const reassignTechnician = async (req, res) => {
  const { bookingId, oldTechnicianId, newTechnicianId, reassignReason, dispatcherUserId } = req.body;

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
    return res.status(500).json({ error: err.message });
  }
};
// const supabase = require("../config/supabase");

const getDispatcherProfile = async (req, res) => {
    try {
        // Support both authenticated (req.user) and unauthenticated (query param) access
        const userId = req.user?.user_id || req.query?.user_id;

        if (!userId) {
            return res.status(200).json({
                success: false,
                message: "No user_id provided"
            });
        }

        const { data, error } = await supabaseAdmin
            .from("users")
            .select("user_id, full_name, email, phone, address, role_id")
            .eq("user_id", userId)
            .single();

        if (error || !data) {
            return res.status(404).json({
                success: false,
                message: "Dispatcher not found"
            });
        }

        res.json({
            success: true,
            data
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

// 3. Complete or Cancel Job (Notifies All Lifecycle Parties)
const updateBookingStatus = async (req, res) => {
  const { bookingId, status, cancelReason, userId, userRole } = req.body;

  try {
    const { data: booking } = await supabaseAdmin
      .from('bookings')
      .select('customer_id, technician_id')
      .eq('booking_id', bookingId)
      .single();

    const updatePayload = {
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
    let techUserId = null;
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
      let targetUserId = null;
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
    return res.status(500).json({ error: err.message });
  }
};

// 4. Live Statistics for Dispatcher Dashboard Cards
const getDispatcherDashboardStats = async (req, res) => {
  try {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const { data: bookings, error: bErr } = await supabaseAdmin
      .from('bookings')
      .select('*, service_problems(problem_name), customers:users!fk_booking_customer(full_name, phone, email), technicians(technician_id, rating, availability_status, category_id, users(full_name, phone, email))');
    if (bErr) throw bErr;

    const { data: technicians, error: tErr } = await supabaseAdmin
      .from('technicians')
      .select('*, users(full_name, phone, email)');
    if (tErr) throw tErr;

    const pendingBookings = bookings.filter(b => b.booking_status === 'Pending').length;
    const availableTechnicians = technicians.filter(t => t.availability_status === 'Available').length;
    const busyTechnicians = technicians.filter(t => t.availability_status === 'Busy').length;

    const emergencyJobsList = bookings.filter(b =>
      b.emergency_flag === true && b.booking_status !== 'Completed' && b.booking_status !== 'Cancelled'
    );

    const cancelledList = bookings.filter(b => b.booking_status === 'Cancelled');

    return res.status(200).json({
      success: true,
      stats: {
        pendingBookings,
        availableTechnicians,
        busyTechnicians,
        emergencyJobs: emergencyJobsList.length,
        cancelledToday: cancelledList.length
      },
      bookings: bookings
        .filter(b => !b.emergency_flag && b.booking_status !== 'Cancelled')
        .map(b => ({ ...b, issue: getBookingIssue(b) })),
      emergencies: emergencyJobsList.map(b => ({ ...b, issue: getBookingIssue(b) })),
      cancelledBookings: cancelledList.map(b => ({ ...b, issue: getBookingIssue(b) })),
      technicians
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
const searchCustomers = async (req, res) => {
  const { phone, email } = req.query;

  try {
    let query = supabaseAdmin
      .from("users")
      .select("user_id, full_name, email, phone");

    if (phone) {
      query = query.eq("phone", phone);
    } else if (email) {
      query = query.eq("email", email);
    } else {
      return res.status(400).json({
        success: false,
        message: "Phone or email is required"
      });
    }

    const { data, error } = await query.single();

    if (error || !data) {
      return res.status(404).json({
        success: false,
        message: "Customer not found"
      });
    }

    return res.json({
      success: true,
      customer: data
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message
    });
  }
};
// 5. Manual Booking Endpoint (Dispatcher UI)

// 6. Emergency Broadcast Endpoint
const triggerEmergencyBroadcast = async (req, res) => {
  const { bookingId, dispatcherUserId } = req.body;

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
    return res.status(500).json({ error: err.message });
  }
};
const searchCustomerByPhone = async (req, res) => {
  try {
    const { phone } = req.query;

    const { data, error } = await supabaseAdmin
      .from("users")
      .select("user_id, full_name, phone")
      .eq("phone", phone)
      .single();

    if (error || !data) {
      return res.status(404).json({
        success: false,
        message: "Customer not found"
      });
    }

    return res.json({
      success: true,
      customer: data
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message
    });
  }
};
const createManualBooking = async (req, res) => {
  try {
    const {
      customerId,
      categoryId,
      problemId,
      issueDescription,
      emergencyFlag,
      emergencyReason,
      priority,
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
    } = req.body;

    // If no customerId, try to find or create a guest record
    let resolvedCustomerId = customerId || null;

    if (!resolvedCustomerId) {
        // If a phone number is provided, try to find an existing user
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

        // If no user is found or no phone is provided, create a new guest user
        if (!resolvedCustomerId) {
            // Get the Customer role_id
            const { data: roleRow } = await supabaseAdmin
                .from('roles')
                .select('role_id')
                .eq('role_name', 'Customer')
                .maybeSingle();

            // Generate a unique email and a random password hash for the guest user
            const guestEmail = `guest-${Date.now()}@fixibly.walkin`;
            const guestPasswordHash = Math.random().toString(36).substring(2);

            const { data: newUser, error: userErr } = await supabaseAdmin
                .from('users')
                .insert([{
                    full_name: customerName || 'Walk-in Customer',
                    phone: customerPhone || null,
                    email: guestEmail,
                    password_hash: guestPasswordHash,
                    role_id: roleRow?.role_id || null, // Make sure to handle if role not found
                    created_at: new Date().toISOString()
                }])
                .select('user_id')
                .single();

            if (userErr) {
                console.error("Error creating guest user:", userErr);
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
      .insert([{
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
      }])
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
    return res.status(500).json({ success: false, error: err.message });
  }
};
// 7. Downgrade Emergency Status
const downgradeEmergency = async (req, res) => {
  const { bookingId, dispatcherUserId, reason } = req.body;

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
    return res.status(500).json({ error: err.message });
  }
};

// 8. Technician Summary Stats for Dispatcher UI
const getTechnicianSummaryStats = async (req, res) => {
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

    const total = technicians.length;
    const available = technicians.filter(t => t.availability_status === 'Available').length;
    const busy = technicians.filter(t => t.availability_status === 'Busy').length;
    const offline = technicians.filter(t => t.availability_status === 'Offline').length;

    return res.status(200).json({
      success: true,
      summary: {
        total,
        available,
        busy,
        offline
      },
      technicians
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
// 9. Active bookings with technician location (for CurrentStatus polling)
const getActiveBookingsWithLocation = async (req, res) => {
  try {
    const { data: bookings, error: bErr } = await supabaseAdmin
      .from('bookings')
      .select('booking_id, booking_status, customer_id, technician_id, issue_description, category_id, preferred_date, preferred_time, house_number, street, area, city, pincode, service_problems(problem_name), customers:users!fk_booking_customer(full_name, phone), technicians(technician_id, users(full_name, phone))')
      .not('booking_status', 'in', '(Completed,Cancelled)');

    if (bErr) throw bErr;

    const techIds = [...new Set((bookings || []).map(b => b.technician_id).filter(Boolean))];

    let locationMap = {};
    if (techIds.length > 0) {
      const { data: locations } = await supabaseAdmin
        .from('technician_locations')
        .select('technician_id, latitude, longitude, updated_at')
        .in('technician_id', techIds);
      (locations || []).forEach(l => { locationMap[l.technician_id] = l; });
    }

    const result = (bookings || []).map(b => ({
      bookingId: b.booking_id,
      status: b.booking_status,
      customerName: b.customers?.full_name || null,
      customerPhone: b.customers?.phone || null,
      technicianId: b.technician_id,
      technicianName: b.technicians?.users?.full_name || null,
      technicianPhone: b.technicians?.users?.phone || null,
      issue: getBookingIssue(b),
      address: [b.house_number, b.street, b.area, b.city].filter(Boolean).join(', '),
      location: locationMap[b.technician_id] ? {
        lat: locationMap[b.technician_id].latitude,
        lng: locationMap[b.technician_id].longitude,
        updatedAt: locationMap[b.technician_id].updated_at
      } : null
    }));

    return res.status(200).json({ success: true, bookings: result });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// 10. Accept Emergency Broadcast — first technician to accept gets auto-assigned
const acceptEmergencyBroadcast = async (req, res) => {
  const { bookingId, technicianId } = req.body;

  try {
    // Check booking is still unassigned and pending
    const { data: booking, error: bErr } = await supabaseAdmin
      .from('bookings')
      .select('booking_id, booking_status, technician_id, customer_id, issue_description, street, city')
      .eq('booking_id', bookingId)
      .single();

    if (bErr || !booking) return res.status(404).json({ error: 'Booking not found' });
    if (booking.technician_id) return res.status(409).json({ error: 'Already assigned to another technician' });

    // Fetch technician details
    const { data: tech, error: tErr } = await supabaseAdmin
      .from('technicians')
      .select('technician_id, user_id, rating, users(full_name, phone)')
      .eq('technician_id', technicianId)
      .single();

    if (tErr || !tech) return res.status(404).json({ error: 'Technician not found' });

    // Assign the booking
    await supabaseAdmin
      .from('bookings')
      .update({ technician_id: technicianId, booking_status: 'Assigned', updated_at: new Date().toISOString() })
      .eq('booking_id', bookingId);

    await supabaseAdmin
      .from('technicians')
      .update({ availability_status: 'Busy' })
      .eq('technician_id', technicianId);

    // Notify technician
    await createNotification({
      recipientRole: 'TECHNICIAN',
      userId: tech.user_id,
      bookingId,
      title: 'Emergency Job Accepted',
      description: `You have been assigned to emergency booking #${bookingId}. Address: ${booking.street}, ${booking.city}`,
      notificationType: 'Assignment',
      priority: 'High'
    });

    // Notify customer
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

    // Notify dispatcher/admin
    await createNotification({
      recipientRole: 'DISPATCHER',
      bookingId,
      title: 'Emergency Accepted',
      description: `Technician ${tech.users?.full_name} accepted emergency booking #${bookingId}.`,
      notificationType: 'Emergency',
      priority: 'High'
    });

    return res.status(200).json({ success: true, message: `${tech.users?.full_name} assigned to booking #${bookingId}` });
  } catch (err) {
    return res.status(500).json({ error: err.message });
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
