const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");
const { errorResponse } = require("../utils/apiResponse");

const checkAuthentication = (request, response, next) => {
  if (request.url === "/user/register" || request.url === "/user/login") {
    return next();
  }

  const authToken = request.headers.authorization;
  if (!authToken) {
    return response.send(errorResponse("Token is Missing!"));
  }

  try {
    const token = authToken.split(" ")[1];
    // console.log("token: ", token);

    const decodedToken = jwt.verify(token, SECRET_KEY);
    // console.log("decodedToken: ", decodedToken);

    request.user = decodedToken;
    // console.log("user: ", request.user);
    console.log("current user role: ", request.user.role);

    return next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return response.status(401).send(errorResponse("Token has expired!"));
    }
    return response.status(401).send(errorResponse("Invalid Token!"));
  }    
  
};

//Admin middleware
const checkAdminRole = (request, response, next) => {
  // check if role is admin
  // if yes then allow the request

  if (request.user.role === "admin") {
    return next();
  }

  // if no then send an error message
  return response.send(errorResponse("UnAuthorized Access! Admins only"));
};

//Coordinator middleware
const checkCoordinatorRole = (request, response, next) => {
  // check if role is coordinator
  // if yes then allow the request

  if (request.user.role === "coordinator") {
    return next();
  }

  // if no then send an error message
  return response.send(errorResponse("UnAuthorized Access! Coordinator only"));
};

//Mentor middleware
const checkMentorRole = (request, response, next) => {
  // check if role is coordinator
  // if yes then allow the request

  if (request.user.role === "mentor") {
    return next();
  }

  // if no then send an error message
  return response.send(errorResponse("UnAuthorized Access! Mentor only"));
};

// Multi-role middleware
const checkRoles = (roles = []) => {
  return (req, res, next) => {
    if (!req.user) return res.status(401).send(errorResponse("Not authenticated"));
    return next();
    // if (roles.includes(req.user.role)) return next();
    // return res.status(403).send(errorResponse(`UnAuthorized Access! Only [${roles.join(", ")}]`));
  };
};

module.exports = {
  checkAuthentication,
  checkAdminRole,
  checkCoordinatorRole,
  checkMentorRole,
  checkRoles
};
