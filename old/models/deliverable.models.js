module.exports = (sequelize, Sequelize) => {
    const Deliverable = sequelize.define("deliverable", {
        title: {
        type: Sequelize.STRING
        },
        description: {
        type: Sequelize.STRING
        },
    });
    return Deliverable;
};
  // Represents the deliverables table in postgreSQL db.
  // Will be created automagically: id, title, description, published, createdAt, updatedAt
  // After initializing Sequelize, we don’t need to write CRUD functions, Sequelize supports all of them:

// create a new Tutorial: create(object)
// find a Tutorial by id: findByPk(id)
// get all Tutorials: findAll()
// update a Tutorial by id: update(data, where: { id: id })
// remove a Tutorial: destroy(where: { id: id })
// remove all Tutorials: destroy(where: {})
// find all Tutorials by title: findAll({ where: { title: ... } })