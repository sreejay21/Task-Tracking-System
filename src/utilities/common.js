const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const algorithm = 'aes-128-cbc';
const secretKey = process.env.ID_ENCRYPTION_KEY 

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
                id: user?._id,
                email: user?.email,
                role: user?.role
            },
            process.env.JWT_SECRET, 
            { expiresIn: '1h' }
        );
    },

    verifyToken: (token) => {
        try {
            return jwt.verify(token, process.env.JWT_SECRET);
        } catch (error) {
            throw error;
        }
    },
   encrypt: (id) => {
        const iv = crypto.randomBytes(16); 
        const key = Buffer.from(secretKey, 'hex'); 
        const cipher = crypto.createCipheriv(algorithm, key, iv);
        let encrypted = cipher.update(id.toString(), 'utf8');
        encrypted = Buffer.concat([encrypted, cipher.final()]);
        return iv.toString('hex') + ':' + encrypted.toString('hex');
    },
    decrypt: (encryptedId) => {
        const key = Buffer.from(secretKey, 'hex');
        const textParts = encryptedId.split(':');
        const iv = Buffer.from(textParts.shift(), 'hex');
        const encryptedText = Buffer.from(textParts.join(':'), 'hex');
        const decipher = crypto.createDecipheriv(algorithm, key, iv);
        let decrypted = decipher.update(encryptedText);
        decrypted = Buffer.concat([decrypted, decipher.final()]);
        return decrypted.toString();
    }
};

module.exports = commonUtils;