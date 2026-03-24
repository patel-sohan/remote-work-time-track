/**
 * Database Initialization Script for Team Tracker
 * Run this after MongoDB installation to set up initial data
 */

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Import models
const User = require('../models/User');
const Task = require('../models/Task');

const initializeDatabase = async () => {
  try {
    console.log('🚀 Initializing Team Tracker Database...');
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data (optional - remove in production)
    console.log('🧹 Clearing existing data...');
    await User.deleteMany({});
    await Task.deleteMany({});

    // Create default manager
    console.log('👤 Creating default manager...');
    const hashedPassword = await bcrypt.hash('dhp@973', 12);
    
    const manager = new User({
      firstName: 'Dharmendra',
      lastName: 'Chaudhary',
      email: 'dhchaudhary973@gmail.com',
      password: hashedPassword,
      role: 'manager',
      isApproved: true,
      profilePicture: null,
      department: 'Management',
      jobTitle: 'Project Manager'
    });

    await manager.save();
    console.log('✅ Default manager created');

    // Create sample team member
    console.log('👥 Creating sample team member...');
    const memberPassword = await bcrypt.hash('password123', 12);
    
    const teamMember = new User({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      password: memberPassword,
      role: 'team_member',
      isApproved: true,
      profilePicture: null,
      department: 'Development',
      jobTitle: 'Software Developer'
    });

    await teamMember.save();
    console.log('✅ Sample team member created');

    // Create sample tasks
    console.log('📋 Creating sample tasks...');
    const sampleTasks = [
      {
        title: 'Setup Development Environment',
        description: 'Install and configure all necessary development tools',
        assignee: teamMember._id,
        creator: manager._id,
        status: 'done',
        priority: 'high',
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        estimatedHours: 4,
        actualHours: 3.5,
        completedDate: new Date()
      },
      {
        title: 'Design Database Schema',
        description: 'Create comprehensive database schema for the application',
        assignee: teamMember._id,
        creator: manager._id,
        status: 'in_progress',
        priority: 'high',
        dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
        estimatedHours: 8,
        actualHours: 4,
        startDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
      },
      {
        title: 'Implement User Authentication',
        description: 'Build secure user authentication system with JWT',
        assignee: teamMember._id,
        creator: manager._id,
        status: 'todo',
        priority: 'medium',
        dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
        estimatedHours: 12
      },
      {
        title: 'Create Landing Page',
        description: 'Design and implement attractive landing page',
        assignee: teamMember._id,
        creator: manager._id,
        status: 'done',
        priority: 'medium',
        dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        estimatedHours: 6,
        actualHours: 5.5,
        completedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
      }
    ];

    for (const taskData of sampleTasks) {
      const task = new Task(taskData);
      await task.save();
    }

    console.log('✅ Sample tasks created');

    console.log('\n🎉 Database initialization complete!');
    console.log('\n📋 Login Credentials:');
    console.log('Manager:');
    console.log('  Email: dhchaudhary973@gmail.com');
    console.log('  Password: dhp@973');
    console.log('\nTeam Member:');
    console.log('  Email: john.doe@example.com');
    console.log('  Password: password123');

    console.log('\n🔗 MongoDB Compass Connection:');
    console.log('  mongodb://127.0.0.1:27017/productivity_tracker');

  } catch (error) {
    console.error('❌ Database initialization failed:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
    process.exit(0);
  }
};

// Run initialization
initializeDatabase();
