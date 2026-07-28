const bcrypt = require("bcrypt");
const UserModel = require("../models/User");

function findUserByUsername(username) {
  return UserModel.findUserByUsername(username);
}

function login(username, password) {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await findUserByUsername(username);

      if (!user) {
        console.warn(`[AUDIT] Login failed - username: ${username}, time: ${new Date().toISOString()}, reason: user not found`);
        return resolve({ success: false, message: "Invalid username or password" });
      }

      const match = await bcrypt.compare(password, user.PasswordHash);

      if (!match) {
        console.warn(`[AUDIT] Login failed - username: ${username}, time: ${new Date().toISOString()}, reason: wrong password`);
        return resolve({ success: false, message: "Invalid username or password" });
      }

      console.info(`[AUDIT] Login successful - username: ${user.Username}, time: ${new Date().toISOString()}`);
      resolve({
        success: true,
        user: { id: user.UserID, username: user.Username, role: user.Role }
      });
    } catch (err) {
      reject(err);
    }
  });
}

function getCurrentUser(userId) {
  return UserModel.getUserRecordById(userId).then((user) => {
    if (!user) return null;
    return { id: user.UserID, username: user.Username, role: user.Role };
  });
}

module.exports = { login, getCurrentUser, findUserByUsername };
