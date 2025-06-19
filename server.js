import dotenv from "dotenv";
import app from "./app.js";

dotenv.config();

const PORT = process.env.PORT || 5000;
const ENV = process.env.NODE_ENV || "development";

try {
  const server = app.listen(PORT, () => {
    console.log(`Server running in ${ENV} mode on port ${PORT}`);
  });

  server.on("error", (err) => {
    console.error("Server startup error:", err.message);
    process.exit(1);
  });
} catch (error) {
  console.error("Unexpected error during server startup:", error.message);
  process.exit(1);
}
