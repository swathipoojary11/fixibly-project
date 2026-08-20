// backend/src/repositories/bookingRepository.js
// Supabase database repository handling all Customer Module table queries.

const supabase = require('../config/supabase');

class BookingRepository {
  // Fetch user profile from 'users' table using user_id
  async getUserProfile(userId) {
    // Querying the users table to get logged-in customer contact info
    const { data, error } = await supabase
      .from('users')
      .select('user_id, full_name, email, phone, address')
      .eq('user_id', userId)
      .single();

    if (error) {
      console.error('Error fetching user profile:', error.message);
      throw error;
    }
    return data;
  }

  // Fetch service category by category_id
  async getCategoryById(categoryId) {
    // Querying service_categories table for category name and image URL
    const { data, error } = await supabase
      .from('service_categories')
      .select('category_id, category_name, category_image_url')
      .eq('category_id', categoryId)
      .single();

    if (error) {
      console.error('Error fetching service category:', error.message);
      return null;
    }
    return data;
  }

  // Fetch single service problem by problem_id
  async getProblemById(problemId) {
    if (!problemId) return null;
    // Querying service_problems table to fetch fixed price
    const { data, error } = await supabase
      .from('service_problems')
      .select('problem_id, problem_name, fixed_price')
      .eq('problem_id', problemId)
      .single();

    if (error) return null;
    return data;
  }

  // Fetch active predefined problems for a specific category
  async getCategoryProblems(categoryId) {
    // Querying service_problems table for active problems under this category
    const { data, error } = await supabase
      .from('service_problems')
      .select('problem_id, problem_name, fixed_price')
      .eq('category_id', categoryId)
      .eq('is_active', true);

    if (error) {
      console.error('Error fetching category problems:', error.message);
      return [];
    }
    return data || [];
  }

