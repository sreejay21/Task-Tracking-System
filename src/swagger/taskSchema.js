const createTaskResponse = {
  type: 'object',
  title: 'createTaskResponse',
  properties: {
    status: { type: 'boolean', description: 'Response status', default: true },
    responsecode: { type: 'integer', description: 'HTTP response code', default: 200 },
    result: {
      type: 'object',
      properties: {
        message: { type: 'string', description: 'Success message when task is created' },
        task: {
          type: 'object',
          properties: {
            taskId: { type: 'string', description: 'Encrypted task identifier' },
            title: { type: 'string', description: "Title of the task" },
            description: { type: 'string', description: "Detailed description of the task" },
            dueDate: { type: 'string', format: 'date-time', description: 'Deadline for the task' },
            status: { type: 'string', description: 'Current status of the task (open/completed)' },
            createdBy: {
              type: 'object',
              properties: {
                name: { type: 'string', description: 'Name of the user who created the task' }
              }
            },
            assignedTo: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  name: { type: 'string', description: 'Name of the assigned user' }
                }
              }
            },
            remainingDays: { type: 'integer', description: 'Days remaining until due date' },
            completedUsers: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  username: { type: 'string', description: 'Name of the user who completed the task' }
                }
              }
            }
          }
        }
      }
    }
  }
};

const listTasksResponse = {
  type: 'object',
  title: 'listTasksResponse',
  properties: {
    status: { type: 'boolean', description: 'Response status', default: true },
    responsecode: { type: 'integer', description: 'HTTP response code', default: 200 },
    result: {
      type: 'object',
      properties: {
        tasks: {
          type: 'array',
          description: 'List of tasks',
          items: {
            type: 'object',
            properties: {
              taskId: { type: 'string', description: 'Encrypted task identifier' },
              title: { type: 'string', description: "Title of the task" },
              description: { type: 'string', description: "Detailed description of the task" },
              dueDate: { type: 'string', format: 'date-time', description: 'Deadline for the task' },
              status: { type: 'string', description: 'Current status of the task (open/completed)' },
              createdBy: {
                type: 'object',
                properties: {
                  name: { type: 'string', description: 'Name of the user who created the task' }
                }
              },
              assignedTo: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    name: { type: 'string', description: 'Name of the assigned user' }
                  }
                }
              },
              remainingDays: { type: 'integer', description: 'Days remaining until due date' },
              completedUsers: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    username: { type: 'string', description: 'Name of the user who completed the task' }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
};

const assignTaskResponse = {
  type: 'object',
  title: 'assignTaskResponse',
  properties: {
    status: { type: 'boolean', description: 'Response status', default: true },
    responsecode: { type: 'integer', description: 'HTTP response code', default: 200 },
    result: {
      type: 'object',
      properties: {
        message: { type: 'string', description: 'Success message when task is assigned' },
        task: {
          type: 'object',
          properties: {
            taskId: { type: 'string', description: 'Encrypted task identifier' },
            title: { type: 'string', description: "Title of the task" },
            description: { type: 'string', description: "Detailed description of the task" },
            dueDate: { type: 'string', format: 'date-time', description: 'Deadline for the task' },
            status: { type: 'string', description: 'Current status of the task (open/completed)' },
            createdBy: {
              type: 'object',
              properties: {
                name: { type: 'string', description: 'Name of the user who created the task' }
              }
            },
            assignedTo: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  name: { type: 'string', description: 'Name of the assigned user' }
                }
              }
            },
            remainingDays: { type: 'integer', description: 'Days remaining until due date' },
            completedUsers: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  username: { type: 'string', description: 'Name of the user who completed the task' }
                }
              }
            }
          }
        }
      }
    }
  }
};

module.exports = {
  createTaskResponse,
  listTasksResponse,
  assignTaskResponse
};