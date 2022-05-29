module.exports = (sequelize, Sequelize) => {
    const Assignment = sequelize.define("assignment", {
        raci: {
        type: Sequelize.STRING
        },
    });
    return Assignment;
};