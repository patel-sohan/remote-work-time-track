const express = require('express');
const router = express.Router();
const TimeEntry = require('../models/TimeEntry');
const Task = require('../models/Task');
const { authenticate, requireTeamMember } = require('../middleware/auth');
const { body, validationResult } = require('express-validator');

// Apply authentication to all routes
router.use(authenticate);
router.use(requireTeamMember);

/**
 * @route   GET /api/time-entries
 * @desc    Get time entries for the authenticated user
 * @access  Private
 */
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 20, startDate, endDate, taskId } = req.query;
    
    // Build query
    let query = { user: req.user._id };
    
    // Date range filter
    if (startDate || endDate) {
      query.startTime = {};
      if (startDate) query.startTime.$gte = new Date(startDate);
      if (endDate) query.startTime.$lte = new Date(endDate);
    }
    
    // Task filter
    if (taskId) {
      query.task = taskId;
    }
    
    const timeEntries = await TimeEntry.find(query)
      .populate('task', 'title status')
      .sort({ startTime: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await TimeEntry.countDocuments(query);
    
    res.json({
      success: true,
      data: {
        timeEntries,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Error fetching time entries:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch time entries'
    });
  }
});

/**
 * @route   POST /api/time-entries/start
 * @desc    Start a new time entry
 * @access  Private
 */
router.post('/start', [
  body('taskId').optional().isMongoId().withMessage('Invalid task ID'),
  body('description').optional().isLength({ max: 500 }).withMessage('Description too long'),
  body('type').isIn(['manual', 'pomodoro', 'automatic']).withMessage('Invalid type')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { taskId, description, type = 'manual' } = req.body;
    
    // Check if user has an active time entry
    const activeEntry = await TimeEntry.findOne({
      user: req.user._id,
      isActive: true
    });
    
    if (activeEntry) {
      return res.status(400).json({
        success: false,
        message: 'You already have an active time entry. Please stop it first.'
      });
    }
    
    // Verify task exists if provided
    if (taskId) {
      const task = await Task.findById(taskId);
      if (!task) {
        return res.status(404).json({
          success: false,
          message: 'Task not found'
        });
      }
    }
    
    const timeEntry = new TimeEntry({
      user: req.user._id,
      task: taskId,
      description,
      type,
      startTime: new Date(),
      isActive: true
    });
    
    await timeEntry.save();
    await timeEntry.populate('task', 'title status');
    
    res.status(201).json({
      success: true,
      data: { timeEntry },
      message: 'Time tracking started successfully'
    });
  } catch (error) {
    console.error('Error starting time entry:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to start time tracking'
    });
  }
});

/**
 * @route   PUT /api/time-entries/:id/stop
 * @desc    Stop a time entry
 * @access  Private
 */
router.put('/:id/stop', async (req, res) => {
  try {
    const timeEntry = await TimeEntry.findOne({
      _id: req.params.id,
      user: req.user._id,
      isActive: true
    });
    
    if (!timeEntry) {
      return res.status(404).json({
        success: false,
        message: 'Active time entry not found'
      });
    }
    
    timeEntry.stop();
    await timeEntry.save();
    await timeEntry.populate('task', 'title status');
    
    res.json({
      success: true,
      data: { timeEntry },
      message: 'Time tracking stopped successfully'
    });
  } catch (error) {
    console.error('Error stopping time entry:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to stop time tracking'
    });
  }
});

/**
 * @route   PUT /api/time-entries/:id/pause
 * @desc    Pause a time entry
 * @access  Private
 */
router.put('/:id/pause', async (req, res) => {
  try {
    const timeEntry = await TimeEntry.findOne({
      _id: req.params.id,
      user: req.user._id,
      isActive: true
    });
    
    if (!timeEntry) {
      return res.status(404).json({
        success: false,
        message: 'Active time entry not found'
      });
    }
    
    timeEntry.pause();
    await timeEntry.save();
    
    res.json({
      success: true,
      data: { timeEntry },
      message: 'Time tracking paused'
    });
  } catch (error) {
    console.error('Error pausing time entry:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to pause time tracking'
    });
  }
});

/**
 * @route   PUT /api/time-entries/:id/resume
 * @desc    Resume a paused time entry
 * @access  Private
 */
router.put('/:id/resume', async (req, res) => {
  try {
    const timeEntry = await TimeEntry.findOne({
      _id: req.params.id,
      user: req.user._id,
      isActive: true,
      isPaused: true
    });
    
    if (!timeEntry) {
      return res.status(404).json({
        success: false,
        message: 'Paused time entry not found'
      });
    }
    
    timeEntry.resume();
    await timeEntry.save();
    
    res.json({
      success: true,
      data: { timeEntry },
      message: 'Time tracking resumed'
    });
  } catch (error) {
    console.error('Error resuming time entry:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to resume time tracking'
    });
  }
});

/**
 * @route   GET /api/time-entries/active
 * @desc    Get current active time entry
 * @access  Private
 */
router.get('/active', async (req, res) => {
  try {
    const activeEntry = await TimeEntry.findOne({
      user: req.user._id,
      isActive: true
    }).populate('task', 'title status');
    
    res.json({
      success: true,
      data: { timeEntry: activeEntry }
    });
  } catch (error) {
    console.error('Error fetching active time entry:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch active time entry'
    });
  }
});

/**
 * @route   GET /api/time-entries/summary
 * @desc    Get time tracking summary for date range
 * @access  Private
 */
router.get('/summary', async (req, res) => {
  try {
    const { startDate, endDate, groupBy = 'day' } = req.query;
    
    const start = startDate ? new Date(startDate) : new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const end = endDate ? new Date(endDate) : new Date();
    
    const summary = await TimeEntry.aggregate([
      {
        $match: {
          user: req.user._id,
          startTime: { $gte: start, $lte: end },
          endTime: { $exists: true }
        }
      },
      {
        $group: {
          _id: null,
          totalEntries: { $sum: 1 },
          totalDuration: { $sum: '$duration' },
          avgDuration: { $avg: '$duration' },
          totalFocusTime: { $sum: '$productivity.focusTime' },
          avgProductivityScore: { $avg: '$productivity.score' }
        }
      }
    ]);
    
    res.json({
      success: true,
      data: {
        summary: summary[0] || {
          totalEntries: 0,
          totalDuration: 0,
          avgDuration: 0,
          totalFocusTime: 0,
          avgProductivityScore: 0
        },
        period: { startDate: start, endDate: end }
      }
    });
  } catch (error) {
    console.error('Error fetching time summary:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch time summary'
    });
  }
});

module.exports = router;
