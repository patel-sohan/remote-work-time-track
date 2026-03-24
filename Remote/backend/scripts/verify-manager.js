const mongoose = require("mongoose");
const User = require("../models/User");
require("dotenv").config();

async function verifyManager() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("📦 Connected to MongoDB");

    // Find the manager account
    const manager = await User.findOne({ email: "dhchaudhary973@gmail.com" }).select("+password");
    
    if (!manager) {
      console.log("❌ Manager account not found!");
      return;
    }

    console.log("✅ Manager account found:");
    console.log("👤 Name:", manager.firstName, manager.lastName);
    console.log("📧 Email:", manager.email);
    console.log("🎯 Role:", manager.role);
    console.log("✅ Active:", manager.isActive);
    console.log("✅ Approved:", manager.isApproved);
    console.log("🔒 Password Hash:", manager.password ? "Present" : "Missing");
    console.log("🔒 Password Length:", manager.password ? manager.password.length : 0);

    // Test password comparison
    console.log("\n🔍 Testing password comparison...");
    const isPasswordValid = await manager.comparePassword("dhp@973");
    console.log("🔒 Password 'dhp@973' is valid:", isPasswordValid);

    // Also test with wrong password
    const isWrongPasswordValid = await manager.comparePassword("wrongpassword");
    console.log("🔒 Wrong password is valid:", isWrongPasswordValid);

  } catch (error) {
    console.error("❌ Error verifying manager:", error.message);
  } finally {
    await mongoose.disconnect();
    console.log("\n📦 Disconnected from MongoDB");
    process.exit(0);
  }
}

// Run the script
verifyManager();
