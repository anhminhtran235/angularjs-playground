const express = require('express');
const http = require('http');
const cors = require('cors');
const port = 3000;
const db = require('./db/db');
const socketio = require('socket.io');
const Image = require('./models/Image');

const app = express();

const multer = require('multer');
const upload = multer({})

// Socket.io
const server = http.createServer(app);
const io = socketio(server, {
    cors: {
        origin: 'http://127.0.0.1:5500',
        methods: ["GET", "POST"]
    }
});

io.on('connection', (socket) => {
    console.log('New Websocket connection');

    const welcomeMessage = {
        type: 'text',
        data: 'Welcome to our server'
    }
    socket.emit('message', welcomeMessage);

    socket.on('message', data => {
        console.log(data);
        socket.broadcast.emit('message', data);
    })
})

// Upload images route
app.post('/upload', upload.single('upload'), (req, res) => {
    const imageBuffer = req.file.buffer;
    const image = new Image({imageBuffer});
    image.save().then(newImage => {
        const dataToSendViaWebsocket = {
            imageId: newImage._id,
        }
        io.emit('image', dataToSendViaWebsocket);
        res.send({msg: 'Upload image successfully', imageId: newImage._id});
    }).catch(reason => {
        res.status(404).send('Error while uploading image');
    })
})

// Cors and json
app.use(cors());
app.use(express.json());

// Get image by id
app.get('/image/:id', (req, res) => {
    const {id} = req.params;
    Image.findById(id).then(image => {
        res.set('Content-Type', 'image/jpeg');
        res.send(image.imageBuffer);
    }).catch(reason => {
        res.status(404).send(reason);
    })
})

// App listening info
server.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});
