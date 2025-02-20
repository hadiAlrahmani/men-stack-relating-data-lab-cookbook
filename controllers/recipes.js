const User = require('../models/user')

const newRecipeForm = (req, res) => {
    res.render('recipes/new.ejs', { title: 'Add Recipe' })
}

const addRecipe = async (req, res) => {
    const user = await User.findById(req.session.user._id)
    if (!user) return res.redirect('/auth/sign-in')

    user.recipes.push({
        name: req.body.name,
        ingredients: req.body.ingredients.split(','), 
        instructions: req.body.instructions
    })
    await user.save()
    res.redirect('/recipes')
}

const listRecipes = async (req, res) => {
    const user = await User.findById(req.session.user._id)
    if (!user) return res.redirect('/auth/sign-in')

    res.render('recipes/index.ejs', { title: 'My Recipes', recipes: user.recipes })
}

const showRecipe = async (req, res) => {
    const user = await User.findById(req.session.user._id)
    if (!user) return res.redirect('/auth/sign-in')

    const recipe = user.recipes.id(req.params.id)
    if (!recipe) return res.redirect('/recipes')

    res.render('recipes/show.ejs', { title: recipe.name, recipe })
}

const editRecipeForm = async (req, res) => {
    const user = await User.findById(req.session.user._id)
    if (!user) return res.redirect('/auth/sign-in')

    const recipe = user.recipes.id(req.params.id)
    if (!recipe) return res.redirect('/recipes')

    res.render('recipes/edit.ejs', { title: 'Edit Recipe', recipe })
}

const updateRecipe = async (req, res) => {
    const user = await User.findById(req.session.user._id)
    if (!user) return res.redirect('/auth/sign-in')

    const recipe = user.recipes.id(req.params.id)
    if (!recipe) return res.redirect('/recipes')

    recipe.name = req.body.name
    recipe.ingredients = req.body.ingredients.split(',')
    recipe.instructions = req.body.instructions

    await user.save()
    res.redirect(`/recipes/${req.params.id}`)
}

const deleteRecipe = async (req, res) => {
    const user = await User.findById(req.session.user._id)
    if (!user) return res.redirect('/auth/sign-in')

    user.recipes = user.recipes.filter(recipe => recipe._id.toString() !== req.params.id)
    await user.save()
    res.redirect('/recipes')
}

module.exports = {
    newRecipeForm,
    addRecipe,
    listRecipes,
    showRecipe,
    editRecipeForm,
    updateRecipe,
    deleteRecipe
}