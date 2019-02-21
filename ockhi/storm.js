const app = require('express')();
const cors = require('cors')
const ss = require('socket.io-stream');
const fs = require('fs-extra');
const httpServer = require('http').createServer(app).listen(8080); // HTTP
// const server = require('https').createServer(opts, app); // HTTPS
const io = require('socket.io')(server);
const SocketIOFile = require('socket.io-file');
const bodyParser = require('body-parser');
const mediaSwitch = require('./switch/switchPost')

app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))

app.post('/switch', function (req, res) {
    console.log(req.body);

    mediaSwitch.switchPostHandler(io, req, function (result) {
        // console.log(result);
        res.send(result);
    });
});



