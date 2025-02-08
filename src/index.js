import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import dotenv from "dotenv";
import allRoutes from "./routes/all.routes.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import response from "./utils/response.util.js";
import swaggerUi from "swagger-ui-express";
import docs from "./documentation/index.js";
import signup from "./models/signup.models.js";

const app = express();

const corsOpts = {
  origin: "*", 
  methods: ["GET", "POST", "DELETE", "PATCH", "PUT"],
  allowedHeaders: ["Content-Type", "Authorization"],
};


app.use(cors(corsOpts));

dotenv.config();

// Use middleware for parsing cookies, JSON data, etc.
app.use(cookieParser());
app.use(bodyParser.json());

// Create a default user (you may remove or modify this based on your needs)
const newUser = new signup({
  email: "newuser@example.com",
  username: "newuser",
  password: "securepassword",  // Remember to hash passwords for production
  role: "user",
  wallet: 0,
});

// Define a test route
app.get("/", (req, res) =>
  response.success(res, 200, "Welcome to the backend of my project.")
);

// Swagger API docs route
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(docs));

// All API routes (as defined in ./routes/all.routes.js)
app.use(allRoutes);

// Database connection and server setup
const port = process.env.PORT || 4000;
mongoose.set("strictQuery", true);
mongoose
  .connect(`${process.env.MONGO_URL}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(async () => {
    console.log("Connected to the database");
    // Uncomment to create a new user in the database
    // try {
    //   const savedUser = await newUser.save();
    //   console.log("User saved:", savedUser);
    // } catch (err) {
    //   console.error(err.message);
    // }
  })
  .catch((err) => {
    console.log("Error connecting to database:", err);
  });

// Start the server
app.listen(port, () => {
  console.log(`The server is listening at http://localhost:${port}`);
});
