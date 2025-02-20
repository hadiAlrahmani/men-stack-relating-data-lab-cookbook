require('dotenv').config()
const express = require('express')
const app = express()
const session = require('express-session')
const MongoStore = require('connect-mongo')
const mongoose = require('mongoose')
const path = require('path')
const isSignedIn = require('./middleware/is-signed-in')
const passUserToView = require('./middleware/pass-user-to-view')

const port = process.env.PORT || 3000

mongoose.connect(process.env.MONGODB_URI)
mongoose.connection.on('connected', () => {
    console.log(`Connected to MongoDB ${mongoose.connection.name}`)
})

// MIDDLEWARE
app.use(express.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, "public")))
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI }),
    cookie: { maxAge: 7 * 24 * 60 * 60 * 1000, httpOnly: true, secure: false }
}))
app.use(passUserToView)

// CONTROLLERS
const pagesCtrl = require('./controllers/pages')
const authCtrl = require('./controllers/auth')
const recipesCtrl = require('./controllers/recipes')

// ROUTES
app.get('/', pagesCtrl.home)
app.get('/auth/sign-up', authCtrl.signUp)
app.post('/auth/sign-up', authCtrl.addUser)
app.get('/auth/sign-in', authCtrl.signInForm)
app.post('/auth/sign-in', authCtrl.signIn)
app.get('/auth/sign-out', authCtrl.signOut)

app.get('/recipes', isSignedIn, recipesCtrl.listRecipes)
app.get('/recipes/new', isSignedIn, recipesCtrl.newRecipeForm)
app.post('/recipes', isSignedIn, recipesCtrl.addRecipe)
app.get('/recipes/:id', isSignedIn, recipesCtrl.showRecipe)
app.post('/recipes/:id/delete', isSignedIn, recipesCtrl.deleteRecipe)

app.get('/recipes/:id/edit', isSignedIn, recipesCtrl.editRecipeForm)
app.post('/recipes/:id/edit', isSignedIn, recipesCtrl.updateRecipe)
app.post('/recipes/:id/delete', isSignedIn, recipesCtrl.deleteRecipe)

app.listen(port, () => {
    console.log(`The express app is running on port ${port}`)
})