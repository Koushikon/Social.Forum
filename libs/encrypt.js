const bcrypt = require("bcryptjs");

const encryptPassword = (password) => {
  return hash = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
};

const comparePassword = (oldPassword, hash) => {
  return passWord = bcrypt.compareSync(oldPassword, hash);
}

module.exports = {
  encryptPassword,
  comparePassword
}