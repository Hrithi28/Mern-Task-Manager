const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const Project = require('../models/Project');
const { protect } = require('../middleware/auth');

router.use(protect);

// GET /api/tasks?project=<id>
router.get('/', async (req, res) => {
  try {
    const { project, status, priority } = req.query;
    const filter = {};
    if (project) filter.project = project;
    if (status) filter.status = status;
    if (priority) filter.priority = priority;

    const tasks = await Task.find(filter)
      .populate('assignee', 'name email')
      .populate('createdBy', 'name email')
      .sort({ order: 1, createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/tasks
router.post('/', async (req, res) => {
  try {
    const { title, description, status, priority, label, dueDate, project, assignee, tags } = req.body;
    if (!title || !project) return res.status(400).json({ message: 'Title and project are required' });

    // get max order for the column
    const maxOrderTask = await Task.findOne({ project, status: status || 'todo' }).sort({ order: -1 });
    const order = maxOrderTask ? maxOrderTask.order + 1 : 0;

    const task = await Task.create({
      title, description, status, priority, label, dueDate, project, assignee, tags,
      createdBy: req.user._id,
      order,
    });

    const populated = await task.populate([
      { path: 'assignee', select: 'name email' },
      { path: 'createdBy', select: 'name email' },
    ]);

    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/tasks/:id
router.get('/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('assignee', 'name email')
      .populate('createdBy', 'name email')
      .populate('project', 'name color');
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/tasks/:id
router.put('/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    const updated = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true, runValidators: true,
    })
      .populate('assignee', 'name email')
      .populate('createdBy', 'name email');

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PATCH /api/tasks/:id/status  (drag-drop status change)
router.patch('/:id/status', async (req, res) => {
  try {
    const { status, order } = req.body;
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { status, order },
      { new: true }
    ).populate('assignee', 'name email');
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/tasks/:id
router.delete('/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    await task.deleteOne();
    res.json({ message: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/tasks/stats/overview  (dashboard stats)
router.get('/stats/overview', async (req, res) => {
  try {
    const userId = req.user._id;
    const projects = await Project.find({ $or: [{ owner: userId }, { members: userId }] });
    const projectIds = projects.map((p) => p._id);

    const total = await Task.countDocuments({ project: { $in: projectIds } });
    const todo = await Task.countDocuments({ project: { $in: projectIds }, status: 'todo' });
    const inprogress = await Task.countDocuments({ project: { $in: projectIds }, status: 'inprogress' });
    const done = await Task.countDocuments({ project: { $in: projectIds }, status: 'done' });
    const overdue = await Task.countDocuments({
      project: { $in: projectIds },
      dueDate: { $lt: new Date() },
      status: { $ne: 'done' },
    });

    res.json({ total, todo, inprogress, done, overdue, projectCount: projects.length });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
