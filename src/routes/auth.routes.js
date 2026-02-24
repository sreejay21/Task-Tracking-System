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

router.get('/listUsers', authController.getAllUsers);

router.post('/assignRole',assignRoleValidation,authMiddleware,adminOnlyMiddleware, authController.assignRole)

module.exports = router;
