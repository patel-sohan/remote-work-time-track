const mongoose = require("mongoose");
const User = require("../models/User");
require("dotenv").config();

async function createManager() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("📦 Connected to MongoDB");

    // Check if user with this email already exists
    const existingUser = await User.findOne({
      email: "dhchaudhary973@gmail.com",
    });
    if (existingUser) {
      console.log(
        "👤 Found existing user:",
        existingUser.firstName,
        existingUser.lastName
      );
      console.log("📧 Email:", existingUser.email);
      console.log("🎯 Current Role:", existingUser.role);

      // Update existing user to be manager with new details
      console.log("\n🔄 Updating user to manager with new details...");

      existingUser.firstName = "Dhruvil";
      existingUser.lastName = "Patel";
      // Set password directly - it will be hashed by the pre-save middleware
      existingUser.password = "dhp@973";
      existingUser.role = "manager";
      existingUser.isActive = true;
      existingUser.isApproved = true;

      await existingUser.save();

      console.log("\n🎉 User updated to manager successfully!");
      console.log("👤 Name:", existingUser.firstName, existingUser.lastName);
      console.log("📧 Email:", existingUser.email);
      console.log("🎯 Role:", existingUser.role);
      console.log("🆔 ID:", existingUser._id);
    } else {
      // Check if any other manager exists and remove them
      const existingManager = await User.findOne({ role: "manager" });
      if (existingManager) {
        console.log(
          "⚠️  Removing existing manager:",
          existingManager.firstName,
          existingManager.lastName
        );
        await User.findByIdAndDelete(existingManager._id);
        console.log("✅ Existing manager removed");
      }

      // Create new manager
      const managerData = {
        firstName: "Dhruvil",
        lastName: "Patel",
        email: "dhchaudhary973@gmail.com",
        password: "dhp@973",
        role: "manager",
        isActive: true,
        isApproved: true,
      };

      const manager = new User(managerData);
      await manager.save();

      console.log("\n🎉 Manager created successfully!");
      console.log("👤 Name:", manager.firstName, manager.lastName);
      console.log("📧 Email:", manager.email);
      console.log("🎯 Role:", manager.role);
      console.log("🆔 ID:", manager._id);
    }

    console.log("\n✅ You can now sign in with:");
    console.log("📧 Email: dhchaudhary973@gmail.com");
    console.log("🔒 Password: dhp@973");
    console.log("🎯 Role: Manager");
  } catch (error) {
    console.error("❌ Error creating manager:", error.message);
  } finally {
    await mongoose.disconnect();
    console.log("\n📦 Disconnected from MongoDB");
    process.exit(0);
  }
}

// Run the script
createManager();
