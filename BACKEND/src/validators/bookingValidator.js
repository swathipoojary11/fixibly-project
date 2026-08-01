const validateBooking = (req, res, next) => {

    const {
        customer_id,
        category_id,
        problem_id,
        issue_description,
        emergency_flag,
        emergency_reason,
        preferred_date,
        preferred_time,
        anytime_service,
        house_number,
        street,
        area,
        city,
        state,
        pincode
    } = req.body;


    // Customer is required
    if (!customer_id) {
        return res.status(400).json({
            success: false,
            message: "Customer ID is required"
        });
    }


    // Service category is required
    if (!category_id) {
        return res.status(400).json({
            success: false,
            message: "Service category is required"
        });
    }


    // Problem is required
    if (!problem_id) {
        return res.status(400).json({
            success: false,
            message: "Problem is required"
        });
    }


    // Issue description
    if (!issue_description || issue_description.trim() === "") {
        return res.status(400).json({
            success: false,
            message: "Issue description is required"
        });
    }


    // Emergency must be boolean
    if (typeof emergency_flag !== "boolean") {
        return res.status(400).json({
            success: false,
            message: "Emergency flag must be true or false"
        });
    }


    // Emergency reason required only for emergency booking
    if (
        emergency_flag === true &&
        (!emergency_reason || emergency_reason.trim() === "")
    ) {
        return res.status(400).json({
            success: false,
            message: "Emergency reason is required"
        });
    }


    // Date/time required unless anytime service
    if (!anytime_service) {

        if (!preferred_date) {
            return res.status(400).json({
                success: false,
                message: "Preferred date is required"
            });
        }

        if (!preferred_time) {
            return res.status(400).json({
                success: false,
                message: "Preferred time is required"
            });
        }
    }


    // Address validation
    if (!house_number) {
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

    if (!state) {
        return res.status(400).json({
            success: false,
            message: "State is required"
        });
    }

    if (!pincode) {
        return res.status(400).json({
            success: false,
            message: "Pincode is required"
        });
    }


    next();
};


module.exports = validateBooking;