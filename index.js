
const express = require('express');
const app = express();
const path = require('path');
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 3000;


// Routing
app.use(express.static(path.join(__dirname, 'public')));
// app.get('/', (req, res) => {
//     res.sendFile(__dirname + '/public/index.html');
// })

io.on('connection', (socket) => {
    console.log("A user has connected", socket.id);
    socket.on('disconnect', () => {
        console.log("User disconnected");
    });

    // Now the socket is receving the data from the client
    // and is emitting the message to all the clients
    // that are connected to the server
    socket.on('timing', (data) => {
        io.sockets.emit('timing', data);
    });
    
    socket.on('play', (data) => {
        io.sockets.emit('play', data);
    }); 

    socket.on('pause', (data) => {
        io.sockets.emit('pause', data);
    });

    socket.on('change', (data) => {
        io.sockets.emit('change', data);
    }); 

    socket.on('newMessage', (data) => {
        io.sockets.emit('newMessage', data);
    }); 

    socket.on('error', function (err) {
        console.log(err);
    });


});

http.listen(port, () => {
    console.log(`Socket.IO server running at http://localhost:${port}/`);
});

// app.use(express.static('public'));