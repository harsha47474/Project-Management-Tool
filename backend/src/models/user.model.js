import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      match: [/\S+@\S+\.\S+/, "Please enter a valid email"],
    },

    password: {
      type: String,
      required: true,
      minlength: [8, "Password must be at least 8 characters long"],
      select: false,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      match: [/^\+91[6-9]\d{9}$/, "Invalid phone number"],
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    verificationMethod: {
      type: String,
      enum: ["email", "phone"],
      required: true,
    },

    verificationCode: {
      type: String,
      default: null,
    },

    verificationCodeExpiry: {
      type: Date,
      default: null,
    },

    resetPasswordToken: {
      type: String,
      default: null,
    },

    resetPasswordTokenExpiry: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.generateVerificationCode = function () {
  const verificationCode = Math.floor(
    100000 + Math.random() * 900000
  ).toString();

  this.verificationCode = verificationCode;
  this.verificationCodeExpiry = new Date(Date.now() + 10 * 60 * 1000);

  return verificationCode;
};

const User = mongoose.model("User", userSchema);

export default User;