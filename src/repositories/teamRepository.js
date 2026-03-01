const Team = require('../models/Team');

const teamRepository = {
    async createTeam(payload) {
        try {
            return await Team.create(payload);
        } catch (error) {
            throw error;
        }
    },
    async findTeamById(id) {
        try {
            return await Team.findById(id).populate('members', 'firstName lastName email');
        } catch (error) {
            throw error;
        }
    },
    async addMember(teamId, userId) {
        try {
            return await Team.findByIdAndUpdate(
                teamId,
                { $addToSet: { members: userId } },
                { new: true }
            ).populate('members', 'firstName lastName email');
        } catch (error) {
            throw error;
        }
    },
    async getAllTeams() {
        try {
            return await Team.find({}).populate('members', 'firstName lastName email');
        } catch (error) {
            throw error;
        }
    }
};

module.exports = teamRepository;