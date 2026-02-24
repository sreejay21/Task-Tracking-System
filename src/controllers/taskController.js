const taskRepository = require('../repositories/taskRepository');
const userRepository = require("../repositories/authRepsoitory")
const responseHelper = require('../responseModels/apiResponseHelper');
const constantMessage = require("../utilities/constantMessage")
const common = require("../utilities/common")
const mongoose = require('mongoose');

const createTask = async (req, res) => {
    try {
        const { title, description, dueDate } = req.body;

        const taskData = {
            title,
            description,
            dueDate,
            createdBy: req.user.id
        };

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
}


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

module.exports = {
    createTask,
    listAllTask,
    assignTask,
    getMyAssignedTasks,
    markTaskCompleted,
    getTaskStatus,
    searchTasks
};