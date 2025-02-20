const home = (req, res) => {
    res.render('index.ejs', {title: 'My Cookbook'})
}

module.exports = {
    home,
}