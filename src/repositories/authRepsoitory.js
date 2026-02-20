const User = require('../models/User');

const userRepository = {

    async createUser(payload) {
        try {
          return await User.create(payload);
        }
        catch (error) {
            throw error;
        }
    },
    async findUserByEmail(email) {
        try {
            return await User.findOne({
                email
            });
        }
        catch (error) {
            throw error;
        }
        }
}

module.exports = userRepository;