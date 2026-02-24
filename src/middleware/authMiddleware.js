const common = require('../utilities/common');
const responseHelper = require('../responseModels/apiResponseHelper');
const constantMessage = require("../utilities/constantMessage")

const authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return responseHelper.unAuthorized(res);
        }

        const token = authHeader.split(' ')[1];
        if (!token) {
            return responseHelper.unAuthorized(res);
        }

        const decoded = common.verifyToken(token);
        req.user = decoded;

        next();
    } catch (error) {
        return responseHelper.unAuthorized(res);
    }
};

const adminOnlyMiddleware = (req, res, next) => {
    try {
        if (!req.user) {
            return responseHelper.unAuthorized(res);
        }
        if (req.user.role !== constantMessage?.constantValue?.admin) {
            return responseHelper.forbiddenErrorMessage(
                { message: constantMessage?.errorMessage?.adminAccessErrror },
                res
            );
        }
        next();
    } catch (error) {
        return responseHelper.internalServerError(res, error.message);
    }
};

module.exports = {
    authMiddleware,
    adminOnlyMiddleware
};