  // Fetch Customer Dashboard Overview (User profile, booking stats, unread notifications count, categories)
  async getCustomerDashboard(userId) {
    // 1. Fetching customer user details
    const user = await this.getUserProfile(userId);

    // 2. Fetching all bookings for this customer to calculate status counts
    const { data: bookings, error: bookingsError } = await supabase
      .from('bookings')
      .select(`
        *,
        service_categories ( category_name, category_image_url ),
        service_problems ( problem_name, fixed_price )
      `)
      .eq('customer_id', userId)
      .order('booking_id', { ascending: false });

    if (bookingsError) {
      console.error('Error fetching dashboard bookings:', bookingsError.message);
    }

    const allBookings = bookings || [];

    // Calculating status counts
    const totalBookings = allBookings.length;
    const pendingBookings = allBookings.filter(b => b.booking_status === 'Pending').length;
    const activeBookings = allBookings.filter(b => ['Assigned', 'Accepted', 'On The Way', 'Arrived', 'Working', 'Waiting for Customer Confirmation'].includes(b.booking_status)).length;
    const completedBookings = allBookings.filter(b => b.booking_status === 'Completed').length;
    const cancelledBookings = allBookings.filter(b => b.booking_status === 'Cancelled').length;

    // Last 3 bookings preview for dashboard
    const historyPreview = allBookings.slice(0, 3);

    // 3. Counting unread notifications for the logged-in customer
    const { count: unreadCount } = await supabase
      .from('notifications')
      .select('notification_id', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('is_read', false);

    // 4. Fetching top active service categories preview
    const { data: categories } = await supabase
      .from('service_categories')
      .select('*')
      .eq('is_active', true)
      .order('category_id', { ascending: true })
      .limit(6);

    return {
      customer: user,
      stats: {
        total: totalBookings,
        pending: pendingBookings,
        active: activeBookings,
        completed: completedBookings,
        cancelled: cancelledBookings
      },
      historyPreview,
      notificationsCount: unreadCount || 0,
      categories: categories || []
    };
  }

  // Create new booking with history, notifications, and activity log entries
  async createBookingTransaction(bookingData) {
    const isEmergency = Boolean(bookingData.emergencyFlag);

    // Sanitizing preferred_date and preferred_time to convert empty strings to null (prevents PostgreSQL DATE/TIME casting errors)
    const preferredDate = (bookingData.preferredDate && String(bookingData.preferredDate).trim() !== '')
      ? bookingData.preferredDate
      : null;
    const preferredTime = (bookingData.preferredTime && String(bookingData.preferredTime).trim() !== '')
      ? bookingData.preferredTime
      : null;

    // Sanitizing problem_id (allows null for custom "Other" problems)
    const problemId = (bookingData.problemId && !isNaN(Number(bookingData.problemId)))
      ? Number(bookingData.problemId)
      : null;

    // Sanitizing issue description text
    const issueDescription = bookingData.issueDescription || bookingData.customProblemDescription || null;

    // Sanitizing address text fields
    const houseNumber = bookingData.houseNumber || null;
    const apartmentName = bookingData.apartmentName || null;
    const street = bookingData.street || '';
    const area = bookingData.area || '';
    const city = bookingData.city || 'Mangalore';
    const state = bookingData.state || 'Karnataka';
    const pincode = bookingData.pincode || '';

    // Slicing string fields to max safe length (95 chars) to prevent "value too long for type character varying(100)" database errors
    const safeStreet = String(street).substring(0, 95);
    const safeArea = String(area).substring(0, 95);
    const safeCity = String(city).substring(0, 95);
    const safeState = String(state).substring(0, 95);
    const safePincode = String(pincode).substring(0, 10);
    const safeIssueDescription = issueDescription ? String(issueDescription).substring(0, 95) : null;
    const safeEmergencyReason = (isEmergency && bookingData.emergencyReason) ? String(bookingData.emergencyReason).substring(0, 95) : null;
    const safeHouseNumber = houseNumber ? String(houseNumber).substring(0, 50) : null;
    const safeApartmentName = apartmentName ? String(apartmentName).substring(0, 95) : null;

    // 1. Inserting primary record into 'bookings' table
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .insert([
        {
          customer_id: bookingData.customerId,
          category_id: Number(bookingData.categoryId),
          problem_id: problemId,
          issue_description: safeIssueDescription,
          emergency_flag: isEmergency,
          emergency_reason: safeEmergencyReason,
          priority: isEmergency ? 'Emergency' : 'Normal',
          preferred_date: bookingData.anytimeService ? null : preferredDate,
          preferred_time: bookingData.anytimeService ? null : preferredTime,
          anytime_service: Boolean(bookingData.anytimeService),
          booking_status: 'Pending',
          house_number: safeHouseNumber,
          apartment_name: safeApartmentName,
          street: safeStreet,
          area: safeArea,
          city: safeCity,
          state: safeState,
          pincode: safePincode,
          estimated_amount: bookingData.estimatedAmount || null
        }
      ])
      .select()
      .single();

    if (bookingError) {
      console.error('Error creating primary booking record:', bookingError.message);
      throw new Error(`Booking Creation Failed: ${bookingError.message}`);
    }

    const bookingId = booking.booking_id;

    // 2. Logging initial 'Pending' status into 'booking_status_history' table
    await supabase.from('booking_status_history').insert([
      { booking_id: bookingId, status: 'Pending' }
    ]);

    // 3. Recording Advance Payment in 'payments' table if emergency booking
    if (isEmergency && bookingData.advanceAmount > 0) {
      await supabase.from('payments').insert([
        {
          booking_id: bookingId,
          amount: bookingData.advanceAmount,
          payment_status: 'Successful',
          payment_type: 'Advance'
        }
      ]);
    }

    // 4. Sending new service request notification to Dispatchers in 'notifications' table
    await supabase.from('notifications').insert([
      {
        booking_id: bookingId,
        title: isEmergency ? '🚨 Emergency Booking Request' : 'New Service Booking',
        description: `New ${isEmergency ? 'Emergency' : 'Normal'} booking #${bookingId} received. Awaiting dispatcher assignment.`.substring(0, 95),
        notification_type: isEmergency ? 'Emergency' : 'Booking',
        priority: isEmergency ? 'High' : 'Medium',
        recipient_role: 'DISPATCHER'
      }
    ]);

    // 5. Recording audit trail entry in 'activity_logs' table
    await supabase.from('activity_logs').insert([
      {
        user_id: bookingData.customerId,
        booking_id: bookingId,
        activity_type: 'Booking Creation',
        activity_description: `Customer created booking #${bookingId}`.substring(0, 95)
      }
    ]);

    return booking;
  }

  // Fetch Booking Details by ID with category, problem, and assigned technician profile
  async getBookingDetailsById(bookingId) {
    // Querying bookings table with foreign key relations to service_categories, service_problems, and technicians
    const { data: booking, error } = await supabase
      .from('bookings')
      .select(`
        *,
        service_categories ( category_name, category_image_url ),
        service_problems ( problem_name, fixed_price ),
        technicians (
          technician_id,
          rating,
          experience,
          availability_status,
          profile_picture,
          users ( full_name, phone, email )
        )
      `)
      .eq('booking_id', bookingId)
      .single();

    if (error) {
      console.error('Error fetching booking details by ID:', error.message);
      return null;
    }
    return booking;
  }

  // Fetch Live Tracking timeline history and technician location
  async getBookingTrackingDetails(bookingId) {
    // 1. Fetching booking details
    const booking = await this.getBookingDetailsById(bookingId);
    if (!booking) return null;

    // 2. Fetching status updates history from 'booking_status_history' table
    const { data: statusHistory } = await supabase
      .from('booking_status_history')
      .select('*')
      .eq('booking_id', bookingId)
      .order('status_history_id', { ascending: true });

    // 3. Fetching assigned technician's live coordinates from 'technician_locations' table
    let technicianLocation = null;
    if (booking.technician_id) {
      const { data: loc } = await supabase
        .from('technician_locations')
        .select('*')
        .eq('technician_id', booking.technician_id)
        .single();

      if (loc) technicianLocation = loc;
    }

    return {
      booking,
      statusHistory: statusHistory || [],
      technicianLocation
    };
  }

  // Cancel Booking with 40-minute ETA window rule enforcement
  async cancelBookingById(bookingId, userId, cancellationReason) {
    const booking = await this.getBookingDetailsById(bookingId);
    if (!booking) {
      throw new Error('BOOKING_NOT_FOUND');
    }

    if (booking.booking_status === 'Completed' || booking.booking_status === 'Cancelled') {
      throw new Error(`CANNOT_CANCEL_STATUS_${booking.booking_status}`);
    }

    // Checking if technician estimated arrival is within 40 minutes
    if (booking.estimated_arrival) {
      const etaTime = new Date(booking.estimated_arrival).getTime();
      const currentTime = new Date().getTime();
      const diffMinutes = (etaTime - currentTime) / (1000 * 60);

      if (diffMinutes >= 0 && diffMinutes <= 40) {
        throw new Error('ETA_WITHIN_40_MINUTES');
      }
    }

    const safeReason = cancellationReason ? String(cancellationReason).substring(0, 95) : 'Cancelled by customer';

    // Updating booking status to Cancelled in 'bookings' table
    const { data: updatedBooking, error: updateError } = await supabase
      .from('bookings')
      .update({
        booking_status: 'Cancelled',
        cancelled_at: new Date().toISOString(),
        cancelled_by: userId,
        cancellation_reason: safeReason
      })
      .eq('booking_id', bookingId)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating cancelled booking:', updateError.message);
      throw updateError;
    }

    // Logging 'Cancelled' status in 'booking_status_history' table
    await supabase.from('booking_status_history').insert([
      { booking_id: bookingId, status: 'Cancelled' }
    ]);

    // Sending cancellation notification to Dispatcher
    await supabase.from('notifications').insert([
      {
        booking_id: bookingId,
        title: 'Booking Cancelled',
        description: `Booking #${bookingId} was cancelled. Reason: ${safeReason}`.substring(0, 95),
        notification_type: 'Cancellation',
        priority: 'High',
        recipient_role: 'DISPATCHER'
      }
    ]);

    // Sending cancellation notification to Technician if assigned
    if (booking.technician_id) {
      await supabase.from('notifications').insert([
        {
          booking_id: bookingId,
          title: 'Assigned Job Cancelled',
          description: `Job #${bookingId} assigned to you was cancelled by the customer.`.substring(0, 95),
          notification_type: 'Cancellation',
          priority: 'High',
          recipient_role: 'TECHNICIAN'
        }
      ]);
    }

    // Logging action in 'activity_logs' table
    await supabase.from('activity_logs').insert([
      {
        user_id: userId,
        booking_id: bookingId,
        activity_type: 'Status Update',
        activity_description: `Customer cancelled booking #${bookingId}`.substring(0, 95)
      }
    ]);

    return updatedBooking;
  }

