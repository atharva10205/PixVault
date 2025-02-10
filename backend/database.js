const AWS = require('aws-sdk');
const express = require('express');
const multer = require('multer');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const router = express.Router();
require('dotenv').config();
const axios = require('axios');

const http = require("http");
const { Server } = require("socket.io");
const server = http.createServer(app);

server.listen(5001, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});



const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", 
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);
  
    socket.on("joinRoom", (room) => {
      socket.join(room);
      
    });
  
    socket.on("sendMessage", ({ room, message, sender }) => {
      io.to(room).emit("receiveMessage", { message, sender });
      
    });
  
    socket.on("disconnect", () => {
      
    });
  });



const rekognition = new AWS.Rekognition({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
});

const JWT_SECRET = process.env.JWT_SECRET;


mongoose.connect(process.env.MONG0_URL)
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.error("MongoDB connection error:", err));

const databaseImageSchema = new mongoose.Schema({
    title: String,
    description: String,
    imageUrl: String,
    userId: String,
    tags: [String], 
});
const dbimages = mongoose.model('images', databaseImageSchema);

const saveschema = new mongoose.Schema({
    
    userId: String,
    objectId:String,
});
const savedatabase = mongoose.model('save', saveschema);


const followerschema = new mongoose.Schema({
    
    userId: String,
    followerId : String,
    followerusername:String,
    followersPFP : String,
});
const followerdatabase = mongoose.model('followers', followerschema);

const profilePictureSchema = new mongoose.Schema({
    userId: String,
    imageUrl: String,
});

const ProfilePicture = mongoose.model('pfp', profilePictureSchema);

const commentsectionschema = new mongoose.Schema({
    objectId: String,
    commentinput: String,
    fetchCommentusername:String,
    userid:String,
    currentusersprofilepicture:String,
});
const CommentSchema = mongoose.model('comment', commentsectionschema);

const userschema  = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String}
});
const user = mongoose.model('User',userschema);

const messageSchema = new mongoose.Schema(
    {
      roomID: { type: String, required: true },
      sendername: { type: String, required: true },
      sendernameID: { type: String, required: true },
      senderPFP: { type: String, required: true },
      receivername: { type: String, required: true },
      receivernameID: { type: String, required: true },
      reciverPFP: { type: String, required: true },
      message: { type: String, required: true },
      timestamp: { type: Date, default: Date.now },
    },
    { timestamps: true }
  );
  
  const Message = mongoose.model('Message', messageSchema);



const s3 = new AWS.S3({
    accessKeyId: 'AKIAR3HUOQNDUX4JN6H2',
    secretAccessKey: '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',
    region: 'ap-south-1',
});

const storage = multer.memoryStorage();
const upload = multer({ storage });

app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true,
        optionsSuccessStatus: 200,
    })
);
app.use(express.json());
app.use(cookieParser());

