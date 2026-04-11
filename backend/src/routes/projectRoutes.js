import express from 'express'
import { createProject, showProjects, getProject, updateProject, deleteProject, inviteMember, acceptInvite, removeMember } from '../controllers/projects.controller.js';
import { isAuthenticated } from '../middlewares/isAuthenticated.js';

const router = express.Router();

// managing projects
router.post("/create", isAuthenticated, createProject);
router.get("/my-projects", isAuthenticated, showProjects);
router.get("/:id", isAuthenticated, getProject);
router.put("/:id", isAuthenticated, updateProject);
router.delete("/:id", isAuthenticated, deleteProject);

// inviting members
router.post("/:id/invite", isAuthenticated, inviteMember);
router.post("/:id/accept-invite", isAuthenticated, acceptInvite);
router.post("/:id/remove-member/:memberId", isAuthenticated, removeMember);

export default router;