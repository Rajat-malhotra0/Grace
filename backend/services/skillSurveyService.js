const SkillSurvey = require("../models/skillSurvey");

async function createSkillSurvey(data) {
    try {
        const skillSurvey = new SkillSurvey(data);
        await skillSurvey.save();
        return skillSurvey;
    } catch (error) {
        throw error;
    }
}

async function readSkillSurveys(filter = {}) {
    try {
        const skillSurveys = await SkillSurvey.find(filter);
        return skillSurveys;
    } catch (error) {
        throw error;
    }
}

async function updateSkillSurvey(filter = {}, data = {}) {
    try {
        const skillSurvey = await SkillSurvey.findOneAndUpdate(filter, data, {
            new: true,
        });
        return skillSurvey;
    } catch (error) {
        throw error;
    }
}

async function deleteSkillSurvey(filter = {}) {
    try {
        await SkillSurvey.deleteOne(filter);
    } catch (error) {
        throw error;
    }
}

module.exports = {
    createSkillSurvey,
    readSkillSurveys,
    updateSkillSurvey,
    deleteSkillSurvey,
};
