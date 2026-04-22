import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/error.handler.js";
import Project from "../models/projects.model.js";
import Task from "../models/task.model.js";

const getProjectAndCheckMember = async (projectId, userId) => {
  const project = await Project.findById(projectId);

  if (!project) {
    throw new ErrorHandler("Project not found", 404);
  }

  const isOwner = project.createdBy.toString() === userId.toString();
  const isMember = project.members.some(
    (member) => member.user.toString() === userId.toString()
  );

  if (!isOwner && !isMember) {
    throw new ErrorHandler("You are not a member of this project", 403);
  }

  return { project, isOwner, isMember };
};

const validateAssignees = (project, assignees = []) => {
  const memberIds = project.members.map((member) => member.user.toString());
  const ownerId = project.createdBy.toString();

  return assignees.every((id) => {
    const strId = id.toString();
    return memberIds.includes(strId) || strId === ownerId;
  });
};

export const createTask = catchAsyncError(async (req, res, next) => {
  const { title, description, priority, dueDate, assignees = [] } = req.body;

  if (!title?.trim()) {
    return next(new ErrorHandler("Task title is required", 400));
  }

  const { project } = await getProjectAndCheckMember(
    req.params.projectId,
    req.user._id
  );

  if (!Array.isArray(assignees)) {
    return next(new ErrorHandler("Assignees must be an array", 400));
  }

  const uniqueAssignees = [...new Set(assignees.map((id) => id.toString()))];

  if (!validateAssignees(project, uniqueAssignees)) {
    return next(
      new ErrorHandler("All assignees must be members of this project", 400)
    );
  }

  const task = await Task.create({
    title: title.trim(),
    description: description?.trim() || "",
    priority,
    dueDate: dueDate || null,
    assignees: uniqueAssignees,
    project: project._id,
    createdBy: req.user._id,
  });

  const populatedTask = await Task.findById(task._id)
    .populate("assignees", "name email")
    .populate("createdBy", "name email");

  res.status(201).json({
    success: true,
    message: "Task created successfully",
    task: populatedTask,
  });
});

export const getProjectTasks = catchAsyncError(async (req, res, next) => {
  await getProjectAndCheckMember(req.params.projectId, req.user._id);

  const tasks = await Task.find({ project: req.params.projectId })
    .populate("assignees", "name email")
    .populate("createdBy", "name email")
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    message: "Tasks fetched successfully",
    tasks,
  });
});

export const getSingleTask = catchAsyncError(async (req, res, next) => {
  const task = await Task.findById(req.params.taskId)
    .populate("assignees", "name email")
    .populate("createdBy", "name email");

  if (!task) {
    return next(new ErrorHandler("Task not found", 404));
  }

  if (task.project.toString() !== req.params.projectId) {
    return next(new ErrorHandler("Task does not belong to this project", 400));
  }

  await getProjectAndCheckMember(task.project, req.user._id);

  res.status(200).json({
    success: true,
    message: "Task fetched successfully",
    task,
  });
});

export const updateTask = catchAsyncError(async (req, res, next) => {
  const task = await Task.findById(req.params.taskId);

  if (!task) {
    return next(new ErrorHandler("Task not found", 404));
  }

  if (task.project.toString() !== req.params.projectId) {
    return next(new ErrorHandler("Task does not belong to this project", 400));
  }

  const { project, isOwner } = await getProjectAndCheckMember(
    task.project,
    req.user._id
  );

  const isCreator = task.createdBy.toString() === req.user._id.toString();

  if (!isOwner && !isCreator) {
    return next(
      new ErrorHandler("Only the owner or task creator can update this task", 403)
    );
  }

  const { title, description, priority, dueDate, assignees } = req.body;

  if (title !== undefined) {
    if (!title.trim()) {
      return next(new ErrorHandler("Task title cannot be empty", 400));
    }
    task.title = title.trim();
  }
  if (description !== undefined) task.description = description.trim();
  if (priority !== undefined) task.priority = priority;
  if (dueDate !== undefined) task.dueDate = dueDate || null;

  if (assignees !== undefined) {
    if (!Array.isArray(assignees)) {
      return next(new ErrorHandler("Assignees must be an array", 400));
    }

    const uniqueAssignees = [...new Set(assignees.map((id) => id.toString()))];

    if (!validateAssignees(project, uniqueAssignees)) {
      return next(
        new ErrorHandler("All assignees must be members of this project", 400)
      );
    }

    task.assignees = uniqueAssignees;
  }

  await task.save();

  const updatedTask = await Task.findById(task._id)
    .populate("assignees", "name email")
    .populate("createdBy", "name email");

  res.status(200).json({
    success: true,
    message: "Task updated successfully",
    task: updatedTask,
  });
});

