const express = require('express');
const router = express.Router();
const { authMiddleware, adminOnlyMiddleware } = require('../middleware/authMiddleware');
const teamController = require('../controllers/teamController');
const { createTeamValidation, addMemberValidation, joinTeamValidation } = require('../validators/teamValidator');

/**
 * @swagger
 * /team/create:
 *   post:
 *     summary: Create a new team/project
 *     tags: [Team]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Team created successfully
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
 *       500:
 *         description: Server error.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/internalServerErrorResponse'
router.post('/create', createTeamValidation, authMiddleware, teamController.createTeam);

/**
 * @swagger
 * /team/{teamId}/addMember:
 *   post:
 *     summary: Add a member to a team
 *     tags: [Team]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: teamId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 description: Encrypted user ID to add
 *     responses:
 *       200:
 *         description: Member added successfully
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
 *       500:
 *         description: Server error.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/internalServerErrorResponse'
 */
router.post('/:teamId/addMember', addMemberValidation, authMiddleware, teamController.addMember);

/**
 * @swagger
 * /team/{teamId}/join:
 *   post:
 *     summary: Current user joins a team
 *     tags: [Team]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: teamId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Joined team successfully
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
 *       500:
 *         description: Server error.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/internalServerErrorResponse'
 */
router.post('/:teamId/join', joinTeamValidation, authMiddleware, teamController.joinTeam);

/**
 * @swagger
 * /team/list:
 *   get:
 *     summary: List all teams
 *     tags: [Team]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Teams retrieved successfully
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
 *       500:
 *         description: Server error.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/internalServerErrorResponse'
 */
router.get('/list', authMiddleware, teamController.listTeams);

module.exports = router;