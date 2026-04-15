import express from 'express'
import { isAuthenticated } from '../middlewares/isAuthenticated.js';
import { createTask, getProjectTasks, getSingleTask, updateTask, deleteTask, updateTaskStatus, assignTaskMembers, unassignTaskMember } from '../controllers/task.controller.js';

const router = express.Router();

router.post("/:projectId/tasks/create", isAuthenticated, createTask);
router.get("/:projectId/tasks", isAuthenticated, getProjectTasks);
router.get("/:projectId/tasks/:taskId", isAuthenticated, getSingleTask);
router.put("/:projectId/tasks/:taskId", isAuthenticated, updateTask);
router.delete("/:projectId/tasks/:taskId", isAuthenticated, deleteTask);
router.patch("/:projectId/tasks/:taskId/status", isAuthenticated, updateTaskStatus);
router.patch("/:projectId/tasks/:taskId/assign", isAuthenticated, assignTaskMembers);
router.patch("/:projectId/tasks/:taskId/unassign/:memberId", isAuthenticated, unassignTaskMember);

export default router;