const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const {authMiddleware,adminOnlyMiddleware} = require("../middleware/authMiddleware");
const {loginValidation,registerValidation,assignRoleValidation} = require("../validators/userValidator")


// Register route
/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/registerSchema'
 *       400:
 *         description: Bad Request.
 *         content:
 *           application/json:
 *             schema:
*               $ref: '#/components/schemas/badRequestResponse'
 *       500:
 *         description: Server error.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/internalServerErrorResponse'
 */
router.post('/register',registerValidation, authController.register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/loginSchema'
 *       400:
 *         description: Bad Request.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/badRequestResponse'
 *       500:
 *         description: Server error.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/internalServerErrorResponse'
 */
router.post('/login',loginValidation, authController.login);


/**
 * @swagger
 * /auth/profile:
 *   get:
 *     summary: Get user profile
 *     description: >
 *       Retrieve the logged-in user's profile information.
 *       Pass the JWT token in the Authorization header 
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/profileSchema'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/unauthorizedResponse'
 *       404:
 *         description: Not Found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/notFoundResponse'
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/internalServerErrorResponse'
 */
router.get('/profile', authMiddleware, authController.getProfile);

/**
 * @swagger
 * /auth/updateProfile:
 *   put:
 *     summary: Update user profile
 *     description: >
 *       Update the logged-in user's personal information.
 *       Pass the JWT token in the Authorization header.
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               email:
 *                 type: string
 *               profileImage:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/profileSchema'
*       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/unauthorizedResponse'
 *       404:
 *         description: Not Found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/notFoundResponse'
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/internalServerErrorResponse'
 */
router.put('/updateProfile', authMiddleware, authController.updateProfile);


/**
 * @swagger
 * /auth/listUsers:
 *   get:
 *     summary: Get all users
 *     description: Retrieve a list of all registered users. Pass the JWT token in the Authorization header.
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of users retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/userSchema'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/unauthorizedResponse'
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/internalServerErrorResponse'
 */
router.get('/listUsers', authController.getAllUsers);

/**
 * @swagger
 * /auth/assignRole:
 *   post:
 *     summary: Assign a role to a user
 *     description: >
 *       Assign a specific role to a user. Only admins can perform this action.
 *       Pass the JWT token in the Authorization header.
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 description: The ID of the user to assign a role
 *               role:
 *                 type: string
 *                 description: The role to assign (e.g., admin, user)
 *     responses:
 *       200:
 *         description: Role assigned successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/roleAssignmentSchema'
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
 *         description: Forbidden – Only admins can assign roles
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/forbiddenResponse'
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/internalServerErrorResponse'
 */
router.post('/assignRole',assignRoleValidation,authMiddleware,adminOnlyMiddleware, authController.assignRole)

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Logout the current user
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logout successful
 *       401:
 *         $ref: '#/components/schemas/unauthorizedResponse'
 */
router.post('/logout', authMiddleware, authController.logout);

module.exports = router;
