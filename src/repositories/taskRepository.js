const Task = require('../models/Task');
const User = require('../models/User');

const taskRepository = {

    async findTaskById(id) {
        try {
            return await Task.findById(id);
        }
        catch (error) {
            throw error;
        }
    },

    async createTask(payload) {
        try {
            return await Task.create(payload);
        } catch (error) {
            throw error;
        }
    },
    async getAllTask() {
        try {
            return await Task.find({})
                .populate('createdBy', 'firstName lastName')
        } catch (error) {
            throw error
        }
    },
    async assignTask(taskId, assignedUsers) {
        try {
            return await Task.findOneAndUpdate(
                {
                    _id: taskId,
                    status: "open"
                },
                { assignedTo: assignedUsers },
                { new: true }
            )
                .populate('createdBy', 'firstName lastName')
                .populate('assignedTo', 'firstName lastName');

        } catch (error) {
            throw error;
        }
    },
    async getTasksAssignedToUser(userId) {
        try {
            return await Task.find({
                assignedTo: userId
            })
                .sort({ createdAt: -1 });
        }
        catch (error) {
            throw error
        }
    },
    async markTaskCompleted(taskId, userId, isFullyCompleted) {
        try {
            const updateData = {
                $addToSet: { completedBy: userId }
            };

            if (isFullyCompleted) {
                updateData.$set = { status: "completed" };
            }

            return await Task.findByIdAndUpdate(
                taskId,
                updateData,
                { new: true }
            );
        } catch (error) {
            throw error
        }
    },
    async getTasksByFilter(filter) {
        try {
            return await Task.find(filter)
                .populate("completedBy",
                    "firstName lastName"
                )
                .sort({ createdAt: -1 });
        }
        catch (error) {
            throw error
        }

    },

    async searchTasks({userId, query}) {
        try {
            const regex = new RegExp(query, "i");

            const tasks = await Task.find({
                assignedTo: userId,
                $or: [
                    { title: regex },
                    { description: regex }
                ]
            })
                .populate("createdBy", "firstName lastName")
                .populate("assignedTo", "firstName lastName")
                .exec();

            return tasks;
        } catch (error) {
            throw error
        }
    }
}



module.exports = taskRepository;