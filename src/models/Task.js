const mongoose = require('mongoose');
const constants = require("../utilities/constantMessage")

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    dueDate: {
      type: Date,
      required: true
    },

    status: {
      type: String,
      enum: [constants?.Enums?.open,constants?.Enums?.completed],
      default: constants?.Enums?.open
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },

    assignedTo: {
       type: [mongoose.Schema.Types.ObjectId],
        ref: 'User',
        default: []
    },
    completedBy: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }],
        default: []
    },
    // optional association with a team/project
    team: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Team',
      default: null
    },
    comments: [
      {
        text: { type: String, required: true },
        commentedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true
        },
        createdAt: {
          type: Date,
          default: Date.now
        }
      }
    ],
    attachments: [
      {
        filename: { type: String, required: true },
        url: { type: String, required: true },
        uploadedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true
        },
        createdAt: {
          type: Date,
          default: Date.now
        }
      }
    ]
  },
  {
    timestamps: true
  }
);

taskSchema.index({ title: 'text', description: 'text' });

module.exports = mongoose.model('Task', taskSchema);