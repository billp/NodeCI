const User = require('../../models/User');

const createUsers = async () => {
  const user = await new User({}).save();

  return [user];
}

const deleteAllUsers = async (users) => {
  await Promise.all(users.map(user => User.deleteMany({ _id: user._id })))
}

module.exports = {
  createUsers,
  deleteAllUsers
};
