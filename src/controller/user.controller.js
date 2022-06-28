const { create, login } = require('../services/user.service');

exports.login = async (request, response) => {
  const { email, password } = request.body;

  if (!email || !password) {
    return response.status(401).send({ message: 'All fields must be filled' });
  }

  const token = await login(email, password);
  return response.status(200).send({ token });
};

exports.create = async (request, response) => {
  const { name, username, email, password } = request.body;

  const user = await create(name, username, email, password);

  delete user.password;
  return response.status(201).send({ user });
};
