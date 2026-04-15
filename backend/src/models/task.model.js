import mongoose from 'mongoose'

const {Schema} = mongoose;

const taskSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },

        description: {
            type: String,
            default: "",
            trim: true,
        },
        project: {
            type: Schema.Types.ObjectId,
            ref: "Project",
            required: true,
        },
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        assignees: [{  
            type: Schema.Types.ObjectId,
            ref: "User",
        }],
        status: {
            type: String,
            enum: ["todo", "in_progress", "done"],
            default: "todo",
        },
        priority: {
            type: String,
            enum: ["low", "medium", "high"],
            default: "medium",
        },
        dueDate: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
    }
)

const task = mongoose.model("Task", taskSchema);
export default task;