import express from "express";
import { userRoutes, profileRoutes } from "./routes/index.js";
import connectDB from "./config/db.js";
// import http from 'http'
// import socketIO from 'socket.io'
// const server = http.createServer(app);
// const io = socketIO(server)

// io.on('connection', socket => {
//     console.log('user cononnected')
//     socket.on('chat message', msg => {
//         console.log(msg)
//     })
// })

const app = express();

// connect database
connectDB();

app.use(express.json({ extended: false }));
app.use(userRoutes);
app.use(profileRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});