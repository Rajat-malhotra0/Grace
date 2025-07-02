const SkillSurvey = require("../models/skillSurvey");

async function createSkillSurvey(data) {
    try {
        const skillSurvey = new SkillSurvey(data);
        await skillSurvey.save();
        return skillSurvey;
    } catch (error) {
        console.error("Error creating skill survey:", error);
    }
}

async function readSkillSurveys(filter = {}) {
    try {
        const skillSurveys = await SkillSurvey.find(filter);
        return skillSurveys;
    } catch (error) {
        console.error("Error reading skill surveys:", error);
    }
}

async function updateSkillSurvey(filter = {}, data = {}) {
    try {
        const skillSurvey = await SkillSurvey.findOneAndUpdate(filter, data, {
            new: true,
        });
        return skillSurvey;
    } catch (error) {
        console.error("Error updating skill survey:", error);
    }
}

async function deleteSkillSurvey(filter = {}) {
    try {
        await SkillSurvey.deleteOne(filter);
    } catch (error) {
        console.error("Error deleting skill survey:", error);
    }
}

module.exports = {
    createSkillSurvey,
    readSkillSurveys,
    updateSkillSurvey,
    deleteSkillSurvey,
};
