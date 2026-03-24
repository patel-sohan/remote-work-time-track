const mongoose = require("mongoose");
const User = require("../models/User");
require("dotenv").config();

async function fixManager() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("📦 Connected to MongoDB");

    // Find and update the manager account
    const manager = await User.findOne({ email: "dhchaudhary973@gmail.com" });
    
    if (!manager) {
      console.log("❌ Manager account not found!");
      return;
    }

    console.log("🔧 Fixing manager account...");
    
    // Update the manager with all required fields
    manager.isApproved = true;
    manager.isActive = true;
    manager.role = "manager";
    
    await manager.save();
    
    console.log("✅ Manager account fixed!");
    console.log("👤 Name:", manager.firstName, manager.lastName);
    console.log("📧 Email:", manager.email);
    console.log("🎯 Role:", manager.role);
    console.log("✅ Active:", manager.isActive);
    console.log("✅ Approved:", manager.isApproved);

  } catch (error) {
    console.error("❌ Error fixing manager:", error.message);
  } finally {
    await mongoose.disconnect();
    console.log("\n📦 Disconnected from MongoDB");
    process.exit(0);
  }
}

// Run the script
fixManager();
