const common = require('../utilities/common');
const responseHelper = require('../responseModels/apiResponseHelper');

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return responseHelper.unAuthorized(res);
    }
    const token = authHeader.split(' ')[1];
    if (!token) {
        return responseHelper.unAuthorized(res);
    }
    try {
        const decoded = common.verifyToken(token);
        req.user = decoded;
        next();
    } catch (error) {
        return responseHelper.unAuthorized(res);
    }
};

module.exports = authMiddleware;