module.exports = (sequelize, DataTypes) => {
    const Project = sequelize.define("project", {
      title: {
        type: DataTypes.STRING
      },
      description: {
        type: DataTypes.STRING
      }
    });
    return Project;
  };
