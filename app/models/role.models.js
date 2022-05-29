module.exports = (sequelize, Sequelize) => {
    const Role = sequelize.define("role", {
        title: {
        type: Sequelize.STRING
        },
        description: {
        type: Sequelize.STRING
        },
    });
    return Role;
};