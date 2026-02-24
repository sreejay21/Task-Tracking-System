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
    }
  },
  {
    timestamps: true
  }
);

taskSchema.index({ title: 'text', description: 'text' });

module.exports = mongoose.model('Task', taskSchema);