import mongoose from "mongoose";
import validator from "express-validator";
import jwt from "jsonwebtoken";

const { check } = validator;

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!check(value).isEmail()) {
          throw new Error("Email invalid ");
        }
      },
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    address: {
      type: String,
    },
    avatar: {
      type: String,
    },
    phone: {
      type: String,
    },
    date: {
      type: Date,
      default: Date.now(),
    },
  },
  {
    timestamps: true,
  }
);

// UserSchema.statics.findByCredentials = async (email, password) => {
//   const user = await User.findOne({ email });
//   if (!user) {
//     throw new Error("Email or password is not correct");
//   }
//   const isMatch = await bcrypt.compare(password, user.password);
//   if (!isMatch) {
//     throw new Error("Email or password is not correct");
//   }
//   return user;
// };

UserSchema.methods.generateAuthToken = async function (secretKey) {
  const token = await jwt.sign({ userId: this._id.toString() }, secretKey, {
    expiresIn: 3600,
  });
  return token;
};

UserSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;

  return user;
};

const User = mongoose.model("User", UserSchema);

export default User;
