const express = require('express');
const router = express.Router();
const {authMiddleware,adminOnlyMiddleware} = require("../middleware/authMiddleware");
const taskController = require("../controllers/taskController")
const {createTaskValidation, assignTaskValidation}= require("../validators/taskValidator")
const { commentValidation, attachmentValidation } = require('../validators/commentValidator');
const { createTeamValidation, addMemberValidation, joinTeamValidation } = require('../validators/teamValidator');
const { aiValidation } = require('../validators/commentValidator');




/**
 * @swagger
 * /task/createTask:
 *   post:
 *     summary: Create a new task
 *     tags: [Task]
 *     description: Only admins can create tasks. Requires JWT in Authorization header.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               dueDate:
 *                 type: string
 *                 format: date-time
 *               teamId:
 *                 type: string
 *                 description: Encrypted team id (optional)
 *     responses:
 *       200:
 *         description: Task created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/createTaskResponse'
 *       400:
 *         description: Bad Request.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/badRequestResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/unauthorizedResponse'
 *       403:
 *         description: Forbidden – only admins can create tasks
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/forbiddenResponse'
 *       500:
 *         description: Server error.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/internalServerErrorResponse'
 */
// allow any authenticated user to create tasks; admins still required to assign
router.post("/createTask",createTaskValidation,authMiddleware, taskController.createTask)

/**
 * @swagger
 * /task/listAllTask:
 *   get:
 *     summary: Get all tasks
 *     tags: [Task]
 *     description: Retrieve a list of all tasks. Admin only.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of tasks retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/listTasksResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/unauthorizedResponse'
 *       403:
 *         description: Forbidden – only admins can view all tasks
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/forbiddenResponse'
 *       500:
 *         description: Server error.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/internalServerErrorResponse'
 */
router.get("/listAllTask",authMiddleware,adminOnlyMiddleware, taskController.listAllTask)

/**
 * @swagger
 * /task/assign/{taskId}:
 *   post:
 *     summary: Assign a task to one or more users
 *     tags: [Task]
 *     description: Admins assign tasks by providing an array of encrypted user IDs.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *         description: Encrypted ID of the task to assign
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               assignedTo:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Task assigned successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/assignTaskResponse'
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/badRequestResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/unauthorizedResponse'
 *       403:
 *         description: Forbidden – only admins can assign tasks
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/forbiddenResponse'
 *       404:
 *         description: Task or user not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/notFoundResponse'
 *       500:
 *         description: Server error.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/internalServerErrorResponse'
 */
router.post("/assign/:taskId",assignTaskValidation, authMiddleware,adminOnlyMiddleware, taskController.assignTask)

/**
 * @swagger
 * /task/listAssignedTask:
 *   get:
 *     summary: Get tasks assigned to the logged-in user
 *     tags: [Task]
 *     description: Returns tasks for the current user along with remaining days.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Assigned tasks retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/listTasksResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/unauthorizedResponse'
 *       500:
 *         description: Server error.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/internalServerErrorResponse'
 */
router.get("/listAssignedTask",authMiddleware, taskController.getMyAssignedTasks)

/**
 * @swagger
 * /task/complete/{taskId}:
 *   patch:
 *     summary: Mark a task as completed
 *     tags: [Task]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *         description: Encrypted ID of the task to complete
 *     responses:
 *       200:
 *         description: Task marked completed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/basicMessageResponse'
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/badRequestResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/unauthorizedResponse'
 *       404:
 *         description: Task not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/notFoundResponse'
 *       500:
 *         description: Server error.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/internalServerErrorResponse'
 */
router.patch("/complete/:taskId",authMiddleware,taskController.markTaskCompleted);

/**
 * @swagger
 * /task/taskStatus:
 *   get:
 *     summary: Get status of tasks for current user
 *     tags: [Task]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         description: Optional status filter (open/completed)
 *     responses:
 *       200:
 *         description: Task status list
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/listTasksResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/unauthorizedResponse'
 *       500:
 *         description: Server error.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/internalServerErrorResponse'
 */
router.get("/taskStatus", authMiddleware, taskController.getTaskStatus);

/**
 * @swagger
 * /task/search:
 *   get:
 *     summary: Search tasks by text
 *     tags: [Task]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: query
 *         required: true
 *         schema:
 *           type: string
 *         description: Search term to look for in title/description
 *     responses:
 *       200:
 *         description: Search results
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/listTasksResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/unauthorizedResponse'
 *       500:
 *         description: Server error.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/internalServerErrorResponse'
 */

// comments & attachments
/**
 * @swagger
 * /task/{taskId}/comment:
 *   post:
 *     summary: Add a comment to a task
 *     tags: [Task]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *         description: Encrypted task id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               text:
 *                 type: string
 *     responses:
 *       200:
 *         description: Comment added successfully
 *       400:
 *         $ref: '#/components/schemas/badRequestResponse'
 *       401:
 *         $ref: '#/components/schemas/unauthorizedResponse'
 *       404:
 *         $ref: '#/components/schemas/notFoundResponse'
 *       500:
 *         $ref: '#/components/schemas/internalServerErrorResponse'
 */
router.post('/:taskId/comment', commentValidation, authMiddleware, taskController.addComment);

/**
 * @swagger
 * /task/{taskId}/attachment:
 *   post:
 *     summary: Add an attachment to a task
 *     tags: [Task]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *         description: Encrypted task id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               filename:
 *                 type: string
 *               url:
 *                 type: string
 *     responses:
 *       200:
 *         description: Attachment added successfully
 *       400:
 *         $ref: '#/components/schemas/badRequestResponse'
 *       401:
 *         $ref: '#/components/schemas/unauthorizedResponse'
 *       404:
 *         $ref: '#/components/schemas/notFoundResponse'
 *       500:
 *         $ref: '#/components/schemas/internalServerErrorResponse'
 */
router.post('/:taskId/attachment', attachmentValidation, authMiddleware, taskController.addAttachment);

/**
 * @swagger
 * /task/generate-description:
 *   post:
 *     summary: Generate a task description using AI (stub)
 *     tags: [Task]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               text:
 *                 type: string
 *     responses:
 *       200:
 *         description: Generated description
 */
router.post('/generate-description', aiValidation, authMiddleware, taskController.generateDescription);

/**
 * @swagger
 * /task/team/{teamId}:
 *   get:
 *     summary: Get all tasks associated with a team
 *     tags: [Task]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: teamId
 *         required: true
 *         schema:
 *           type: string
 *         description: Encrypted team id
 *     responses:
 *       200:
 *         description: List of tasks for the team
 *       401:
 *         $ref: '#/components/schemas/unauthorizedResponse'
 *       500:
 *         $ref: '#/components/schemas/internalServerErrorResponse'
 */
router.get('/team/:teamId', authMiddleware, taskController.getTasksByTeam);

module.exports= router
