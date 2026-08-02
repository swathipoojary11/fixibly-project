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

// const express = require("express");

// const authenticateUser = require("../middleware/authMiddleware");
// const authorizeRoles = require("../middleware/roleMiddleware");

// const {
//     getServiceCategories,
//     getServiceProblems,
//     createBooking,
//     getBookingById,
//     getCustomerHistory,
//     cancelBooking,
//     submitFeedback
// } = require("../controllers/customerController");

// const router = express.Router();


// // Public customer service information
// router.get("/services", getServiceCategories);

// router.get(
//     "/services/:categoryId/problems",
//     getServiceProblems
// );

// router.post(
//     "/bookings",
//     authenticateUser,
//     createBooking
// );

// router.get(
//     "/bookings/:bookingId",
//     authenticateUser,
//     getBookingById
// );

// router.get(
//     "/history",
//     authenticateUser,
//     getCustomerHistory
// );

// router.patch(
//     "/bookings/:bookingId/cancel",
//     authenticateUser,
//     cancelBooking
// );

// router.post(
//     "/feedback",
//     authenticateUser,
//     submitFeedback
// );

// module.exports = router;

const express = require("express");

const authenticateUser = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const {
  getProfile,
  getServiceCategories,
  getServiceProblems,
  createBooking,
  getBookingById,
  getCustomerHistory,
  cancelBooking,
  submitFeedback
} = require("../controllers/customerController");

const router = express.Router();

// 1. Customer Profile
router.get(
  "/profile",
  authenticateUser,
  authorizeRoles("CUSTOMER"),
  getProfile
);

// 2. Service Catalog
router.get("/services", getServiceCategories);

router.get(
  "/services/:categoryId/problems",
  getServiceProblems
);

// 3. Bookings Lifecycle
router.post(
  "/bookings",
  authenticateUser,
  authorizeRoles("CUSTOMER"),
  createBooking
);

router.get(
  "/bookings/history",
  authenticateUser,
  authorizeRoles("CUSTOMER"),
  getCustomerHistory
);

router.get(
  "/bookings/:bookingId",
  authenticateUser,
  authorizeRoles("CUSTOMER"),
  getBookingById
);

router.patch(
  "/bookings/:bookingId/cancel",
  authenticateUser,
  authorizeRoles("CUSTOMER"),
  cancelBooking
);

// 4. Feedback
router.post(
  "/feedback",
  authenticateUser,
  authorizeRoles("CUSTOMER"),
  submitFeedback
);

module.exports = router;