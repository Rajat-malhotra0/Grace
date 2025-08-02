//Only used in userService.js

//its like a point for each 10 hours of work and similar
const ScoreWeights = {
    TASK_COMPLETION: 10,
    HIGH_PRIORITY_BONUS: 15,
    MEDIUM_PRIORITY_BONUS: 10,
    LOW_PRIORITY_BONUS: 5,

    ON_TIME_BONUS: 10,
    EARLY_COMPLETION_BONUS: 20,

    DAILY_STREAK_BONUS: 5,
    WEEKLY_MILESTONE: 50,
    MONTHLY_MILESTONE: 200,
};

// Simple impact calculation (0-10 rating)
function calculateImpact(tasksCompleted, hours) {
    const taskScore = Math.min(tasksCompleted * 0.1, 5);
    const hourScore = Math.min(hours * 0.05, 5);
    return Math.min(taskScore + hourScore, 10);
}

function calculateLevel(tasksCompleted) {
    if (tasksCompleted >= 100) return "Champion";
    if (tasksCompleted >= 50) return "Expert";
    if (tasksCompleted >= 20) return "Advanced";
    if (tasksCompleted >= 5) return "Intermediate";
    return "Beginner";
}

module.exports = {
    ScoreWeights,
    calculateImpact,
    calculateLevel,
};
