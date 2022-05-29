const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
var corsOptions = {
    origin: "http://localhost:8081"
};
app.use(cors(corsOptions));
// parse requests of content-type - application/json
app.use(bodyParser.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
// simple route
app.get("/", (req, res) => {
    res.json({ message: "RACI node app." });
});
// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});

const db = require("./app/models");
const ProjectController = require("./app/controllers/project.controller");
const DeliverableController = require("./app/controllers/deliverable.controller");
const RoleController = require("./app/controllers/role.controller");
const run = async () => {
    const project1 = await ProjectController.create({
        title: "First Project",
        description: "Description of first project.",
    });
    const project2 = await ProjectController.create({
        title: "Second Project",
        description: "Description of second project.",
    });
    const project3 = await ProjectController.create({
        title: "Third Project",
        description: "Description of third project.",
    });
    const deliverable1 = await DeliverableController.create({
        title: "First Deliverable",
        description: "Description of first deliverable.",
    });
    const deliverable2 = await DeliverableController.create({
        title: "Second Deliverable",
        description: "Description of second deliverable.",
    });
    const role1 = await RoleController.create({
        title: "First Role",
        description: "Description of first role.",
    });
    const role2 = await RoleController.create({
        title: "Second Role",
        description: "Description of second role.",
    });

    await DeliverableController.addProject(deliverable1.id, project1.id);
    await DeliverableController.addProject(deliverable1.id, project2.id);
    await RoleController.addProject(role1.id, project1.id);
    await RoleController.addProject(role2.id, project1.id);

    const foundFirstDeliverable = await DeliverableController.findById(deliverable1.id);
    const foundSecondRole = await RoleController.findById(role2.id);
    const foundFirstProject = await ProjectController.findById(project2.id);

    const deliverables = await DeliverableController.findAll();
    const roles = await RoleController.findAll();
    const projects = await ProjectController.findAll();

};
// db.sequelize.sync();
db.sequelize.sync({ force: true }).then(() => {
  console.log("Drop and re-sync db.");
  run();
});