const express = require('express');
const router = express.Router();
const {authMiddleware,adminOnlyMiddleware} = require("../middleware/authMiddleware");
const taskController = require("../controllers/taskController")
const {createTaskValidation, assignTaskValidation}= require("../validators/taskValidator")




router.post("/createTask",createTaskValidation,authMiddleware,adminOnlyMiddleware, taskController.createTask)

router.get("/listAllTask",authMiddleware,adminOnlyMiddleware, taskController.listAllTask)

router.post("/assign/:taskId",assignTaskValidation, authMiddleware,adminOnlyMiddleware, taskController.assignTask)

router.get("/listAssignedTask",authMiddleware, taskController.getMyAssignedTasks)

router.patch("/complete/:taskId",authMiddleware,taskController.markTaskCompleted);

router.get("/taskStatus", authMiddleware, taskController.getTaskStatus);

router.get("/search", authMiddleware, taskController.searchTasks);

module.exports= router
