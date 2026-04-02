class ErrorHandler extends Error {
    constructor(message, statusCode){
        super(message);
        this.statusCode = statusCode;
    }
}

export const errorMiddleware = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal Server Error";

    if(err.name === "CastError"){
        const message = `Invalid ${err.path} : ${err.value}`;
        err = new ErrorHandler(message, 400);
    }
    else if(err.name === 'JsonWebTokenError'){
        const message = 'Invalid Token';
        err = new ErrorHandler(message, 400);
    }
    else if(err.name === 'TokenExpiredError'){
        const message = 'Token Expired';
        err = new ErrorHandler(message, 400);
    }
    else if(err.code === 11000){
        const message = `Duplicate ${Object.keys(err.keyValue)} Entered`;
        err = new ErrorHandler(message, 400);
    }

    return res.status(err.statusCode).json({
        success: false,
        message: err.message
    });
}

export default ErrorHandler;