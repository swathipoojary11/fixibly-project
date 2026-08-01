const createBookingService = (bookingData) => {

    // For now, we are only preparing the booking data.
    // Supabase will be connected here later.

 const booking = {
        bookingId: "BK-" + Date.now(),
        ...bookingData,
        status: "Pending",
        paymentStatus: "Pending"
    };

    return booking;
};

module.exports = {
    createBookingService
};