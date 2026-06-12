const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// In-memory store for demo purposes (replace with a database in production)
const enquiries = [];

/**
 * POST /api/enquiry
 * Accepts registration form data: { name, email, phone, workshop }
 * Validates required fields, stores the enquiry, and returns a confirmation.
 */
app.post("/api/enquiry", (req, res) => {
  const { name, email, phone, workshop } = req.body || {};

  // Basic validation
  if (!name || !email || !phone) {
    return res.status(400).json({
      success: false,
      message: "Name, email, and phone are required fields.",
    });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      message: "Please provide a valid email address.",
    });
  }

  const phoneRegex = /^[+0-9\s-]{7,15}$/;
  if (!phoneRegex.test(phone)) {
    return res.status(400).json({
      success: false,
      message: "Please provide a valid phone number.",
    });
  }

  const enquiry = {
    id: enquiries.length + 1,
    name,
    email,
    phone,
    workshop: workshop || "AI & Robotics Summer Workshop",
    submittedAt: new Date().toISOString(),
  };

  enquiries.push(enquiry);

  console.log("New enquiry received:", enquiry);

  return res.status(201).json({
    success: true,
    message: "Enquiry received successfully. Our team will contact you soon.",
    data: enquiry,
  });
});

// Optional: list all enquiries (for admin/testing)
app.get("/api/enquiry", (req, res) => {
  res.json({ success: true, count: enquiries.length, data: enquiries });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
