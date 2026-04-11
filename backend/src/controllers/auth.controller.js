import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/error.handler.js";
import User from "../models/user.model.js";
import { sendVerificationCode } from "../utils/sendVerificationCode.js";
import { generateToken } from "../utils/generateToken.js";

// Compiled once at module level
const phoneRegex = /^\+91[6-9]\d{9}$/;
export const registerUser = catchAsyncError(async (req, res, next) => {
    const { email, name, password, phone, verificationMethod } = req.body;

    if (!email || !name || !password || !phone || !verificationMethod) {
        return next(new ErrorHandler("Missing Credentials", 400));
    }

    if (!phoneRegex.test(phone)) {
        return next(new ErrorHandler("Invalid Phone Number", 400));
    }

    // Block verified users
    const verifiedUser = await User.findOne({
        $or: [
            { email, isVerified: true },
            { phone, isVerified: true },
        ],
    });

    if (verifiedUser) {
        return next(new ErrorHandler("User already exists", 400));
    }

    // Find any unverified user with matching email OR phone
    let user = await User.findOne({
        $or: [{ email }, { phone }],
        isVerified: false,
    });

    if (user) {
        if (user.email !== email || user.phone !== phone) {
            // Conflict — e.g. same phone, different email. Wipe and start fresh
            await User.deleteOne({ _id: user._id });
            user = new User({ email, name, password, phone, verificationMethod });
        } else {
            // Same credentials retry — just update
            user.name = name;
            user.password = password;
            user.verificationMethod = verificationMethod;
        }
    } else {
        user = new User({ email, name, password, phone, verificationMethod });
    }

    const verificationCode = user.generateVerificationCode();
    await user.save();

    await sendVerificationCode(verificationMethod, email, phone, verificationCode);

    res.status(200).json({
        success: true,
        message: "Verification code sent successfully",
    });
});


export const otpVerification = catchAsyncError(async (req, res, next) => {
    const { email, phone, otp } = req.body;

    if (!otp || (!email && !phone)) {
        return next(new ErrorHandler("Email or phone and OTP required", 400));
    }

    const user = await User.findOne(
        email ? { email } : { phone }
    );

    if (!user) {
        return next(new ErrorHandler("User not found", 404));
    }

    if (!user.verificationCode || user.verificationCode !== otp) {
        return next(new ErrorHandler("Invalid OTP", 400));
    }

    if (!user.verificationCodeExpiry || user.verificationCodeExpiry < Date.now()) {
        return next(new ErrorHandler("OTP expired", 400));
    }

    user.isVerified = true;
    user.verificationCode = null;
    user.verificationCodeExpiry = null;

    await user.save({ validateModifiedOnly: true });

    // generateToken MUST come before res.json() — it sets a cookie header
    // Calling it after res.json() throws ERR_HTTP_HEADERS_SENT
    generateToken(user._id, res);

    res.status(200).json({
        success: true,
        message: "OTP verified successfully",
        user,
    });
});

export const login = catchAsyncError(async (req, res, next) => {
    const { email, phone, password } = req.body;

    if ((!email && !phone) || !password) {
        return next(new ErrorHandler("Email or phone and password are required", 400));
    }

    const verifiedUser = await User.findOne({
        $or: [
            ...(email ? [{ email, isVerified: true }] : []),
            ...(phone ? [{ phone, isVerified: true }] : []),
        ]
    }).select("+password");

    if (!verifiedUser) {
        return next(new ErrorHandler("User not found", 404));
    }

    const isPasswordMatched = await verifiedUser.comparePassword(password);

    if (!isPasswordMatched) {
        return next(new ErrorHandler("Invalid Password", 400));
    }

    generateToken(verifiedUser._id, res);

    return res.status(200).json({
        success: true,
        message: "Login successful",
        user: verifiedUser,
    });
});


export const logout = catchAsyncError(async (req, res, next) => {
    res.cookie("jwt", "", {
        expires: new Date(0),
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV !== "development"
    });

    return res.status(200).json({
        success: true,
        message: "Logout successful",
    });
})