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
    },
    async findUserById(id) {
        try {
            return await User.findById(id);
        }
        catch (error) {
            throw error;
        }
    },
    async updateUserById(id, updateData) {
        return await User.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        );
    },
    async getAllUsers() {
        try{
            return await User.find({});
        } 
        catch (error) {
            throw error;
        }
    },
    async updateUserRole (userid,role){
      try {
        return await User.findByIdAndUpdate(
          userid,
          { role: role },
          { new: true },
        );
      } catch (error) {
        throw error;
      }
    }

}

module.exports = userRepository;