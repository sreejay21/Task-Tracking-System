const common = require('../utilities/common');
const responseHelper = require('../responseModels/apiResponseHelper');
const userRepository = require('../repositories/authRepsoitory');
const constantMessage = require('../utilities/constantMessage');


const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const existingUser = await userRepository.findUserByEmail(email);
        if (existingUser) {
            return responseHelper.getErrorResult(constantMessage.responseMessages.userExists, res);
        }
        const hashedPassword = await common.hashPassword(password);
        const newUser = await userRepository.createUser({ name, email, password: hashedPassword });
        
        const responseData = {
            message: constantMessage.responseMessages.userCreated,
                name: newUser.name,
                email: newUser.email,
                password: newUser.password,
        };

        responseHelper.successCreate(responseData, res);
    } catch (error) {   
        responseHelper.internalServerError(res, error.message);
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userRepository.findUserByEmail(email);
        if (!user) {
            return responseHelper.unAuthorized(res);
        }
        const isPasswordValid = await common.comparePassword(password, user.password);
        if (!isPasswordValid) {
            return responseHelper.unAuthorized(res);
        }
            const token = common.generateToken(user);
            const responseData = {
                message: constantMessage.responseMessages.loginSuccessful,
                token
            };

            responseHelper.Ok(responseData, res);
    } catch (error) {
        responseHelper.internalServerError(res, error.message);
    }

}


module.exports = {
    register,
    login
    
};


