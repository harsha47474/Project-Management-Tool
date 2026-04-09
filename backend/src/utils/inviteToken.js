import jwt from "jsonwebtoken";

export const generateInviteToken = (email, projectId) => {
    return jwt.sign(
        {
            email,
            projectId,
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "1d",
        }
    );
};

export const verifyInviteToken = (token) => {
    return jwt.verify(token, process.env.JWT_SECRET);
};