import jwt from 'jsonwebtoken';

export const generateToken = (userId,res) => {
    // generate a token 
    const token = jwt.sign({userId}, process.env.SESSION_SECRET, {expiresIn: '15d'});

    // set token in cookie
    res.cookie("jwt", token, {
        maxAge: 15*24*60*60*1000,
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV !== "development"
    });

    return token;
}
