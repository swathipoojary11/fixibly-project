export const verifyTechnician = (req, res, next) => {

    req.user = {
        id: 1,
        role: "Technician",
        name: "Rahul Sharma"
    };

    next();

};