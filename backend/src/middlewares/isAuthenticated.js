import jwt from 'jsonwebtoken'
import ErrorHandler from '../middlewares/error.handler.js'
import User from '../models/user.model.js'
import { catchAsyncError } from './catchAsyncError.js'

export const isAuthenticated = catchAsyncError(async (req, res, next) => {
    const token = req.cookies.jwt;

    if (!token) {
        return next(new ErrorHandler("Not Authenticated", 401))
    }

    const decoded = jwt.verify(token, process.env.SESSION_SECRET);

    const user = await User.findById(decoded._id);

    if (!user) {
        return next(new ErrorHandler("User not found", 404));
    }

    req.user = user;

    next();
})