  // STEP 2: Customer Job Completion Handshake (Sets status = Completed, customer_completed_flag = true, unlocks technician completion)
  async completeBookingById(bookingId, userId) {
    const booking = await this.getBookingDetailsById(bookingId);
    if (!booking) {
      throw new Error('BOOKING_NOT_FOUND');
    }

    // Updating booking flags & status to Completed in 'bookings' table
    const { data: updatedBooking, error: updateError } = await supabase
      .from('bookings')
      .update({
        booking_status: 'Completed',
        customer_completed_flag: true,
        updated_at: new Date().toISOString()
      })
      .eq('booking_id', bookingId)
      .select()
      .single();

    if (updateError) {
      console.error('Error marking booking completed:', updateError.message);
      throw updateError;
    }

    // Logging 'Completed' in 'booking_status_history' table
    await supabase.from('booking_status_history').insert([
      { booking_id: bookingId, status: 'Completed' }
    ]);

    // Resetting technician availability status back to 'Available' in 'technicians' table
    if (booking.technician_id) {
      await supabase
        .from('technicians')
        .update({ availability_status: 'Available' })
        .eq('technician_id', booking.technician_id);
    }

    // Sending completion notifications to Dispatcher and Technician
    await supabase.from('notifications').insert([
      {
        booking_id: bookingId,
        title: 'Job Completed',
        description: `Customer confirmed job completion for booking #${bookingId}.`.substring(0, 95),
        notification_type: 'Booking',
        priority: 'Low',
        recipient_role: 'DISPATCHER'
      }
    ]);

    // Logging activity trail entry
    await supabase.from('activity_logs').insert([
      {
        user_id: userId,
        booking_id: bookingId,
        activity_type: 'Status Update',
        activity_description: `Customer confirmed job completion for booking #${bookingId}`.substring(0, 95)
      }
    ]);

    return updatedBooking;
  }

