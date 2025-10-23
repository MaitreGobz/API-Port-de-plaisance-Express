// Middleware to do check token in cookies 

function cookieAuth(req, res, next) {
  const token = req.cookies?.token;
  if (token && !req.headers.authorization) {
    req.headers.authorization = `Bearer ${token}`;
  }
  next();
};

module.exports = { cookieAuth };