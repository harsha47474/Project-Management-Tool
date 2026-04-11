import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/error.handler.js";
import Project from "../models/projects.model.js";
import User from "../models/user.model.js";
import Member from "../models/member.model.js";
import { generateInviteToken, verifyInviteToken } from "../utils/inviteToken.js";
import { sendInviteMail } from "../utils/inviteMail.js";

// create a project
export const createProject = catchAsyncError(async (req, res, next) => {
    const { name, description, status, githubRepo } = req.body;

    if (!name) {
        return next(new ErrorHandler("Project name is required", 400));
    }

    const project = await Project.create({
        name,
        description,
        status,
        githubRepo,
        createdBy: req.user._id,
        members: [
            {
                user: req.user._id,
            },
        ],
    });

    res.status(201).json({
        success: true,
        message: "Project created successfully",
        project,
    });
});

// get all the projects of the user
export const showProjects = catchAsyncError(async (req, res, next) => {
    const projects = await Project.find({
        $or: [
            { createdBy: req.user._id },
            { "members.user": req.user._id },
        ],
    });

    res.status(200).json({
        success: true,
        message: "Projects fetched successfully",
        projects,
    });
});

// access a specific project
export const getProject = catchAsyncError(async (req, res, next) => {
    const project = await Project.findById(req.params.id);

    if (!project) {
        return next(new ErrorHandler("Project not found", 404));
    }

    const isOwner = project.createdBy.toString() === req.user._id.toString();
    const isMember = project.members.some(
        (member) => member.user.toString() === req.user._id.toString()
    );

    if (!isOwner && !isMember) {
        return next(new ErrorHandler("You are not authorized to access this project", 403));
    }

    res.status(200).json({
        success: true,
        message: "Project fetched successfully",
        project,
    });
});


// update a project
export const updateProject = catchAsyncError(async (req, res, next) => {
    const project = await Project.findById(req.params.id);

    if (!project) {
        return next(new ErrorHandler("Project not found", 404));
    }

    const isOwner = project.createdBy.toString() === req.user._id.toString();

    if (!isOwner) {
        return next(new ErrorHandler("Only project owner can update this project", 403));
    }

    const { name, description, status, githubRepo } = req.body;

    if (name !== undefined) {
        project.name = name;
    }

    if (description !== undefined) {
        project.description = description;
    }

    if (status !== undefined) {
        project.status = status;
    }

    if (githubRepo !== undefined) {
        project.githubRepo = githubRepo;
    }

    await project.save();

    res.status(200).json({
        success: true,
        message: "Project updated successfully",
        project,
    });
});


// delete a project
export const deleteProject = catchAsyncError(async (req, res, next) => {
    const project = await Project.findById(req.params.id);

    if (!project) {
        return next(new ErrorHandler("Project not found", 404));
    }

    const isOwner = project.createdBy.toString() === req.user._id.toString();

    if (!isOwner) {
        return next(new ErrorHandler("Only project owner can delete this project", 403));
    }

    await project.deleteOne();

    res.status(200).json({
        success: true,
        message: "Project deleted successfully",
    });
});

// invite a member
export const inviteMember = catchAsyncError(async (req, res, next) => {
    const { email } = req.body;
    const project = await Project.findById(req.params.id);

    if (!project) {
        return next(new ErrorHandler("Project not found", 404));
    }

    if (!email) {
        return next(new ErrorHandler("Email is required", 400));
    }

    const isOwner = project.createdBy.toString() === req.user._id.toString();

    if (!isOwner) {
        return next(new ErrorHandler("Only project owner can invite members", 403));
    }

    // owner cannot invite themselves
    if (email === req.user.email) {
        return next(new ErrorHandler("You cannot invite yourself", 400));
    }

    // check if invited user already exists
    const invitedUser = await User.findOne({ email });

    if (invitedUser) {
        const alreadyMember = project.members.some(
            (member) => member.user.toString() === invitedUser._id.toString()
        );

        if (alreadyMember) {
            return next(new ErrorHandler("User is already a member", 400));
        }
    }

    const token = generateInviteToken(email, project._id);

    const inviteLink = `${process.env.FRONTEND_URL}/accept-invite?token=${token}`;

    await sendInviteMail(email, project.name, inviteLink);

    res.status(200).json({
        success: true,
        message: "Invitation email sent successfully",
        token,
    });
});

// accept the invite from member
export const acceptInvite = catchAsyncError(async (req, res, next) => {
    const { token } = req.body;

    if (!token) {
        return next(new ErrorHandler("Invitation token is required", 400));
    }

    let decoded;

    try {
        decoded = verifyInviteToken(token);
    } catch (error) {
        return next(new ErrorHandler("Invalid or expired invitation token", 400));
    }

    const { email, projectId } = decoded;

    // logged in user must match invited email
    if (req.user.email !== email) {
        return next(
            new ErrorHandler("This invitation is not for your account", 403)
        );
    }

    const project = await Project.findById(projectId);

    if (!project) {
        return next(new ErrorHandler("Project not found", 404));
    }

    const alreadyMember = project.members.some(
        (member) => member.user.toString() === req.user._id.toString()
    );

    if (alreadyMember) {
        return res.status(200).json({
            success: true,
            message: "You are already a member of this project",
            project,
        });
    }

    project.members.push({
        user: req.user._id,
        joinedAt: new Date(),
    });

    await project.save();

    res.status(200).json({
        success: true,
        message: "Invitation accepted successfully",
        project,
    });
});

// remove the member
export const removeMember = catchAsyncError(async (req, res, next) => {
    const project = await Project.findById(req.params.id);

    if (!project) {
        return next(new ErrorHandler("Project not found", 404));
    }

    const isOwner = project.createdBy.toString() === req.user._id.toString();

    if (!isOwner) {
        return next(new ErrorHandler("Only project owner can remove members", 403));
    }

    const { memberId } = req.params;

    if (project.createdBy.toString() === memberId.toString()) {
        return next(new ErrorHandler("Project owner cannot be removed", 400));
    }

    const memberExists = project.members.some(
        (member) => member.user.toString() === memberId.toString()
    );

    if (!memberExists) {
        return next(new ErrorHandler("Member not found in this project", 404));
    }

    project.members = project.members.filter(
        (member) => member.user.toString() !== memberId.toString()
    );

    await project.save();

    res.status(200).json({
        success: true,
        message: "Member removed successfully",
        project,
    });
});