  // STEP 4: Submit Technician Feedback, trigger Dispatcher Notification, and recalculate technician average rating
  async submitFeedback(bookingId, customerId, feedbackData) {
    const booking = await this.getBookingDetailsById(bookingId);
    if (!booking) {
      throw new Error('BOOKING_NOT_FOUND');
    }

    const technicianId = booking.technician_id || feedbackData.technicianId || null;

    const {
      overallRating,
      professionalBehaviour,
      serviceQuality,
      timeliness,
      cleanliness,
      problemResolution,
      comments
    } = feedbackData;

    const safeComments = comments ? String(comments).substring(0, 95) : '';

    // 1. Inserting feedback ratings into 'feedback' table
    const { data: feedback, error: feedbackError } = await supabase
      .from('feedback')
      .insert([
        {
          booking_id: bookingId,
          customer_id: customerId,
          technician_id: technicianId,
          overall_rating: parseInt(overallRating) || 5,
          professional_behaviour: parseInt(professionalBehaviour) || 5,
          service_quality: parseInt(serviceQuality) || 5,
          timeliness: parseInt(timeliness) || 5,
          cleanliness: parseInt(cleanliness) || 5,
          problem_resolution: parseInt(problemResolution) || 5,
          comments: safeComments
        }
      ])
      .select()
      .single();

    if (feedbackError) {
      console.error('Error submitting feedback:', feedbackError.message);
      throw feedbackError;
    }

    // 2. TRIGGERING NOTIFICATION ENTRY FOR DISPATCHER IN 'notifications' TABLE
    await supabase.from('notifications').insert([
      {
        booking_id: bookingId,
        title: '⭐ Technician Feedback Received',
        description: `Customer submitted a ${overallRating}-star rating for booking #${bookingId}.`.substring(0, 95),
        notification_type: 'Feedback',
        priority: 'Low',
        recipient_role: 'DISPATCHER'
      }
    ]);

    // 3. Recalculating average rating for assigned technician in 'technicians' table if assigned
    if (technicianId) {
      const { data: allTechFeedback } = await supabase
        .from('feedback')
        .select('overall_rating')
        .eq('technician_id', technicianId);

      if (allTechFeedback && allTechFeedback.length > 0) {
        const sum = allTechFeedback.reduce((acc, item) => acc + item.overall_rating, 0);
        const avgRating = parseFloat((sum / allTechFeedback.length).toFixed(1));

        await supabase
          .from('technicians')
          .update({ rating: avgRating })
          .eq('technician_id', technicianId);
      }
    }

    return feedback;
  }

