const jwt = require('jsonwebtoken');
const { hash } = require('bcrypt');
const { User } = require('../database/models');
const { AppError } = require('../errors/AppError');

const validateEmail = (email) =>
  String(email)
    .toLowerCase()
    .match(/\S+@\S+\.\S+/);

const findById = async (id) => {
  try {
    const user = await User.findByPk(id);

    return user ? user : null;
  } catch (error) {
    return null;
  }
};

const findByEmail = async (email) => {
  if (!validateEmail(email)) {
    throw new AppError('Invalid entries. Try again.');
  }

  const user = await User.findOne({ where: { email } });

  return user ? user : null;
};

const create = async (name, username, email, password, admin = 0) => {
  if (!name || !username || !email || !password) {
    throw new AppError('Invalid entries. Try again.');
  }

  const findUser = await findByEmail(email);

  if (findUser) {
    throw new AppError('Email already registered', 409);
  }

  const passwordHash = await hash(password, 8);

  const newUser = await User.create({
    name,
    username,
    email,
    password: passwordHash,
    admin,
  });

  return newUser;
};

const login = async (email, password) => {
  const userExists = await findByEmail(email);

  if (!userExists) {
    throw new AppError('Incorrect username or password', 401);
  }

  if (String(password) !== String(userExists.password)) {
    throw new AppError('Incorrect username or password', 401);
  }

  const { _id: userId } = userExists;

  const token = jwt.sign({}, 'e815d71ce6e97fef83815bd851361823', {
    subject: JSON.stringify({
      email: userExists.email,
      role: userExists.role,
      userId,
    }),
  });

  return token;
};

module.exports = {
  create,
  findByEmail,
  findById,
  login,
};
