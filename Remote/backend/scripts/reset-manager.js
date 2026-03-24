const mongoose = require("mongoose");
const User = require("../models/User");
require("dotenv").config();

async function resetManager() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("📦 Connected to MongoDB");

    // Delete existing manager if exists
    console.log("🗑️ Removing existing manager account...");
    await User.deleteOne({ email: "dhchaudhary973@gmail.com" });
    console.log("✅ Existing manager removed");

    // Create fresh manager account
    console.log("👤 Creating fresh manager account...");
    const manager = new User({
      firstName: "Manager",
      lastName: "Admin",
      email: "dhchaudhary973@gmail.com",
      password: "dhp@973", // This will be hashed by the pre-save middleware
      role: "manager",
      isActive: true,
      isApproved: true,
      department: "Management",
      jobTitle: "System Administrator"
    });

    await manager.save();
    console.log("✅ Fresh manager account created successfully!");

    // Verify the account
    const verifyManager = await User.findOne({ email: "dhchaudhary973@gmail.com" }).select("+password");
    console.log("🔍 Verification:");
    console.log("👤 Name:", verifyManager.firstName, verifyManager.lastName);
    console.log("📧 Email:", verifyManager.email);
    console.log("🎯 Role:", verifyManager.role);
    console.log("✅ Active:", verifyManager.isActive);
    console.log("✅ Approved:", verifyManager.isApproved);
    console.log("🔒 Password Hash Length:", verifyManager.password.length);

    console.log("\n🎉 Manager account reset complete!");
    console.log("\n✅ Login Credentials:");
    console.log("📧 Email: dhchaudhary973@gmail.com");
    console.log("🔒 Password: dhp@973");
    console.log("🎯 Role: Manager");

  } catch (error) {
    console.error("❌ Error resetting manager:", error.message);
    console.error("Full error:", error);
  } finally {
    await mongoose.disconnect();
    console.log("\n📦 Disconnected from MongoDB");
    process.exit(0);
  }
}

// Run the script
resetManager();
