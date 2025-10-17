// Re-export user functions from the main database utility
export {
  saveUser as saveUserToMongoDB,
  getUser as getUserFromMongoDB,
  getAllUsers as getAllUsersFromMongoDB,
  deleteUser as deleteUserFromMongoDB,
  closeMongoDB
} from './mongoDatabase.js';