  // Submit General Platform / App Feedback into 'app_feedback' table
  async submitAppFeedback(customerId, rating, comments) {
    const safeComments = comments ? String(comments).substring(0, 95) : '';
    const { data, error } = await supabase
      .from('app_feedback')
      .upsert(
        [
          {
            customer_id: customerId,
            rating: parseInt(rating) || 5,
            comments: safeComments
          }
        ],
        { onConflict: 'customer_id' }
      )
      .select()
      .single();

    if (error) {
      console.error('Error in submitAppFeedback:', error.message);
      throw error;
    }
    return data;
  }

  // Fetch Complete Booking History for customer (Confirmed/Active, Completed, Cancelled)
  async getCustomerHistory(userId) {
    // Querying all bookings for the customer sorted by booking_id DESC
    const { data, error } = await supabase
      .from('bookings')
      .select(`
        *,
        service_categories ( category_name, category_image_url ),
        service_problems ( problem_name, fixed_price ),
        technicians (
          technician_id,
          rating,
          users ( full_name, phone )
        )
      `)
      .eq('customer_id', userId)
      .order('booking_id', { ascending: false });

    if (error) {
      console.error('Error fetching customer history:', error.message);
      return [];
    }
    return data || [];
  }

  // Fetch notifications list for logged-in customer
  async getCustomerNotifications(userId) {
    // Querying notifications table for user_id or recipient_role = CUSTOMER
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .or(`user_id.eq.${userId},recipient_role.eq.CUSTOMER,recipient_role.eq.ALL`)
      .order('notification_id', { ascending: false });

    if (error) {
      console.error('Error fetching customer notifications:', error.message);
      return [];
    }
    return data || [];
  }

  // Mark specific notification as read (is_read = true)
  async markNotificationAsRead(notificationId, userId) {
    const { data, error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('notification_id', notificationId)
      .select()
      .single();

    if (error) {
      console.error('Error marking notification read:', error.message);
      throw error;
    }
    return data;
  }
}

module.exports = new BookingRepository();