const authenticate = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        console.log("No token provided error in authenticate");
        return null;
    }

    if (!token) {
        return res.status(403).json({ message: 'No token provided in authenticate' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.User = decoded;
        next();
    } catch (err) {
        res.status(403).json({ message: 'Invalid token' });
        console.log("Error in authentication:", err);
    }
};

app.post('/upload', authenticate, upload.single('image'), async (req, res) => {
    const file = req.file;
    const { title, description } = req.body;

    if (!file) {
        return res.status(400).json({ error: "No file uploaded" });
    }

    const params = {
        Bucket: 'atharva102050',
        Key: `${Date.now()}_${file.originalname}`,
        Body: file.buffer,
        ContentType: file.mimetype,
    };

    // Upload to S3
    s3.upload(params, async (err, s3Data) => {

        const rekognitionParams = {
            Image: {
                S3Object: {
                    Bucket: params.Bucket,
                    Name: params.Key,
                },
            },
            MaxLabels: 7,
            MinConfidence: 70, 
        };

        rekognition.detectLabels(rekognitionParams, async (error, data) => {
            if (error) {
                console.error("Error with Rekognition:", error);
                return res.status(500).json({ error: "Error analyzing image with Rekognition" });
            }

            const tags = data.Labels.map(label => label.Name);

            try {
                const newImage = new dbimages({
                    title,
                    description,
                    imageUrl: s3Data.Location,
                    userId: req.User.userId,
                    tags, 
                });

                await newImage.save();
                res.status(200).json(newImage);
            } catch (dbError) {
                console.error("Error saving to MongoDB:", dbError);
                res.status(500).json({ error: "Error saving to MongoDB" });
            }
        });
    });
});

app.get('/images', async (req, res) => {
    try {
        const images = await dbimages.find();
        res.status(200).json(images);
    } catch (error) {
        console.error("Error fetching images from MongoDB:", error);
        res.status(500).json({ error: "Error fetching images from MongoDB" });
    }
});

app.get('/created', authenticate, async (req, res) => {
    try {
        const userId = req.User.userId;
        const createdImages = await dbimages.find({ userId });
        res.status(200).json(createdImages);
    } catch (error) {
        console.error("Error fetching user's images:", error);
        res.status(500).json({ error: "Error fetching user's images" });
    }
});

app.delete('/delete/:imageId', authenticate, async (req, res) => {
    const { imageId } = req.params;
    try {
        const image = await dbimages.findById(imageId);

        if (!image) {
            return res.status(404).json({ error: "Image not found" });
        }

        const params = {
            Bucket: "atharva102050",
            Key: image.imageUrl.split('/').pop(),
        };

        s3.deleteObject(params, async (err) => {
            if (err) {
                console.error("Error deleting image from S3:", err);
                return res.status(500).json({ error: "Error deleting image from S3" });
            }

            await dbimages.findByIdAndDelete(imageId);
            res.status(200).json({ message: "Image deleted successfully" });
        });
    } catch (error) {
        console.error("Error in delete route:", error);
        res.status(500).json({ error: "Error in delete route" });
    }
});

app.get('/getobjectid/:imageId', async (req, res) => {
    const { imageId } = req.params;
    try {
        const image = await dbimages.findById(imageId);
        res.status(200).json({ objectId: image._id });
    } catch (error) {
        console.error("Error in /getobjectid route:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.get('/getimageUrl/:objectId',async(req,res)=>{
    const {objectId} = req.params;
    try{
        const imageDocument = await dbimages.findById(objectId);
        if(!imageDocument){console.log("error in get image url not in catch")};
        res.status(200).json({imageUrl  : imageDocument.imageUrl })
    }catch(error){
        console.log("error in imageDocument",error)
    }
})

app.get('/getsimillarimages/:objectId', async (req, res) => {
    const { objectId } = req.params;
    try {
      const imageDocument = await dbimages.findById(objectId);
      if (!imageDocument) {
        return res.status(404).json({ error: "Image not found" });
      }
      
      const similarImages = await dbimages.find({
        _id: { $ne: objectId },
        tags: { $in: imageDocument.tags },
      }).limit(10);
      
      res.status(200).json(similarImages);
    } catch (error) {
      console.error("Error fetching similar images:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
});




const uploadProfile = upload.single('profilePicture');

app.post('/uploadprofilephoto', authenticate, uploadProfile, async (req, res) => {
    const file = req.file;

    if (!file) {
        return res.status(400).json({ error: "No file uploaded" });
    }

    const params = {
        Bucket: 'atharva102050', // Your S3 bucket name
        Key: `profile_pictures/${Date.now()}_${file.originalname}`,
        Body: file.buffer,
        ContentType: file.mimetype,
    };

    try {
        const s3Data = await s3.upload(params).promise();

        const updatedProfilePicture = await ProfilePicture.findOneAndUpdate(
            { userId: req.User.userId },         
            { imageUrl: s3Data.Location },       
            { new: true, upsert: true }          
        );

        res.status(200).json({
            message: "Profile picture uploaded successfully",
            imageUrl: updatedProfilePicture.imageUrl,
        });
    } catch (error) {
        console.error("Error uploading profile picture:", error);
        res.status(500).json({ error: "Error uploading profile picture" });
    }
});

app.get('/profilephoto', authenticate, async (req, res) => {
    try {
        const profilePicture = await ProfilePicture.findOne({ userId: req.User.userId });
        if (!profilePicture) {
            return res.status(404).json({ error: "Profile picture not found" });
        }
        res.status(200).json({ imageUrl: profilePicture.imageUrl , userId :profilePicture.userId  });
    } catch (error) {
        console.error("Error fetching profile picture:", error);
        res.status(500).json({ error: "Error fetching profile picture" });
    }
});


app.get('/fetchpfp/:objectId', async (req, res) => {
    const { objectId } = req.params;
  
    try {
      const findinguserId = await dbimages.findById(objectId);
       userId = findinguserId.userId.toString(); 
     
      const findpfp = await ProfilePicture.findOne({ userId: userId }); 
      res.status(200).json({ imageUrl: findpfp.imageUrl });
    } catch (error) {
      console.log("Error in catch of fetchusername", error)
    }
});

app.get('/search/:input', async (req, res) => {
    const { input } = req.params;
    try {
        const response = await dbimages.find({
            $or: [
                { title: { $regex: input, $options: 'i' } },
                { tags: { $regex: input, $options: 'i' } }
            ]
        });
        res.status(200).json(response);
    } catch (error) {
        console.log("error in catch of /search/:input", error);
    }
});

app.get('/fetchtitle/:objectId', async (req, res) => {
    const { objectId } = req.params;
    try {
        const response = await dbimages.findById(objectId);
       res.status(200).json({title : response.title});
    } catch (error) {
        console.log("error in catch of /search/:input", error);
    }
});

app.get('/fetchdescription/:objectId', async (req, res) => {
    const { objectId } = req.params;
    try {
        const response = await dbimages.findById(objectId);
       res.status(200).json({description : response.description});
    } catch (error) {
        console.log("error in catch of /search/:input", error);
    }
});


app.post('/putcommentinDB', async (req, res) => {
    const { objectId, commentinput, fetchCommentusername, userid, currentusersprofilepicture } = req.body;

    const defaultProfilePicture = "https://cdn-icons-png.freepik.com/512/8861/8861091.png";

    try {
        const newcomment = new CommentSchema({
            objectId,
            commentinput,
            fetchCommentusername,
            userid,
            currentusersprofilepicture: currentusersprofilepicture || defaultProfilePicture, 
        });
        await newcomment.save();
        res.status(201).json({ message: 'Comment saved successfully', newcomment });
    } catch (error) {
        console.log("Error in catch of putcommentinDB backend", error);
        res.status(500).json({ message: "Server error" });
    }
});


app.get('/fetchcomments/:objectId', async (req, res) => {
    const { objectId } = req.params;
    
    try {
      const comments = await CommentSchema.find({ objectId })
        .populate('userid', 'username') 
        .exec();
      
      res.status(200).json(comments); 
    } catch (error) {
      console.error("Error in fetchcomments backend:", error);
      res.status(500).send("Error fetching comments");
    }
  });
  






app.get('/fetchanimeimages', async (req, res) => {
    try {
        const response = await dbimages.find({
            tags:"Anime"
        });
        res.status(200).json(response) ; 
    } catch (error) {
        console.error("Error in fetchcomments backend:", error);
    }
});

app.get('/fetchcarimages', async (req, res) => {
    try {
        const response = await dbimages.find({
            tags:"Car"
        });
        res.status(200).json(response) ; 
    } catch (error) {
        console.error("Error in fetchcomments backend:", error);
    }
});

app.get('/fetchcatimages', async (req, res) => {
    try {
        const response = await dbimages.find({
            tags:"Cat"
        });
        res.status(200).json(response) ; 
    } catch (error) {
        console.error("Error in fetchcomments backend:", error);
    }
});

app.get('/fetchNatuerimages', async (req, res) => {
    try {
        const response = await dbimages.find({
            tags:"Nature"
        });
        res.status(200).json(response) ; 
    } catch (error) {
        console.error("Error in fetchcomments backend:", error);
    }
});

app.get('/fetchTechimages', async (req, res) => {
    try {
        const response = await dbimages.find({
            tags:"Electronics"
        });
        res.status(200).json(response) ; 
    } catch (error) {
        console.error("Error in fetchcomments backend:", error);
    }
});

app.get('/fetchFoodimages', async (req, res) => {
    try {
        const response = await dbimages.find({
            tags:"Food"
        });
        res.status(200).json(response) ; 
    } catch (error) {
        console.error("Error in fetchcomments backend:", error);
    }
});

const get_user_id_from_token = (token) => {
    if (!token) {
        console.log("No token provided in get_user_id_from_token");
        return null;
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        return decoded.userId;
    } catch (error) {
        console.log("Error in get_user_id_from_token:", error);
    }
};

router.post('/Signup', async(req,res)=>{
    const { username, email, password } = req.body;

    try{

     const exestinguser = await user.findOne({email});
     if(exestinguser){ return res.status(400).json({ message: 'User already exists' });}


        const newUser = new user({ username, email, password });
        await newUser.save();

        const token = jwt.sign({ userId: newUser._id }, JWT_SECRET, { expiresIn: '30d' });

        res.cookie('token', token, { httpOnly: true, secure: false, sameSite: 'Strict' });

        res.status(201).json({ message: 'User registered successfully' });


    } catch(error) {
        console.error(error);
        res.status(500).json({ message: 'Error registering user' });
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const existingUser = await user.findOne({ email, password });
      if (existingUser) {
        const token = jwt.sign({ userId: existingUser._id }, JWT_SECRET, { expiresIn: '30d' });
        res.cookie('token', token, { httpOnly: true, secure: false, sameSite: 'Strict' });
  
        res.status(201).json({ message: 'User logged in successfully' });
      } else {
        res.status(200).json({ message: 'Password or Email is incorrect' });
      }
    } catch (error) {
      console.error(error);
    }
  });
  
  

router.post('/verify', async (req, res) => {
    const token = req.cookies.token;
    if (!token) {
        console.log("No token provided in /verify");
        return null;
    }
    if (!token) {
        return res.status(403).json({ message: "No JWT token provided" });
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            console.error("JWT verification error:", err);
            return res.status(403).json({ message: "Invalid JWT token" });
        }
        res.status(200).json({ message: "Token is valid", user: decoded });
    });
});

router.post('/logout',async(req,res)=>{
    res.clearCookie('token',{ httpOnly: true, secure: false, sameSite: 'Strict' });
    res.status(200).json({message : "user logout successfully"});
});

router.post('/username',async(req,res) =>{
   
        const token = req.cookies.token;
        if (!token) {
            console.log("No token provided in /username");
            return null;
        }

    try{
        const userId = get_user_id_from_token(token);

        const existingUser = await user.findById(userId);
        if (!existingUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ username: existingUser.username });

    } catch (error){
        console.log(error);
    }
})

app.get('/fetchusername/:objectId',async(req,res)=>{
    const { objectId } = req.params;

    try{
        const findinguserId = await dbimages.findById(objectId);
        const userId = findinguserId.userId;
        
        const findusername = await user.findById(userId);
        res.status(200).json({username : findusername.username});
        

        
    }catch(error){
        console.log("error in catch of fetchusername",error);
    }
})

app.get('/fetchcommentusername',async(req,res)=>{
    const token = req.cookies.token;
    if (!token) {
        console.log("No token provided in /fetchcommentusername");
        return null;
    }
    const userId = get_user_id_from_token(token);
    if (!userId) {
        console.log("No token provided in /fetchcommentusername");
        return null;
    }
    

    try{
        const findusername = await user.findById(userId);
        res.status(200).json({username : findusername.username});
        
    }catch(error){
        console.log("error in catch of fetchcommentusername",error);
    }
})

app.get('/fetchCommentpfp',async(req,res)=>{
    const token = req.cookies.token;
    if (!token) {
        console.log("No token provided in /fetchCommentpfp");
        return null;
    }
    const userId = get_user_id_from_token(token);
    if (!token) {
        console.log("No token provided in /fetchCommentpfp");
        return null;
    }

    try{
        const findpfp = await ProfilePicture.find({userId});
        res.status(200).json({ imageUrl: findpfp[0].imageUrl });
    }catch(error){
        console.log("error in catch of fetchcommentusername",error);
    }
})

app.get('/fetchuserid',async(req,res)=>{
    const token = req.cookies.token;
    if (!token) {
        console.log("No token provided in /fetchuserid");
        return null;
    }
    const userId = get_user_id_from_token(token);
    if (!userId) {
        console.log("No token provided in /fetchuserid");
        return null;
    }

    try{
        res.status(200).json({ userId });
    }catch(error){
        console.log("error in catch of fetchcommentusername",error);
    }
})

app.post('/handleuploadsave/:imageId',async(req,res) =>{
    const {imageId} = req.params;
    const token = req.cookies.token;
    if (!token) {
        console.log("No token provided in /handleuploadsave/:imageId");
        return null;
    }
    const userId = get_user_id_from_token(token);
    if (!userId) {
        console.log("No token provided in /handleuploadsave/:imageId");
        return null;
    }

   
    try{
        const newsave = new savedatabase({
            userId: userId,
            objectId:imageId,
        })
        await newsave.save();
    }catch(error){
        console.log("error in catch of handleuploadsave",error)
    }
})

app.get('/fetchsave', async (req, res ) => {
    const token = req.cookies.token;
    if (!token) {
        console.log("No token provided in /fetchsave" );
        return null;
    }
    try {
        const userId = get_user_id_from_token(token);
        const savedDataArray = await savedatabase.find({ userId });

        const objectIds = savedDataArray.map(data => data.objectId);
        const imageDataArray = await dbimages.find({ _id: { $in: objectIds } });

        res.status(200).json(imageDataArray);
    } catch (error) {
        console.error("Error in backend fetchsave:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

app.delete('/removesave/:objectId', async (req, res) => {
    const token = req.cookies.token;
    if (!token) {
        console.log("No token provided in /removesave/:objectId");
        return null;
    }
  
    try {
      const userId = get_user_id_from_token(token); 
      const objectId = req.params.objectId;

      const deletedImage = await savedatabase.findOneAndDelete({ objectId: objectId, userId: userId });
      res.status(200).json({ message: "Image removed successfully", deletedImage });
      
    } catch (error) {
      console.error("Error deleting image:", error);
      res.status(500).json({ error: "Failed to remove image" });
    }
});



app.get('/fetchviewersprofilepicture/:e', async (req, res) => {
    const { e } = req.params;

    try {
        const response = await dbimages.findById(e);
        const userId = response.userId;

        const userResponse = await user.findById(userId);
        const username = userResponse ? userResponse.username : null;

        const imagesresponse = await dbimages.find({ userId });

        const images = imagesresponse.map(image => ({
            url: image.imageUrl,
            title: image.title,
            description: image.description,
            _id: image._id,
        }));

        const response2 = await ProfilePicture.findOne({ userId });
        const imageUrl =  response2.imageUrl ;

        const response3 = await ProfilePicture.findOne({ userId });
        const userid =  response3.userId ;

        res.status(200).json({ 
            imageUrl, 
            username,
            images,
            userid,
        });
    } catch (error) {
        console.error("Unexpected error:", error);
        res.status(500).json({ error: "An internal server error occurred" });
    }
});


app.get('/fetchcurentusersusername', async(req,res)=>{
    const token = req.cookies.token;
    if (!token) {
        console.log("No token provided in /fetchcurentusersusername");
        return null;
    }
    const userId = get_user_id_from_token(token); 
    if (!userId) {
        console.log("No token provided in /fetchcurentusersusername");
        return null;
    }

    try{
        const response = await user.findById(userId) 
        res.status(200).json({username : response.username })
    }catch(error){
        console.log("error in catch of fetchcurentusersusername",error)
    }
})

app.get('/fetchcurentusersprofilepicture', async(req,res)=>{
    const token = req.cookies.token;
    if (!token) {
        console.log("No token provided in /fetchcurentusersprofilepicture");
        return null;
    }
    const userId = get_user_id_from_token(token); 
    if (!userId) {
        console.log("No token provided in /fetchcurentusersprofilepicture");
        return null;
    }

    try{
        const response = await ProfilePicture.findOne({userId}) 
        res.status(200).json({imageUrl : response.imageUrl })
    }catch(error){
        console.log("error in catch of fetchcurentusersprofilepicture",error)
    }
})


app.post('/handlefollowebutton/:pfpuserid', async (req, res) => {
    const { pfpuserid } = req.params;
    const token = req.cookies.token;
    const userId = get_user_id_from_token(token);

    try {
        const existingFollow = await followerdatabase.findOne({
            userId: pfpuserid,
            followerId: userId,
        });

        if (existingFollow) {
            return res.status(400).json({ message: 'Already following' });
        }

        const followersusername1 = await user.findById(userId);
        const followersusername = followersusername1.username;

        const followerspfp1 = await ProfilePicture.findOne({ userId: userId });
        const followerspfp = followerspfp1?.imageUrl || 'https://cdn-icons-png.freepik.com/512/8861/8861091.png';

        const response = new followerdatabase({
            userId: pfpuserid,
            followerId: userId,
            followerusername: followersusername,
            followersPFP: followerspfp,
        });

        await response.save();
        return res.status(200).json({ message: 'Followed successfully' });
    } catch (error) {
        console.error('Error in follow action:', error);
        return res.status(500).json({ message: 'Error in follow action', error });
    }
});



app.get('/checkifFollowing/:pfpuserid', async (req, res) => {
    const { pfpuserid } = req.params;
    const token = req.cookies.token;
    const userId = get_user_id_from_token(token); 


    try {
        const response = await followerdatabase.findOne({
            userId: pfpuserid,
            followerId: userId,
        });

        if (response) {
            return res.status(200).json({ message: 'User is following', data: response });
        } else {
            return res.status(404).json({ message: 'User is not following' });  // Correct 404 for not found
        }
    } catch (err) {
        return res.status(500).json({ message: 'Error in catch of checkifFollowing', error: err });
    }
});

app.post('/handleunfollowfollowbutton/:pfpuserid', async (req, res) => {
    const { pfpuserid } = req.params;
    const token = req.cookies.token;
    const userId = get_user_id_from_token(token); 

    try {
        const response = await followerdatabase.findOne({
            userId: pfpuserid,
            followerId: userId,
        });

        if (!response) {
            return res.status(404).json({ message: 'Not following' });
        }

        await response.deleteOne();
        return res.status(200).json({ message: 'Unfollowed successfully' });
    } catch (error) {
        console.error('Error in unfollow action:', error);
        return res.status(500).json({ message: 'Error in unfollow action', error });
    }
});

app.get('/cheaknumberoffollowers/:pfpuserid', async (req, res) => {
    const { pfpuserid } = req.params;

    
    try {
        const count = await followerdatabase.countDocuments({ userId:  pfpuserid });
        res.status(200).json({ count });
    } catch (error) {
        console.error('Error in handleunfollowfollowbutton', error);
    }
});

app.get('/cheaknumberoffollowers/:userId', async (req, res) => {
    const { userId } = req.params;
    try {
        const count = await followerdatabase.countDocuments({ userId:  userId });
        res.status(200).json({ count });
    } catch (error) {
        console.error('Error in handleunfollowfollowbutton', error);
    }
});


app.get('/fetchfollowerslist/:pfpuserid', async (req, res) => {

    const { pfpuserid } = req.params;
    try {
        const response = await followerdatabase.find({ userId: pfpuserid });
        const followersIdList = response.map(doc => doc.followerId);


        const fetchusername = await user.find({ _id: { $in: followersIdList } });
        const usernamelist = fetchusername.map(doc => doc.username);

        const fetchfollowerspfpurl = await ProfilePicture.find({ userId: { $in: followersIdList } });
        const followersPfpUrls = fetchfollowerspfpurl.map(doc => doc.imageUrl);

        res.status(200).json({
            followersId: followersIdList,
            usernames: usernamelist,
            profilePictureUrls: followersPfpUrls
        });
    } catch (error) {
        console.error('Error in fetchfollowerslist:', error);
    }
});

app.get('/fetchfollowerslist11/:userId', async (req, res) => {
    const { userId } = req.params;
    try {
        // Fetch all followers' IDs for the user
        const response = await followerdatabase.find({ userId });
        const followersIdList = response.map(doc => doc.followerId);

        // Fetch usernames for all followers
        const fetchUsernames = await user.find({ _id: { $in: followersIdList } });
        const usernamelist = fetchUsernames.map(doc => doc.username);

        // Fetch profile picture URLs for all followers
        const fetchFollowersPfpUrl = await ProfilePicture.find({ userId: { $in: followersIdList } });
        const followersPfpUrls = fetchFollowersPfpUrl.map(doc => doc.imageUrl);

        res.status(200).json({
            followersId: followersIdList,
            usernames: usernamelist,
            profilePictureUrls: followersPfpUrls,
        });
    } catch (error) {
        console.error('Error in fetchfollowerslist:', error);
        res.status(500).json({ error: 'Failed to fetch followers list' });
    }
});


app.post('/sendaccestoken/:accesstoken', async (req, res) => {
    const { accesstoken } = req.params;
  
    try {
      const response = await axios.get(
        'https://www.googleapis.com/oauth2/v1/userinfo?alt=json',
        {
          headers: {
            Authorization: `Bearer ${accesstoken}`,
          },
        }
      );
  
      const userInfo = response.data;
  
      const usermail = userInfo.email;
      const existingUser = await user.findOne({ email: usermail });

      const tokenValidationUrl = `https://oauth2.googleapis.com/tokeninfo?access_token=${accesstoken}`;
try {
    const validationResponse = await axios.get(tokenValidationUrl);
    console.log("Token validated:", validationResponse.data);
} catch (err) {
    console.error("Error validating token:", err);
}

  
      if (existingUser) {
        const token = jwt.sign({ userId: existingUser._id }, JWT_SECRET, { expiresIn: '30d' });
        res.cookie('token', token, { httpOnly: true, secure: false, sameSite: 'Strict' });
  
        return res.status(201).json({ message: 'User registered successfully' });

        
      } else {
        const  username = response.data.name;
        const email = response.data.email;
        
         const newUser = new user({ username : username, email : email });
         await newUser.save();
 
         const token = jwt.sign({ userId: newUser._id }, JWT_SECRET, { expiresIn: '30d' });
 
         res.cookie('token', token, { httpOnly: true, secure: false, sameSite: 'Strict' });
 
         res.status(201).json({ message: 'User registered successfully' });
      }
    } catch (error) {
      console.error('Error fetching user info:', error);
      res.status(500).json({ error: 'Failed to fetch user info' });
    }
  });

  app.get('/fetchfollowerslist', async (req, res) => {
    const { userId } = req.params;
    try {
        const response = await followerdatabase.find({ userId: userId });
        const followersIdList = response.map(doc => doc.followerId);


        const fetchusername = await user.find({ _id: { $in: followersIdList } });
        const usernamelist = fetchusername.map(doc => doc.username);

        const fetchfollowerspfpurl = await ProfilePicture.find({ userId: { $in: followersIdList } });
        const followersPfpUrls = fetchfollowerspfpurl.map(doc => doc.imageUrl);

        res.status(200).json({
            followersId: followersIdList,
            usernames: usernamelist,
            profilePictureUrls: followersPfpUrls
        });
    } catch (error) {
        console.error('Error in fetchfollowerslist:', error);
    }
});

app.get('/fetchclickedfollowersinfo/:followerId', async (req, res) => {
   const {followerId} = req.params;

   const response = await user.findById(followerId);
   const clickedpersonusername = response.username;

   const response1 = await ProfilePicture.findOne({ userId : followerId});
   const imageUrl = response1?.imageUrl || null;

   res.status(200).json({
    clickedpersonusername,
    imageUrl,
   })

});


app.post('/fetchcurrentuserID', async (req, res) => {
    const token = req.cookies.token;
    const userId = get_user_id_from_token(token);
    res.status(200).json({userId})

 });

 app.post('/PostMessageToDatabase/:reciverNAME/:message/:followerId/:roomID', async (req, res) => {
    const token = req.cookies.token;
    const senderID = get_user_id_from_token(token);
    const {followerId} = req.params;
    const {message} = req.params;
    const {roomID} = req.params;

   

    try {
        const response = await user.findById(senderID);
        const senderusername = response.username;

        const response2 = await ProfilePicture.findOne({userId:senderID})
        const senderPFP = response2.imageUrl;

        const response1 = await user.findById(followerId);
        const reciverusername = response1.username;

        const response3 = await ProfilePicture.findOne({userId:followerId})
        const reciverPFP = response3.imageUrl;

        const timestamp = new Date(); 

        const putmessegeindb = new Message({
            roomID:roomID,
            sendername : senderusername,
            sendernameID: senderID,
            senderPFP:senderPFP,
            receivername:reciverusername,
            receivernameID:followerId,
            reciverPFP:reciverPFP,
            message:message,
            timestamp:timestamp,
        })
        await putmessegeindb.save();

    } catch (error) {
        console.log("error in PostMessageToDatabase",error)
    }
 });

 app.get('/fetchMessages/:roomID', async (req, res) => {
    const { roomID } = req.params;  
    try {
      const response = await Message.find({ roomID:roomID }).sort({ timestamp: 1 }); 
      res.status(200).json(response);
    } catch (error) {
      console.error("Error fetching messages:", error);
      res.status(500).json({ error: "Error fetching messages" });
    }
  });
  


app.use('/', router);
app.listen(process.env.PORT, () => {
    console.log('Server is running on port port');
});
