const bcrypt = require('bcryptjs')
const crypto = require('crypto')
const jwt = require('jsonwebtoken');

const commonUtils = {
    hashPassword: async (password) => {
        return await bcrypt.hash(password, 10);
    },
    comparePassword: async (password, hashedPassword) => {
        return await bcrypt.compare(password, hashedPassword);
    },
    generateToken: (user) => {
        return jwt.sign(
            {
                id: user._id,
                email: user.email
            },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );
    },

}

module.exports = commonUtils;