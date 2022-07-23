const { hash, compare } = require("bcrypt");

exports.hashPassword = async (password) => {
  const hashedPassword = await hash(password, 12);
  return hashedPassword;
};

exports.verifyPassword = async (password, hashedPassword) => {
  const isValid = await compare(password, hashedPassword);
  return isValid;
};
