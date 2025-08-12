const { errorResponse } = require("../utils/apiResponse");

const routeNotFound = (request, response, next) => {
  return response
    .status(404)
    .send(
      errorResponse(
        `The Request you are trying to access: ${request.method} - ${request.url} does not exists!!!`
      )
    );
};

module.exports = routeNotFound;