export const deleteTask = catchAsyncError(async (req, res, next) => {
  const task = await Task.findById(req.params.taskId);

  if (!task) {
    return next(new ErrorHandler("Task not found", 404));
  }

  if (task.project.toString() !== req.params.projectId) {
    return next(new ErrorHandler("Task does not belong to this project", 400));
  }

  const { isOwner } = await getProjectAndCheckMember(task.project, req.user._id);
  const isCreator = task.createdBy.toString() === req.user._id.toString();

  if (!isOwner && !isCreator) {
    return next(
      new ErrorHandler("Only the owner or task creator can delete this task", 403)
    );
  }

  await task.deleteOne();

  res.status(200).json({
    success: true,
    message: "Task deleted successfully",
  });
});

export const updateTaskStatus = catchAsyncError(async (req, res, next) => {
  const task = await Task.findById(req.params.taskId);

  if (!task) {
    return next(new ErrorHandler("Task not found", 404));
  }

  if (task.project.toString() !== req.params.projectId) {
    return next(new ErrorHandler("Task does not belong to this project", 400));
  }

  const { isOwner } = await getProjectAndCheckMember(task.project, req.user._id);
  const isCreator = task.createdBy.toString() === req.user._id.toString();
  const isAssignee = task.assignees.some(
    (id) => id.toString() === req.user._id.toString()
  );

  if (!isOwner && !isCreator && !isAssignee) {
    return next(
      new ErrorHandler(
        "Only the owner, task creator, or assignee can update status",
        403
      )
    );
  }

  const { status } = req.body;

  if (!status) {
    return next(new ErrorHandler("Status is required", 400));
  }

  task.status = status;
  await task.save();

  res.status(200).json({
    success: true,
    message: "Task status updated successfully",
    task,
  });
});

export const assignTaskMembers = catchAsyncError(async (req, res, next) => {
  const task = await Task.findById(req.params.taskId);

  if (!task) {
    return next(new ErrorHandler("Task not found", 404));
  }

  if (task.project.toString() !== req.params.projectId) {
    return next(new ErrorHandler("Task does not belong to this project", 400));
  }

  const { project, isOwner } = await getProjectAndCheckMember(
    task.project,
    req.user._id
  );

  const isCreator = task.createdBy.toString() === req.user._id.toString();

  if (!isOwner && !isCreator) {
    return next(
      new ErrorHandler("Only the owner or task creator can assign members", 403)
    );
  }

  const { assignees } = req.body;

  if (!Array.isArray(assignees)) {
    return next(new ErrorHandler("Assignees must be an array", 400));
  }

  const uniqueAssignees = [...new Set(assignees.map((id) => id.toString()))];

  if (!validateAssignees(project, uniqueAssignees)) {
    return next(
      new ErrorHandler("All assignees must be members of this project", 400)
    );
  }

  task.assignees = uniqueAssignees;
  await task.save();

  const updatedTask = await Task.findById(task._id)
    .populate("assignees", "name email")
    .populate("createdBy", "name email");

  res.status(200).json({
    success: true,
    message: "Task members assigned successfully",
    task: updatedTask,
  });
});

export const unassignTaskMember = catchAsyncError(async (req, res, next) => {
  const task = await Task.findById(req.params.taskId);

  if (!task) {
    return next(new ErrorHandler("Task not found", 404));
  }

  if (task.project.toString() !== req.params.projectId) {
    return next(new ErrorHandler("Task does not belong to this project", 400));
  }

  const { isOwner } = await getProjectAndCheckMember(task.project, req.user._id);
  const isCreator = task.createdBy.toString() === req.user._id.toString();

  if (!isOwner && !isCreator) {
    return next(
      new ErrorHandler("Only the owner or task creator can unassign members", 403)
    );
  }

  const { memberId } = req.params;

  task.assignees = task.assignees.filter(
    (id) => id.toString() !== memberId.toString()
  );

  await task.save();

  const updatedTask = await Task.findById(task._id)
    .populate("assignees", "name email")
    .populate("createdBy", "name email");

  res.status(200).json({
    success: true,
    message: "Task member unassigned successfully",
    task: updatedTask,
  });
});