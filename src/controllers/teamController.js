const teamRepository = require('../repositories/teamRepository');
const responseHelper = require('../responseModels/apiResponseHelper');
const constantMessage = require('../utilities/constantMessage');
const common = require('../utilities/common');

const createTeam = async (req, res) => {
    try {
        const { name, description } = req.body;
        const creatorId = req.user.id;
        const existingTeam = await teamRepository.getAllTeams();
        const duplicate = existingTeam.find(t => t.name.toLowerCase() === name.toLowerCase());
        if (duplicate) {
            return responseHelper.getErrorResult('Team with this name already exists', res);
        }
        const teamData = { name, description, createdBy: creatorId, members: [creatorId] };
        const team = await teamRepository.createTeam(teamData);
        return responseHelper.Ok({ message: constantMessage.responseMessages.teamCreated, team }, res);
    } catch (error) {
        return responseHelper.internalServerError(res, error.message);
    }
};

const addMember = async (req, res) => {
    try {
        const { teamId } = req.params;
        const { userId } = req.body; // encrypted
        const decryptedTeamId = common.decrypt(teamId);
        const decryptedUserId = common.decrypt(userId);
        const team = await teamRepository.findTeamById(decryptedTeamId);
        if (!team) {
            return responseHelper.notFound(res);
        }
        // only creator or admin can add
        if (req.user.id !== team.createdBy.toString() && req.user.role !== constantMessage.constantValue.admin) {
            return responseHelper.forbidden(res);
        }
        const updated = await teamRepository.addMember(decryptedTeamId, decryptedUserId);
        return responseHelper.Ok({ message: constantMessage.responseMessages.memberAdded, team: updated }, res);
    } catch (error) {
        return responseHelper.internalServerError(res, error.message);
    }
};

const joinTeam = async (req, res) => {
    try {
        const { teamId } = req.params;
        const decryptedTeamId = common.decrypt(teamId);
        const team = await teamRepository.findTeamById(decryptedTeamId);
        if (!team) {
            return responseHelper.notFound(res);
        }
        const updated = await teamRepository.addMember(decryptedTeamId, req.user.id);
        return responseHelper.Ok({ message: constantMessage.responseMessages.joinedTeam, team: updated }, res);
    } catch (error) {
        return responseHelper.internalServerError(res, error.message);
    }
};

const listTeams = async (req, res) => {
    try {
        const teams = await teamRepository.getAllTeams();
        const response = teams.map(team => ({
            id: common.encrypt(team._id),
            name: team.name,
            description: team.description,
            members: team.members.map(m => ({
                id: common.encrypt(m._id),
                name: `${m.firstName} ${m.lastName}`,
                email: m.email
            })),
            createdBy: team.createdBy
        }));
        return responseHelper.Ok({ teams: response }, res);
    } catch (error) {
        return responseHelper.internalServerError(res, error.message);
    }
};

module.exports = {
    createTeam,
    addMember,
    joinTeam,
    listTeams
};