const bcrypt = require("bcrypt");
const UserModel = require("../models/UserModel");

const SALT_ROUNDS = 10;

function normalizeRole(role) {
  const allowed = ["Admin", "Employer", "Candidate"];
  if (!role || !allowed.includes(role)) {
    return "Candidate";
  }
  return role;
}

function createUser(user) {
  return new Promise(async (resolve, reject) => {
    try {
      const hashedPassword = await bcrypt.hash(user.password, SALT_ROUNDS);
      const role = normalizeRole(user.role);
      const result = await UserModel.createUser({ username: user.username, passwordHash: hashedPassword, role });
      resolve(result);
    } catch (err) {
      reject(err);
    }
  });
}

function getAllUsers() {
  return UserModel.getAllUsers();
}

function getUserById(id) {
  return new Promise((resolve, reject) => {
    UserModel.getUserRecordById(id)
      .then((user) => {
        if (!user) {
          return resolve(null);
        }
        resolve({ id: user.UserID, username: user.Username });
      })
      .catch(reject);
  });
}

function updateUser(id, user) {
  return new Promise(async (resolve, reject) => {
    try {
      const currentUser = await UserModel.getUserRecordById(id);
      if (!currentUser) {
        return resolve(null);
      }

      const username = user.username || currentUser.Username;
      const passwordHash = user.password
        ? await bcrypt.hash(user.password, SALT_ROUNDS)
        : currentUser.PasswordHash;
      const role = normalizeRole(user.role || currentUser.Role);

      const result = await UserModel.updateUser(id, { username, passwordHash, role });
      resolve(result);
    } catch (err) {
      reject(err);
    }
  });
}

function deleteUser(id) {
  return UserModel.deleteUser(id);
}

module.exports = { createUser, getAllUsers, getUserById, updateUser, deleteUser };
