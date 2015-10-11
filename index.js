var express = require('express'),
    app = express(),
    socket = require('socket.io'),
    io,
    port = 8080;

app.set("views", __dirname + '/tpl');
app.set('view engine', 'jade');
app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res) {
    res.render('page');
});

io = socket.listen(app.listen(port));

var users = {};
var getUsers = function (obj) {
    var tmp = [];
    for (var i in obj) tmp.push(obj[i]);
    return tmp.join(', ');
};

io.sockets.on('connection', function (client) {
    client.on('send', function (data) {
        io.sockets.emit('message', {message: data.message});
    });
    client.on('hello', function (data) {
        client.nickname = data.name;
        client.emit('message', {message: '--- Добро пожаловать в чат ' + data.name + '! ---'});
        client.broadcast.emit('message', {message: '--- ' + data.name + ' присодинился к чату ---'});

        if (Object.keys(users).length > 0) {
            var userList = getUsers(users);
            client.emit('message', {message: '--- Уже в чате ' + userList + ' ---'});
        } else {
            client.emit('message', {message: '--- Кроме вас в чате накого нет :( ---'});
        }

        users[client.id] = data.name;
    });
    client.on('disconnect', function (data) {
        if (Object.keys(users).length > 1)
            if (client.nickname)
                client.broadcast.emit('message', {message: '--- ' + client.nickname + ' покинул чат ---'});
        delete users[client.id];
    });
});