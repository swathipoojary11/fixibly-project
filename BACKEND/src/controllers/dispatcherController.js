const { supabaseAdmin } = require('../config/supabase');
const { createNotification } = require('../services/notificationService');
const { logAuditEvent } = require('../services/auditService');

// 1. Assign Technician (Exchanges Customer & Technician Data + Notifies Admin)
const assignTechnician = async (req, res) => {
  const { bookingId, technicianId, dispatcherUserId } = req.body;

  try {
    // A. Fetch full Booking details with joined Customer information
    const { data: booking, error: bookingFetchErr } = await supabaseAdmin
      .from('bookings')
      .select('*, customers(customer_id, name, phone, address)')
      .eq('booking_id', bookingId)
      .single();

    if (bookingFetchErr || !booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    // B. Fetch full Technician details
    const { data: technician, error: techFetchErr } = await supabaseAdmin
      .from('technicians')
      .select('technician_id, name, phone, skills')
      .eq('technician_id', technicianId)
      .single();

    if (techFetchErr || !technician) {
      return res.status(404).json({ error: 'Technician not found' });
    }

    // C. Update Booking status to ASSIGNED and attach technician_id
    const { data: updatedBooking, error: bookingErr } = await supabaseAdmin
      .from('bookings')
      .update({
        technician_id: technicianId,
        booking_status: 'ASSIGNED',
        updated_at: new Date().toISOString()
      })
      .eq('booking_id', bookingId)
      .select()
      .single();

    if (bookingErr) throw bookingErr;

    // D. Set technician status to BUSY
    await supabaseAdmin
      .from('technicians')
      .update({ availability_status: 'BUSY' })
      .eq('technician_id', technicianId);

    // E. SEND CUSTOMER DETAILS TO TECHNICIAN
    const customerInfo = booking.customers;
    const customerAddress = booking.address || customerInfo?.address || 'Address not provided';

    await createNotification({
      recipientRole: 'TECHNICIAN',
      userId: technicianId,
      bookingId,
      title: 'New Job Assigned',
      description: `New Job #${bookingId}! Customer Name: ${customerInfo?.name || 'N/A'}, Phone: ${customerInfo?.phone || 'N/A'}, Address: ${customerAddress}, Issue: ${booking.description}`,
      notificationType: 'ASSIGNMENT',
      priority: 'HIGH'
    });

    // F. SEND TECHNICIAN DETAILS TO CUSTOMER
    if (booking.customer_id) {
      await createNotification({
        recipientRole: 'CUSTOMER',
        userId: booking.customer_id,
        bookingId,
        title: 'Technician Assigned',
        description: `Technician ${technician.name} has been assigned to your booking #${bookingId}! Contact: ${technician.phone}, Skills: ${technician.skills}.`,
        notificationType: 'BOOKING'
      });
    }

    // G. NOTIFY ADMIN
    await createNotification({
      recipientRole: 'ADMIN',
      bookingId,
      title: 'Technician Assigned',
      description: `Dispatcher #${dispatcherUserId} assigned Tech #${technicianId} (${technician.name}) to Booking #${bookingId}.`,
      notificationType: 'SYSTEM'
    });

    // H. LOG AUDIT EVENT
    await logAuditEvent(
      dispatcherUserId,
      'DISPATCHER',
      'TECHNICIAN_ASSIGNED',
      `Assigned Tech #${technicianId} (${technician.name}) to Booking #${bookingId}`
    );

    return res.status(200).json({
      success: true,
      booking: updatedBooking,
      assignedTechnician: technician,
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

    // Fetch New Tech Details for Customer Notification
    const { data: newTech } = await supabaseAdmin
      .from('technicians')
      .select('name, phone, skills')
      .eq('technician_id', newTechnicianId)
      .single();

    // Update Booking
    await supabaseAdmin
      .from('bookings')
      .update({
        technician_id: newTechnicianId,
        booking_status: 'REASSIGNED',
        updated_at: new Date().toISOString()
      })
      .eq('booking_id', bookingId);

    // Free up old technician and mark new technician as BUSY
    await supabaseAdmin
      .from('technicians')
      .update({ availability_status: 'AVAILABLE' })
      .eq('technician_id', oldTechnicianId);

    await supabaseAdmin
      .from('technicians')
      .update({ availability_status: 'BUSY' })
      .eq('technician_id', newTechnicianId);

    // Notify Old Tech
    await createNotification({
      recipientRole: 'TECHNICIAN',
      userId: oldTechnicianId,
      bookingId,
      title: 'Job Unassigned',
      description: `Booking #${bookingId} has been reassigned to another technician.`,
      notificationType: 'ASSIGNMENT'
    });

    // Notify New Tech
    await createNotification({
      recipientRole: 'TECHNICIAN',
      userId: newTechnicianId,
      bookingId,
      title: 'Reassigned Job Received',
      description: `You have been reassigned to Booking #${bookingId}. Reason: ${reassignReason}`,
      notificationType: 'ASSIGNMENT',
      priority: 'HIGH'
    });

    // Notify Customer with New Tech Details
    if (booking?.customer_id) {
      await createNotification({
        recipientRole: 'CUSTOMER',
        userId: booking.customer_id,
        bookingId,
        title: 'Technician Updated',
        description: `Your booking #${bookingId} was reassigned to ${newTech?.name || 'a new technician'} (Phone: ${newTech?.phone || 'N/A'}).`,
        notificationType: 'BOOKING'
      });
    }

    // Notify Admin
    await createNotification({
      recipientRole: 'ADMIN',
      bookingId,
      title: 'Job Reassigned',
      description: `Booking #${bookingId} reassigned from Tech #${oldTechnicianId} to Tech #${newTechnicianId}. Reason: ${reassignReason}`,
      notificationType: 'SYSTEM'
    });

    await logAuditEvent(
      dispatcherUserId,
      'DISPATCHER',
      'JOB_REASSIGNED',
      `Reassigned Booking #${bookingId} from Tech #${oldTechnicianId} to #${newTechnicianId}`
    );

    return res.status(200).json({ success: true, message: 'Technician reassigned successfully' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
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

    await supabaseAdmin
      .from('bookings')
      .update({
        booking_status: status,
        cancellation_reason: cancelReason || null,
        updated_at: new Date().toISOString()
      })
      .eq('booking_id', bookingId);

    // If job finished or cancelled, free up technician
    if (booking?.technician_id) {
      await supabaseAdmin
        .from('technicians')
        .update({ availability_status: 'AVAILABLE' })
        .eq('technician_id', booking.technician_id);
    }

    // Broadcast Notifications
    const rolesToNotify = ['ADMIN', 'DISPATCHER', 'CUSTOMER'];
    if (booking?.technician_id) rolesToNotify.push('TECHNICIAN');

    for (const role of rolesToNotify) {
      let targetUserId = null;
      if (role === 'CUSTOMER') targetUserId = booking.customer_id;
      if (role === 'TECHNICIAN') targetUserId = booking.technician_id;

      await createNotification({
        recipientRole: role,
        userId: targetUserId,
        bookingId,
        title: `Booking ${status}`,
        description: `Booking #${bookingId} was marked as ${status}.${cancelReason ? ` Reason: ${cancelReason}` : ''}`,
        notificationType: status === 'CANCELLED' ? 'CANCEL' : 'BOOKING'
      });
    }

    await logAuditEvent(userId, userRole, `BOOKING_${status}`, `Booking #${bookingId} status changed to ${status}`);

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

    const { data: bookings, error: bErr } = await supabaseAdmin.from('bookings').select('*');
    if (bErr) throw bErr;

    const { data: technicians, error: tErr } = await supabaseAdmin.from('technicians').select('availability_status');
    if (tErr) throw tErr;

    const pendingBookings = bookings.filter(b => b.booking_status === 'PENDING').length;
    const availableTechnicians = technicians.filter(t => t.availability_status === 'AVAILABLE').length;
    const busyTechnicians = technicians.filter(t => t.availability_status === 'BUSY').length;

    const emergencyJobs = bookings.filter(b =>
      b.emergency_flag === true &&
      b.booking_status !== 'COMPLETED' &&
      b.booking_status !== 'CANCELLED'
    ).length;

    const cancelledToday = bookings.filter(b =>
      b.booking_status === 'CANCELLED' &&
      new Date(b.updated_at) >= todayStart
    ).length;

    return res.status(200).json({
      success: true,
      stats: {
        pendingBookings,
        availableTechnicians,
        busyTechnicians,
        emergencyJobs,
        cancelledToday
      }
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// 5. Manual Booking Endpoint (Dispatcher UI)
const createManualBooking = async (req, res) => {
  const { customerId, categoryId, description, address, priority, emergencyFlag, dispatcherUserId } = req.body;

  try {
    const { data: booking, error } = await supabaseAdmin
      .from('bookings')
      .insert([
        {
          customer_id: customerId,
          category_id: categoryId,
          description,
          address,
          priority: priority || 'NORMAL',
          emergency_flag: emergencyFlag || false,
          booking_status: 'PENDING',
          created_at: new Date().toISOString()
        }
      ])
      .select()
      .single();

    if (error) throw error;

    await logAuditEvent(
      dispatcherUserId,
      'DISPATCHER',
      'MANUAL_BOOKING_CREATED',
      `Dispatcher manually created Booking #${booking.booking_id} for Customer #${customerId}`
    );

    if (emergencyFlag) {
      await createNotification({
        recipientRole: 'TECHNICIAN',
        bookingId: booking.booking_id,
        title: 'EMERGENCY JOB AVAILABLE',
        description: `New manual emergency booking #${booking.booking_id} created. Address: ${address}`,
        notificationType: 'EMERGENCY',
        priority: 'CRITICAL'
      });
    }

    return res.status(201).json({ success: true, message: 'Manual booking created successfully', booking });
  } catch (err) {
    return res.status(500).json({ error: err.message });
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
        priority: 'NORMAL',
        updated_at: new Date().toISOString()
      })
      .eq('booking_id', bookingId)
      .select()
      .single();

    if (error) throw error;

    await logAuditEvent(
      dispatcherUserId,
      'DISPATCHER',
      'EMERGENCY_DOWNGRADED',
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
      .select('technician_id, name, availability_status, rating');

    if (error) throw error;

    const total = technicians.length;
    const available = technicians.filter(t => t.availability_status === 'AVAILABLE').length;
    const busy = technicians.filter(t => t.availability_status === 'BUSY').length;
    const offline = technicians.filter(t => t.availability_status === 'OFFLINE').length;

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
      .select('technician_id')
      .eq('availability_status', 'AVAILABLE');

    if (tErr) throw tErr;

    if (availableTechs && availableTechs.length > 0) {
      for (const tech of availableTechs) {
        await createNotification({
          recipientRole: 'TECHNICIAN',
          userId: tech.technician_id,
          bookingId,
          title: '🚨 EMERGENCY BROADCAST JOB',
          description: `Urgent booking #${bookingId} requires immediate attention! Address: ${booking.address}`,
          notificationType: 'EMERGENCY',
          priority: 'CRITICAL'
        });
      }
    }

    await logAuditEvent(
      dispatcherUserId,
      'DISPATCHER',
      'EMERGENCY_BROADCAST',
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

module.exports = {
  assignTechnician,
  reassignTechnician,
  downgradeEmergency,
  getTechnicianSummaryStats,
  updateBookingStatus,
  getDispatcherDashboardStats,
  createManualBooking,
  triggerEmergencyBroadcast
};