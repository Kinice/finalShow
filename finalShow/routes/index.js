module.exports = function(app) {
    app.get('/', function (req, res) {
        res.render('index', { title: 'Express' });
    });

    app.get('/sss', function (req, res) {
        res.send('hello,world!');
    });
};
