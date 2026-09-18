const validateBooking = (req, res, next) => {

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
        state,
        pincode
    } = req.body;


    // Customer is required
    if (!customerId) {
        return res.status(400).json({
            success: false,
            message: "Customer ID is required"
        });
    }


    // Service category is required
    if (!categoryId) {
        return res.status(400).json({
            success: false,
            message: "Service category is required"
        });
    }


    // Problem is required
    if (!problemId && !req.body.isCustomProblem) {
        return res.status(400).json({
            success: false,
            message: "Problem is required"
        });
    }


    // Issue description
    if (!issueDescription || issueDescription.trim() === "") {
        return res.status(400).json({
            success: false,
            message: "Issue description is required"
        });
    }


    // Emergency must be boolean
    if (typeof emergencyFlag !== "boolean") {
        return res.status(400).json({
            success: false,
            message: "Emergency flag must be true or false"
        });
    }


    // Emergency reason required only for emergency booking
    if (
        emergencyFlag === true &&
        (!emergencyReason || emergencyReason.trim() === "")
    ) {
        return res.status(400).json({
            success: false,
            message: "Emergency reason is required"
        });
    }


    // Date/time required unless anytime service
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


    // Address validation
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

    // if (!state) {
    //     return res.status(400).json({
    //         success: false,
    //         message: "State is required"
    //     });
    // }

    if (!pincode) {
        return res.status(400).json({
            success: false,
            message: "Pincode is required"
        });
    }


    next();
};


module.exports = validateBooking;