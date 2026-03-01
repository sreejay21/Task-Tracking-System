const taskRepository = require('../repositories/taskRepository');
const userRepository = require("../repositories/authRepsoitory")
const responseHelper = require('../responseModels/apiResponseHelper');
const constantMessage = require("../utilities/constantMessage")
const common = require("../utilities/common")
const mongoose = require('mongoose');

const createTask = async (req, res) => {
    try {
        const { title, description, dueDate, teamId } = req.body;

        const taskData = {
            title,
            description,
            dueDate,
            createdBy: req.user.id
        };

        if (teamId) {
            // decrypt and attach team
            taskData.team = common.decrypt(teamId);
        }

        const newTask = await taskRepository.createTask(taskData);

        return responseHelper.Ok(
            {
                message: constantMessage?.responseMessages?.taskCreated,
                task: {
                    id: common.encrypt(newTask._id),
                    title: newTask.title,
                    description: newTask.description,
                    dueDate: newTask.dueDate
                }
            },
            res
        );

    } catch (error) {
        return responseHelper.internalServerError(res, error.message);
    }
};

const listAllTask = async (req, res) => {
    try {
        const task = await taskRepository.getAllTask();
        const responseData = task.map(task => ({
            taskId: common.encrypt(task?._id),
            title: task?.title,
            description: task?.description,
            dueDate: task?.dueDate,
            status: task?.status,
            createdBy: task?.createdBy
                ? `${task.createdBy.firstName} ${task.createdBy.lastName}`
                : null,
        }));

        responseHelper.Ok({ task: responseData }, res);

    } catch (error) {
        responseHelper.internalServerError(res, error.message);
    }
}


const assignTask = async (req, res) => {
    try {
        const { taskId } = req.params;
        const { assignedTo } = req.body;

        const decryptedTaskId = common.decrypt(taskId);
        const decryptedAssignUserId = assignedTo.map(id => common.decrypt(id));

        const task = await taskRepository.findTaskById(decryptedTaskId);

        if (!task) {
            return responseHelper.notFound(res);
        }

        // if task is tied to a team, verify that all assignees belong to that team
        if (task.team) {
            const team = await require('../repositories/teamRepository').findTeamById(task.team);
            const notMembers = decryptedAssignUserId.filter(u =>
                !team.members.some(m => m._id.toString() === u)
            );
            if (notMembers.length > 0) {
                return responseHelper.getErrorResult(
                    'One or more users are not members of the team associated with this task',
                    res
                );
            }
        }

        const userExists = await userRepository.findUserById(decryptedAssignUserId);
        if (!userExists) {
            return responseHelper.getErrorResult(constantMessage?.errorMessage?.UserNotFound, res);
        }

        const updatedTask = await taskRepository.assignTask(
            decryptedTaskId,
            decryptedAssignUserId
        );

        if (!updatedTask) {
            return responseHelper.getErrorResult(
                constantMessage?.errorMessage?.closedTask,
                res
            );
        }

        const responseData = {
            taskId: common.encrypt(updatedTask._id),
            title: updatedTask.title,
            status: updatedTask.status,
            createdBy: `${updatedTask.createdBy.firstName} ${updatedTask.createdBy.lastName}`,
            assignedTo: updatedTask.assignedTo.map(user => `${user.firstName} ${user.lastName}`)
        };

        return responseHelper.Ok(
            { message: constantMessage?.responseMessages?.taskAssigned, task: responseData },
            res
        );

    } catch (error) {
        return responseHelper.internalServerError(res, error.message);
    }
};


const getMyAssignedTasks = async (req, res) => {
    try {
        const userId = req.user.id

        const tasks = await taskRepository.getTasksAssignedToUser(userId);
        const today = new Date()
        today.setHours(0, 0, 0, 0)

        const response = tasks.map(task => {
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const due = new Date(task.dueDate);
            due.setHours(0, 0, 0, 0);

            const diffTime = due - today;
            const remainingDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            return {
                taskId: common.encrypt(task._id),
                title: task.title,
                description: task.description,
                status: task.status,
                dueDate: task.dueDate,
                remainingDays: remainingDays
            };
        });

        return responseHelper.Ok({ tasks: response }, res);

    } catch (error) {
        return responseHelper.internalServerError(res, error.message);
    }
};

const markTaskCompleted = async (req, res) => {
    try {
        const { taskId } = req.params;
        const decryptedTaskId = common.decrypt(taskId);
        const userid = req.user.id
        const task = await taskRepository.findTaskById(decryptedTaskId);

        if (!task) {
            return responseHelper.notFound(res);
        }

        const isAssigned = task.assignedTo.some(
            id => id.toString() === userid
        );

        if (!isAssigned) {
            return responseHelper.getErrorResult(
                constantMessage?.errorMessage?.notAssignedToTask,
                res
            );
        }

        const alreadyCompleted = task.completedBy.some(
            id => id.toString() === userid
        );

        if (alreadyCompleted) {
            return responseHelper.getErrorResult(
                constantMessage?.errorMessage?.taskAlreadyCompleted,
                res
            );
        }

        const closeTheTask =
            task.assignedTo.length === task.completedBy.length + 1;

        const updatedTask = await taskRepository.markTaskCompleted(
            decryptedTaskId,
            userid,
            closeTheTask
        );

        return responseHelper.Ok(
            { message: constantMessage?.responseMessages?.taskAssigned },
            res
        );

    } catch (error) {
        return responseHelper.internalServerError(res, error.message);
    }
};


