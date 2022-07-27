const { hash, compare } = require("bcrypt");

/* Function to hash a password */
exports.hashPassword = async (password) => {
  const hashedPassword = await hash(password, 12);
  return hashedPassword;
};

/* Function to compare a non-hashed password with it's hashed counterpart */
exports.verifyPassword = async (password, hashedPassword) => {
  const isValid = await compare(password, hashedPassword);
  return isValid;
};
