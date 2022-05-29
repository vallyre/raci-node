import { Sequelize, projects, deliverables, roles, assignments } from "../models";
const Op = Sequelize.Op;

function handleError(response, err) {
  response.status(500).send({
    message: err.message || "An unknown error has occurred."
  });
}
const validateOnTitle = (request, response) => {
  if (!request.body.title) {
    response.status(400).send({
      message: 'Please supply a title.'
    })
    return;
  }
}
const includeAll = [
  {
    model: deliverables,
    as: 'deliverables',
    attributes: ['id', 'title', 'description'],
    through: {
      attributes: ['project_id']
    }
  },
  {
    model: roles,
    as: 'roles',
    attributes: ['id', 'title', 'description'],
    through: {
      attributes: ['project_id']
    }
  },
  {
    model: assignments,
    as: 'assignments',
    attributes: ['id', 'raci', 'deliverable_id', 'role_id'],
    through: {
      attributes: ['project_id']
    }
  }
]
const log = () => console.log('request: ', request, 'response: ', response)

// CRUD methods

export function create(request, response) {
  log()
  const project = {
    title: request.body.title,
    description: request.body.description,
  };

  validateOnTitle(request, response);

  projects.create(project)
    .then(data => response.send(data))
    .catch(err => handleError(response, err));
}

export function findAll(request, response) {
  log()
  const title = request.query.title;
  const condition = title ? { title: { [Op.iLike]: `%${title}%` } } : null;
  projects.findAll(
    { 
      where: condition,
      include: includeAll
    })
    .then(data => response.send(data))
    .catch(err => handleError(response, err));
}

export function findOne(request, response) {
  log()
  const id = request.params.id;
  projects.findByPk(id)
    .then(data => {
      if (data) {
        response.send(data);
      } else {
        response.status(404).send({
          message: `Cannot find Project with id=${id}.`
        });
      }
    })
    .catch(() => {
      response.status(500).send({
        message: `Error retrieving Project with id=${id}`
      });
    });
}

export function update(request, response) {
  const id = request.params.id;
  projects.update(request.body, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        response.send({
          message: "Project was updated successfully."
        });
      } else {
        response.send({
          message: `Cannot update Project with id=${id}. Maybe Project was not found or request.body is empty!`
        });
      }
    })
    .catch(err => {
      response.status(500).send({
        message: `Error updating Deliverable with id=${id}`
      });
    });
}

const _delete = (request, response) => {
  const id = request.params.id;
  projects.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        ressponse.send({
          message: "Project was deleted successfully!"
        });
      } else {
        response.send({
          message: `Cannot delete Project with id=${id}. Maybe Project was not found!`
        });
      }
    })
    .catch(() => {
      response.status(500).send({
        message: `Could not delete Project with id=${id}`
      });
    });
};
export { _delete as delete };
export function deleteAll(request, response) {
  projects.destroy({
    where: {},
    truncate: false
  })
    .then(nums => {
      response.send({ message: `${nums} Projects were deleted successfully!` });
    })
    .catch(err => {
      response.status(500).send({
        message:
          err.message || "Some error occurred while removing all projects."
      });
    });
}

  // create assignment
  export function createAssignment(request, response) {
    const { projectId, deliverableId, roleId } = request.params
    assignments.create({
        raci:request.body.raci,
        projectId: projectId,
        deliverableId: deliverableId,
        roleId: roleId
    })
    .then(data => response.send(data))
    .catch(err => handleError(response, err));
  }
  