const getTaskStatus = async (req, res) => {
    try {
        const userid = req.user.id;
        const { status } = req.query;
        const filter = {
            assignedTo: userid
        };

        if (status) {
            filter.status = status;
        }

        const tasks = await taskRepository.getTasksByFilter(filter);

        const response = tasks.map(task => ({
            taskId: common.encrypt(task._id),
            title: task.title,
            description: task.description,
            status: task.status,
            dueDate: task.dueDate,
            completedUsers: task.completedBy?.map(user => ({
                username: `${user.firstName} ${user.lastName}`
            }))
        }));

        return responseHelper.Ok({ tasks: response }, res);

    } catch (error) {
        return responseHelper.internalServerError(res, error.message);
    }
};

const addComment = async (req, res) => {
    try {
        const { taskId } = req.params;
        const { text } = req.body;
        const decryptedTaskId = common.decrypt(taskId);
        const task = await taskRepository.findTaskById(decryptedTaskId);
        if (!task) {
            return responseHelper.notFound(res);
        }
        // only participants can comment (creator, assigned users or team members)
        const isParticipant =
            task.createdBy.toString() === req.user.id ||
            task.assignedTo.some(u => u.toString() === req.user.id) ||
            (task.team && (await require('../repositories/teamRepository').findTeamById(task.team))?.members.some(m => m._id.toString() === req.user.id));
        if (!isParticipant && req.user.role !== constantMessage.constantValue.admin) {
            return responseHelper.forbidden(res);
        }
        const commentObj = {
            text,
            commentedBy: req.user.id
        };
        const updated = await taskRepository.addComment(decryptedTaskId, commentObj);
        return responseHelper.Ok({ message: constantMessage.responseMessages.commentAdded, task: updated }, res);
    } catch (error) {
        return responseHelper.internalServerError(res, error.message);
    }
};

const addAttachment = async (req, res) => {
    try {
        const { taskId } = req.params;
        const { filename, url } = req.body;
        const decryptedTaskId = common.decrypt(taskId);
        const task = await taskRepository.findTaskById(decryptedTaskId);
        if (!task) {
            return responseHelper.notFound(res);
        }
        // similar participant check
        const isParticipant =
            task.createdBy.toString() === req.user.id ||
            task.assignedTo.some(u => u.toString() === req.user.id) ||
            (task.team && (await require('../repositories/teamRepository').findTeamById(task.team))?.members.some(m => m._id.toString() === req.user.id));
        if (!isParticipant && req.user.role !== constantMessage.constantValue.admin) {
            return responseHelper.forbidden(res);
        }
        const attachmentObj = {
            filename,
            url,
            uploadedBy: req.user.id
        };
        const updated = await taskRepository.addAttachment(decryptedTaskId, attachmentObj);
        return responseHelper.Ok({ message: constantMessage.responseMessages.attachmentAdded, task: updated }, res);
    } catch (error) {
        return responseHelper.internalServerError(res, error.message);
    }
};

const getTasksByTeam = async (req, res) => {
    try {
        const { teamId } = req.params;
        const decryptedTeamId = common.decrypt(teamId);
        // ensure user belongs to team or is admin
        const team = await require('../repositories/teamRepository').findTeamById(decryptedTeamId);
        if (!team) {
            return responseHelper.notFound(res);
        }
        if (
            req.user.role !== constantMessage.constantValue.admin &&
            !team.members.some(m => m._id.toString() === req.user.id)
        ) {
            return responseHelper.forbidden(res);
        }
        const tasks = await taskRepository.getTasksByTeam(decryptedTeamId);
        const response = tasks.map(task => ({
            taskId: common.encrypt(task._id),
            title: task.title,
            description: task.description,
            status: task.status,
            dueDate: task.dueDate,
            assignedTo: task.assignedTo?.map(u => `${u.firstName} ${u.lastName}`)
        }));
        return responseHelper.Ok({ tasks: response }, res);
    } catch (error) {
        return responseHelper.internalServerError(res, error.message);
    }
};

const searchTasks = async (req, res) => {
    try {
        const { query } = req.query;  
        let userId = req.user.id; 
        userId = new mongoose.Types.ObjectId(userId)   
        const tasks = await taskRepository.searchTasks({
            userId,
            query
        });

        const response = tasks.map(task => ({
            taskId: common.encrypt(task._id),
            title: task.title,
            description: task.description,
            status: task.status,
            dueDate: task.dueDate,
            createdBy: task.createdBy
                ? `${task.createdBy.firstName} ${task.createdBy.lastName}`
                : null,
            assignedTo: task.assignedTo?.map(u => `${u.firstName} ${u.lastName}`)
        }));

        return responseHelper.Ok({ tasks: response }, res);

    } catch (error) {
        return responseHelper.internalServerError(res, error.message);
    }
};

// optional AI-powered description generator (stub)
const generateDescription = async (req, res) => {
    try {
        const { text } = req.body;
        // placeholder logic - in real system call external AI model
        const generated = `Auto-generated description based on input: ${text}`;
        return responseHelper.Ok({ description: generated }, res);
    } catch (error) {
        return responseHelper.internalServerError(res, error.message);
    }
};
module.exports = {
    createTask,
    listAllTask,
    assignTask,
    getMyAssignedTasks,
    markTaskCompleted,
    getTaskStatus,
    getTasksByTeam,
    searchTasks,
    addComment,
    addAttachment,
    generateDescription
};

