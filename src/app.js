import express from "express";
import bodyParser from "body-parser";
import { addUserDetailsToDb } from "./utils/db.js";
import { sendMail } from "./utils/mail.js";

// initialise an express app
export const app = express();

// used bodyParser middleware for passing the json to request object
app.use(bodyParser.json());

app.post("/", async (req, res) => {
  const { fullname, email } = req.body;

  try {
    const userRegisteration = await addUserDetailsToDb(fullname, email);

    if (!userRegisteration.success) {
      console.log(userRegisteration.message);
      console.log(userRegisteration.error);
      return res.status(userRegisteration.status).send({
        success: userRegisteration.success,
        message: userRegisteration.message + ". failed to register the user",
      });
    }

    console.log("user registered successfully");

    const mailStatus = await sendMail(fullname, email);

    if (!mailStatus.success) {
      console.log(mailStatus.message);
      console.log(mailStatus.error);
      return res.status(mailStatus.status).send({
        success: mailStatus.success,
        message: mailStatus.message + ". failed to send the mail to user",
      });
    }

    console.log("mail sent successfully");

    return res.status(200).send({
      success: true,
      message: "user registered and mail sent successfully.",
    });
  } catch (error) {
    console.error();
    return res.status(500).send({
      success: false,
      message: "failed to either register the user or sending the mail to user",
      error: error.message,
    });
  }
});
