// const express = require("express");

// const router = express.Router();

// const {
//     getCustomerProfile,
//     createBooking
// } = require("../controllers/customerController");

// const validateBooking = require("../validators/bookingValidator");


// router.get("/profile", getCustomerProfile);

// router.post(
//     "/booking",
//     validateBooking,
//     createBooking
// );


// module.exports = router;


// const express = require("express");

// const {
//     getServiceCategories,
//     getServiceProblems,
//     createBooking,   getBookingById,getCustomerHistory,cancelBooking,submitFeedback
// } = require("../controllers/customerController");
// const validateBooking = require("../validators/bookingValidator");
// const router = express.Router();

// router.get("/services", getServiceCategories);
// router.get("/bookings/:bookingId", getBookingById);
// router.get("/services/:categoryId/problems", getServiceProblems);
// router.get("/history/:customerId", getCustomerHistory);
// router.patch("/bookings/:bookingId/cancel", cancelBooking);
// router.post(
//     "/bookings",
//     validateBooking,
//     createBooking
// );
// router.post("/feedback", submitFeedback);
// router.post("/bookings", createBooking);


// module.exports = router;

const express = require("express");

const authenticateUser = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const {
    getServiceCategories,
    getServiceProblems,
    createBooking,
    getBookingById,
    getCustomerHistory,
    cancelBooking,
    submitFeedback
} = require("../controllers/customerController");

const router = express.Router();


// Public customer service information
router.get("/services", getServiceCategories);

router.get(
    "/services/:categoryId/problems",
    getServiceProblems
);

router.post(
    "/bookings",
    authenticateUser,
    createBooking
);

router.get(
    "/bookings/:bookingId",
    authenticateUser,
    getBookingById
);

router.get(
    "/history",
    authenticateUser,
    getCustomerHistory
);

router.patch(
    "/bookings/:bookingId/cancel",
    authenticateUser,
    cancelBooking
);

router.post(
    "/feedback",
    authenticateUser,
    submitFeedback
);

module.exports = router;