const mongoose = require("mongoose");

const userNgoRelationSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
    ngo: { type: mongoose.Schema.Types.ObjectId, ref: "ngo", required: true },
    relationshipType: {
        type: [String],
        enum: ["member", "volunteer", "donor", "admin"],
        required: true,
    },
    permissions: [
        {
            type: [String],
            enum: [
                "create_task",
                "assign_task",
                "view_dashboard",
                "manage_users",
                "view_donations",
            ],
        },
    ],
    joinedAt: { type: Date, default: Date.now },
    isActive: { type: Boolean, default: true },
});

userNgoRelationSchema.index({ user: 1, ngo: 1 }, { unique: true });
userNgoRelationSchema.index({ ngo: 1, relationshipType: 1 });

module.exports = mongoose.model("userNgoRelation", userNgoRelationSchema);
