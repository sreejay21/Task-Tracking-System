const common = require('../utilities/common');
const responseHelper = require('../responseModels/apiResponseHelper');
const userRepository = require('../repositories/authRepsoitory');


const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const existingUser = await userRepository.findUserByEmail(email);
        if (existingUser) {
            return responseHelper.getErrorResult('User already exists', res);
        }
        const hashedPassword = await common.hashPassword(password);
        const newUser = await userRepository.createUser({ name, email, password: hashedPassword });
        const token = common.generateToken(newUser);
        responseHelper.successCreate({ user: newUser, token }, res);
    } catch (error) {   
        responseHelper.internalServerError(res, error.message);
    }
};



module.exports = {
    register
};


