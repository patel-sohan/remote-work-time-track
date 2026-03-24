const mongoose = require("mongoose");
const User = require("../models/User");
require("dotenv").config();

async function createSimpleManager() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("📦 Connected to MongoDB");

    // Delete any existing manager accounts
    console.log("🗑️ Removing existing manager accounts...");
    await User.deleteMany({ role: "manager" });
    console.log("✅ Existing managers removed");

    // Create a simple manager account
    console.log("👤 Creating simple manager account...");
    const manager = new User({
      firstName: "Admin",
      lastName: "Manager",
      email: "admin@test.com",
      password: "123456", // Simple password for testing
      role: "manager",
      isActive: true,
      isApproved: true,
      department: "Management",
      jobTitle: "System Administrator"
    });

    await manager.save();
    console.log("✅ Simple manager account created!");

    // Verify the account
    const verifyManager = await User.findOne({ email: "admin@test.com" }).select("+password");
    console.log("🔍 Verification:");
    console.log("👤 Name:", verifyManager.firstName, verifyManager.lastName);
    console.log("📧 Email:", verifyManager.email);
    console.log("🎯 Role:", verifyManager.role);
    console.log("✅ Active:", verifyManager.isActive);
    console.log("✅ Approved:", verifyManager.isApproved);
    console.log("🔒 Password Hash Length:", verifyManager.password.length);

    // Test password comparison
    console.log("\n🔍 Testing password comparison...");
    const isPasswordValid = await verifyManager.comparePassword("123456");
    console.log("🔒 Password '123456' is valid:", isPasswordValid);

    console.log("\n🎉 Simple manager account created successfully!");
    console.log("\n✅ Login Credentials:");
    console.log("📧 Email: admin@test.com");
    console.log("🔒 Password: 123456");
    console.log("🎯 Role: Manager");

  } catch (error) {
    console.error("❌ Error creating simple manager:", error.message);
    console.error("Full error:", error);
  } finally {
    await mongoose.disconnect();
    console.log("\n📦 Disconnected from MongoDB");
    process.exit(0);
  }
}

// Run the script
createSimpleManager();
