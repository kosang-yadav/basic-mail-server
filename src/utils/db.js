import mongoose from "mongoose";
import { User } from "./../model.js";

// function to connect db
const connectDb = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URL}`,
    );
    console.log(
      "db connected successfully...",
      connectionInstance.connection.host,
    );
  } catch (error) {
    console.log("db connection failed...", error);
  }
};

// function to register the user
const addUserDetailsToDb = async (fullname, email) => {
  try {
    const existedUser = await User.findOne({ email });

    if (existedUser)
      return {
        success: false,
        status: 500,
        message: "user already exists with the same email",
      };

    const user = await User.insertOne({ fullname, email });

    if (user._id)
      return {
        success: true,
        status: 200,
        message: "user registered successfully",
      };
  } catch (error) {
    return {
      success: false,
      status: 501,
      message: "error while registering user",
      error: error.message,
    };
  }
};

export { connectDb, addUserDetailsToDb };
