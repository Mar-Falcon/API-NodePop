const basicAuth = require('basic-auth');

module.exports = (req, res, next) => {

  const users = basicAuth(req);

  // buscar en la base de datos el usuario y comprobar sus credenciales

  if (!users || users.name !== 'admin' || users.pass !== '1234') {
    res.set('WWW-Authenticate', 'Basic realm=Authorization required');
    res.sendStatus(401);
    return;
  }

  next();

}