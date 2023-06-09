const mongoose = require('mongoose');

// Définition du schéma FoodEntry
const foodEntrySchema = new mongoose.Schema({
  nom: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  calories: {
    type: Number,
    required: true
  },
  type: {
    type: String,
    enum: ['petit déjeuner', 'déjeuner', 'goûter', 'dîner'],
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  pseudo:{
    type: String,
    required: false
  }
});

// Création du modèle FoodEntry à partir du schéma
const FoodEntry = mongoose.model('FoodEntry', foodEntrySchema);

module.exports = FoodEntry;
