import { Sequelize, projects, roles } from "../models";
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
const includeProject = [
  {
    model: projects,
    as: 'projects',
    attributes: ['id', 'title', 'description'],
    through: {
      attributes: []
    }
  }
]
const log = () => console.log('request: ', request, 'response: ', response)

// CRUD methods

export function create(request, response) {
  log()
  const role = {
    title: request.body.title,
    description: request.body.description,
  };

  validateOnTitle(request, response);

  roles.create(role)
    .then(data => response.send(data))
    .catch(err => handleError(response, err));
}

export function findAll(request, response) {
  log()
  const title = request.query.title;
  const condition = title ? { title: { [Op.iLike]: `%${title}%` } } : null;
  roles.findAll(
    { 
      where: condition,
      include: includeProject
    })
    .then(data => response.send(data))
    .catch(err => handleError(response, err));
}

export function findOne(request, response) {
  log()
  const id = request.params.id;
  roles.findByPk(id)
    .then(data => {
      if (data) {
        response.send(data);
      } else {
        response.status(404).send({
          message: `Cannot find Role with id=${id}.`
        });
      }
    })
    .catch(() => {
      response.status(500).send({
        message: `Error retrieving Role with id=${id}`
      });
    });
}

export function update(request, response) {
  const id = request.params.id;
  roles.update(request.body, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        response.send({
          message: "Role was updated successfully."
        });
      } else {
        response.send({
          message: `Cannot update Role with id=${id}. Maybe Role was not found or request.body is empty!`
        });
      }
    })
    .catch(err => {
      response.status(500).send({
        message: `Error updating Role with id=${id}`
      });
    });
}

const _delete = (request, response) => {
  const id = request.params.id;
  roles.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        ressponse.send({
          message: "Role was deleted successfully!"
        });
      } else {
        response.send({
          message: `Cannot delete Role with id=${id}. Maybe Role was not found!`
        });
      }
    })
    .catch(() => {
      response.status(500).send({
        message: `Could not delete Role with id=${id}`
      });
    });
};
export { _delete as delete };
export function deleteAll(request, response) {
  roles.destroy({
    where: {},
    truncate: false
  })
    .then(nums => {
      response.send({ message: `${nums} Roles were deleted successfully!` });
    })
    .catch(err => {
      response.status(500).send({
        message:
          err.message || "Some error occurred while removing all roles."
      });
    });
}
