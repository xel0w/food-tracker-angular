const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  pseudo: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isAdmin: {type: Boolean, required: false, default: 0}
});

module.exports = mongoose.model('user', userSchema);
