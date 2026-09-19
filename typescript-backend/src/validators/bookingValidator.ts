// backend/src/validators/bookingValidators.ts
// Express middleware validating incoming customer booking payloads.

import { Request, Response, NextFunction } from "express";

// ==========================================
// 1. DATA TYPES (Sir's `type ...` pattern)
// ==========================================

// IDs can arrive as numbers (1, 2) or strings ("101", UUID)
type IdType = string | number;

// The structure of the incoming request body for booking creation
type BookingRequestBody = {
  customerId?: IdType;
  categoryId?: IdType;
  problemId?: IdType | null;
  isCustomProblem?: boolean;
  issueDescription?: string | null;
  emergencyFlag?: boolean;
  emergencyReason?: string | null;
  preferredDate?: string | null;
  preferredTime?: string | null;
  anytimeService?: boolean;
  houseNumber?: string | null;
  street?: string;
  area?: string;
  city?: string;
  state?: string;
  pincode?: string;
};

// ==========================================
// 2. VALIDATOR MIDDLEWARE
// ==========================================

export const validateBooking = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Cast req.body to our explicit BookingRequestBody type
  const body = req.body as BookingRequestBody;

  const {
    customerId,
    categoryId,
    problemId,
    issueDescription,
    emergencyFlag,
    emergencyReason,
    preferredDate,
    preferredTime,
    anytimeService,
    houseNumber,
    street,
    area,
    city,
    pincode
  } = body;

  // 1. Customer is required
  if (!customerId) {
    return res.status(400).json({
      success: false,
      message: "Customer ID is required"
    });
  }

  // 2. Service category is required
  if (!categoryId) {
    return res.status(400).json({
      success: false,
      message: "Service category is required"
    });
  }

  // 3. Problem is required unless user selected a custom problem
  if (!problemId && !body.isCustomProblem) {
    return res.status(400).json({
      success: false,
      message: "Problem is required"
    });
  }

  // 4. Issue description must be present and non-empty
  if (!issueDescription || String(issueDescription).trim() === "") {
    return res.status(400).json({
      success: false,
      message: "Issue description is required"
    });
  }

  // 5. Emergency flag must strictly be a boolean
  if (typeof emergencyFlag !== "boolean") {
    return res.status(400).json({
      success: false,
      message: "Emergency flag must be true or false"
    });
  }

  // 6. Emergency reason required only when emergencyFlag is true
  if (
    emergencyFlag === true &&
    (!emergencyReason || String(emergencyReason).trim() === "")
  ) {
    return res.status(400).json({
      success: false,
      message: "Emergency reason is required"
    });
  }

  // 7. Preferred Date and Time required unless anytimeService is checked
  if (!anytimeService) {
    if (!preferredDate) {
      return res.status(400).json({
        success: false,
        message: "Preferred date is required"
      });
    }

    if (!preferredTime) {
      return res.status(400).json({
        success: false,
        message: "Preferred time is required"
      });
    }
  }

  // 8. Address validation
  if (!houseNumber) {
    return res.status(400).json({
      success: false,
      message: "House number is required"
    });
  }

  if (!street) {
    return res.status(400).json({
      success: false,
      message: "Street is required"
    });
  }

  if (!area) {
    return res.status(400).json({
      success: false,
      message: "Area is required"
    });
  }

  if (!city) {
    return res.status(400).json({
      success: false,
      message: "City is required"
    });
  }

  if (!pincode) {
    return res.status(400).json({
      success: false,
      message: "Pincode is required"
    });
  }

  // If all checks pass, proceed to the controller
  next();
};

export default validateBooking;