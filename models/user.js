const mongoose = require('mongoose')

const recipeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    ingredients: [String],
    instructions: { type: String, required: true }
}, { timestamps: true });

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    recipes: [recipeSchema] 
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
module.exports = User;