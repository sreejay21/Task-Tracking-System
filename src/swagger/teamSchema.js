const teamSchema = {
  type: 'object',
  title: 'teamSchema',
  properties: {
    id: { type: 'string' },
    name: { type: 'string' },
    description: { type: 'string' },
    members: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          name: { type: 'string' },
          email: { type: 'string' }
        }
      }
    }
  }
};

const createTeamResponse = {
  type: 'object',
  title: 'createTeamResponse',
  properties: {
    status: { type: 'boolean' },
    responsecode: { type: 'integer' },
    result: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        team: teamSchema
      }
    }
  }
};

const listTeamsResponse = {
  type: 'object',
  title: 'listTeamsResponse',
  properties: {
    status: { type: 'boolean' },
    responsecode: { type: 'integer' },
    result: {
      type: 'object',
      properties: {
        teams: {
          type: 'array',
          items: teamSchema
        }
      }
    }
  }
};

module.exports = { teamSchema, createTeamResponse, listTeamsResponse }