const dbConfig = require("../../config/db.config.js");
const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: false,
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle
  }
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.projects = require('./projects.models.js')(sequelize, Sequelize);
db.deliverables = require("./deliverable.models.js")(sequelize, Sequelize);
db.roles = require('./role.models.js')(sequelize, Sequelize);
db.assignments = require('./assignment.model.js')(sequelize, Sequelize);

db.projects.belongsToMany(
    db.deliverables, {
        through: 'project_deliverable',
        as: 'deliverables',
        foreignKey: 'project_id'
    }
)
db.projects.belongsToMany(
    db.roles, {
        through: 'project_role',
        as: 'roles',
        foreignKey: 'project_id'
    }
)
db.projects.hasMany(
    db.assignments, {
        as: 'assignments'
    }
)
db.deliverables.belongsToMany(
    db.projects, {
        through: 'project_deliverable',
        as: 'projects',
        foreignKey: 'deliverable_id'
    }
)
db.deliverables.hasMany(
    db.assignments, {
        as: 'assignments'
    }
)
db.roles.belongsToMany(
    db.projects, {
        through: 'project_role',
        as: 'projects',
        foreignKey: 'role_id'
    }
)
db.roles.hasMany(
    db.assignments, {
        as: 'assignments'
    }
)
db.assignments.belongsTo(
    db.projects, {
        foreignKey: 'project_id',
        as: 'project'
    }
)
db.assignments.belongsTo(
    db.deliverables, {
        foreignKey: 'deliverable_id',
        as: 'deliverable'
    }
)
db.assignments.belongsTo(
    db.role, {
        foreignKey: 'role_id',
        as: 'role'
    }
)

module.exports = db;
