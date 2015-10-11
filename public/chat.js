var socket = io.connect('http://localhost:8080/');
window.onunload = function () {
    socket.disconnect();
};
window.onload = function () {
    var field = document.getElementById('field'),
        form = document.getElementById('form'),
        content = document.getElementById('content');

    var name = prompt('Как вас зовут ?', 'Гость');
    if (name)
        socket.emit('hello', {name: name});
    form.onsubmit = function (e) {
        e.preventDefault();
        var text = field.value;
        socket.emit('send', {message: text});
    };

    var messages = [];
    socket.on('message', function (data) {
        if (data.message) {
            messages.push(data.message);
            var html = '';
            messages.forEach(function (item, index, arr) {
                html += item + '<br>';
            });
            content.innerHTML = html;
        } else {
            console.log('Что-то пошло не так');
        }
    });
};