const express = require('express');
const {Port, Client} = require('./src/config/serverConfig');
const connect = require('./src/config/databaseConfig')
const authRouter = require('./src/routes/authRouter')
const postRouter = require('./src/routes/postsRouter');
const userToFollow = require('./src/routes/userRouter');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const cloudinary = require("cloudinary").v2;
          
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

const app = express();

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
app.use(cors({
    credentials: true,
    origin: Client,
}))

app.use('/auth',authRouter);
app.use('/posts', postRouter);
app.use('/user', userToFollow);

app.listen(Port, async() =>{
    console.log(`Server started at ${Port}`);
    connect();
})
