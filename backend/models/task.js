const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    category: { type: String, enum:['inventory','movement','additional','urgent'],default: "additional" },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    status: {
        type: String,
        enum: ["pending", "in-progress", "completed"],
        default: "pending",
    },
    completionProof:{ type : String},
    createdAt: { type: Date, default: Date.now, immutable: true },
    updatedAt : { type : Date, default : Date.now},
    dueDate: { type: Date },
});

taskSchema.pre('save', function(next) {
    this.updatedAt = new Date();
    next();
});


module.exports = mongoose.model("task", taskSchema);
