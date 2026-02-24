const common = require('../utilities/common');
const responseHelper = require('../responseModels/apiResponseHelper');
const userRepository = require('../repositories/authRepsoitory');
const constantMessage = require('../utilities/constantMessage');


const register = async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body;
        const existingUser = await userRepository.findUserByEmail(email);
        if (existingUser) {
            return responseHelper.getErrorResult(constantMessage.responseMessages.userExists, res);
        }
        const hashedPassword = await common.hashPassword(password);
        const newUser = await userRepository.createUser({ firstName, lastName, email, password: hashedPassword });
        
        const responseData = {
            message: constantMessage.responseMessages.userCreated,
                firstName: newUser?.firstName,
                lastName: newUser?.lastName,
                email: newUser?.email,
                password: newUser?.password,
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


const getProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await userRepository.findUserById(userId);
        if (!user) {
            return responseHelper.notFound(res);
        }
        const responseData = {
            firstName: user?.firstName,
            lastName: user?.lastName,
            email: user?.email,
            profileImage: user?.profileImage
        };
        responseHelper.Ok(responseData, res);
    } catch (error) {
        responseHelper.internalServerError(res, error.message);
    }
};

const updateProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const { firstName, lastName, email, profileImage } = req.body;

        const user = await userRepository.findUserById(userId);
        if (!user) {
            return responseHelper.notFound(res);
        }

        if (email && email !== user.email) {
            const existingUser = await userRepository.findUserByEmail(email);
            if (existingUser) {
                return responseHelper.getErrorResult(
                   constantMessage.errorMessage.emailExists,
                    res
                );
            }
        }

        const updatedData = {
            ...(firstName && { firstName }),
            ...(lastName && { lastName }),
            ...(email && { email }),
            ...(profileImage && { profileImage })
        };

        const updatedUser = await userRepository.updateUserById(
            userId,
            updatedData
        );

        const responseData = {
            message: constantMessage.responseMessages.profileUpdatedSuccessfully,
            data: {
                firstName: updatedUser.firstName,
                lastName: updatedUser.lastName,
                email: updatedUser.email,
                profileImage: updatedUser.profileImage
            }
        };

        return responseHelper.Ok(responseData, res);

    } catch (error) {
        return responseHelper.internalServerError(res, error.message);
    }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await userRepository.getAllUsers();
    const responseData = users.map(user => ({
      id: common.encrypt(user._id),
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role || "User", 
      profileImage: user.profileImage || null
    }));

    responseHelper.Ok({ users: responseData }, res);

  } catch (error) {
    responseHelper.internalServerError(res, error.message);
  }
};

const assignRole = async (req, res) => {
    try {
        const { userid, role } = req.body;
        const currentUserId = req.user.id; 
         const decryptedUserId = common.decrypt(userid);

        if (currentUserId === decryptedUserId) {
            return responseHelper.getErrorResult(constantMessage.errorMessage.roleAssignError, res);
        }

        if (![constantMessage.constantValue.admin,constantMessage.constantValue.user].includes(role)) {
            return responseHelper.getErrorResult(constantMessage.errorMessage.invalidRole, res);
        }

        const user = await userRepository.findUserById(decryptedUserId);
        if (!user) {
            return responseHelper.notFound(res);
        }

        const updatedUser = await userRepository.updateUserRole(decryptedUserId, role);

        responseHelper.Ok({ message: `Role updated to ${role}`, user: { id:  common.encrypt(updatedUser._id), role: updatedUser.role } }, res);
    } catch (error) {
        responseHelper.internalServerError(res, error.message);
    }
};

module.exports = {
    register,
    login,
    getProfile,
    updateProfile,
    getAllUsers,
    assignRole
    
};


