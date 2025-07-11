import dotenv from "dotenv";
import { app } from "./app.js";
import { connectDb } from "./utils/db.js";

// load environment variables in the app
dotenv.config();

const port = process.env.PORT || 12345;

connectDb()
  .then(() => {
    app.listen(port, () => {
      console.log(`api listening on port ${port}`);
    });
  })
  .catch((error) => {
    console.log(
      "failed to connect db, check internet and db connection and try again",
      error,
    );
  });
