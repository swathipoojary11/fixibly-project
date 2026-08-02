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
// const express = require("express");
// const router = express.Router();
// const { authenticateUser } = require("../middleware/authMiddleware");
// const authorizeRoles = require("../middleware/roleMiddleware");
// const {
//   getProfile,
//   getServiceCategories,
//   getServiceProblems,
//   createBooking,
//   getBookingById,
//   getCustomerHistory,
//   cancelBooking,
//   submitFeedback
// } = require("../controllers/customerController");

// // 1. Customer Profile
// router.get(
//   "/profile",
//   authenticateUser,
//   authorizeRoles("Customer"),
//   getProfile
// );

// // 2. Service Catalog
// router.get("/services", getServiceCategories);

// router.get(
//   "/services/:categoryId/problems",
//   getServiceProblems
// );
// router.get('/booking-init/:categoryId', authenticateToken, customerController.getBookingInitData);

// // 3. Bookings Lifecycle
// router.post(
//   "/bookings",
//   authenticateUser,
//   authorizeRoles("Customer"),
//   createBooking
// );

// router.get(
//   "/bookings/history",
//   authenticateUser,
//   authorizeRoles("Customer"),
//   getCustomerHistory
// );

// router.get(
//   "/bookings/:bookingId",
//   authenticateUser,
//   authorizeRoles("Customer"),
//   getBookingById
// );

// router.patch(
//   "/bookings/:bookingId/cancel",
//   authenticateUser,
//   authorizeRoles("Customer"),
//   cancelBooking
// );

// // 4. Feedback
// router.post(
//   "/feedback",
//   authenticateUser,
//   authorizeRoles("Customer"),
//   submitFeedback
// );

// module.exports = router;
// const express = require("express");
// const router = express.Router();

// // Middleware Imports
// const { authenticateUser } = require("../middleware/authMiddleware");
// const authorizeRoles = require("../middleware/roleMiddleware");

// // Controller Imports
// const {
//   getProfile,
//   getServiceCategories,
//   getBookingInitData, // Added this
//   createBooking,
//   getBookingById,
//   getCustomerHistory,
//   cancelBooking,
//   submitFeedback
// } = require("../controllers/customerController");

// // 1. Customer Profile
// router.get(
//   "/profile",
//   authenticateUser,
//   authorizeRoles("Customer"),
//   getProfile
// );

// // 2. Service Catalog
// router.get("/services", getServiceCategories);

// // Step 1: Init Data for Booking (Profile + Categories + Problems)
// router.get(
//   "/booking-init/:categoryId",
//   authenticateUser, // Fixed: changed from authenticateToken
//   authorizeRoles("Customer"),
//   getBookingInitData // Fixed: changed from customerController.getBookingInitData
// );

// // 3. Bookings Lifecycle
// router.post(
//   "/bookings",
//   authenticateUser,
//   authorizeRoles("Customer"),
//   createBooking
// );

// router.get(
//   "/bookings/history",
//   authenticateUser,
//   authorizeRoles("Customer"),
//   getCustomerHistory
// );

// router.get(
//   "/bookings/:bookingId",
//   authenticateUser,
//   authorizeRoles("Customer"),
//   getBookingById
// );

// router.patch(
//   "/bookings/:bookingId/cancel",
//   authenticateUser,
//   authorizeRoles("Customer"),
//   cancelBooking
// );

// // 4. Feedback
// router.post(
//   "/feedback",
//   authenticateUser,
//   authorizeRoles("Customer"),
//   submitFeedback
// );

// router.post('/bookings/summary', authenticateToken, customerController.getBookingSummary);
// module.exports = router;

const express = require("express");
const router = express.Router();

// Middleware Imports
const { authenticateUser } = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

// Controller Imports
const {
  getProfile,
  getServiceCategories,
  getBookingInitData,
  createBooking,
  getBookingById,
  getCustomerHistory,
  cancelBooking,
  submitFeedback,
  getBookingSummary // Added missing import here
} = require("../controllers/customerController");

// 1. Customer Profile
router.get(
  "/profile",
  authenticateUser,
  authorizeRoles("Customer"),
  getProfile
);

// 2. Service Catalog
router.get("/services", getServiceCategories);

// Step 1: Init Data for Booking (Profile + Categories + Problems)
router.get(
  "/booking-init/:categoryId",
  authenticateUser,
  authorizeRoles("Customer"),
  getBookingInitData
);

// 3. Bookings Lifecycle
router.post(
  "/bookings/summary",
  authenticateUser,
  authorizeRoles("Customer"),
  getBookingSummary
);

router.post(
  "/bookings",
  authenticateUser,
  authorizeRoles("Customer"),
  createBooking
);

router.get(
  "/bookings/history",
  authenticateUser,
  authorizeRoles("Customer"),
  getCustomerHistory
);

router.get(
  "/bookings/:bookingId",
  authenticateUser,
  authorizeRoles("Customer"),
  getBookingById
);

router.patch(
  "/bookings/:bookingId/cancel",
  authenticateUser,
  authorizeRoles("Customer"),
  cancelBooking
);

// 4. Feedback
router.post(
  "/feedback",
  authenticateUser,
  authorizeRoles("Customer"),
  submitFeedback
);

module.exports = router;