const {Post} = require('../models/post.js');
const {Like} = require('../models/like.js');
const {Comment} = require('../models/comment.js');
const express = require('express');
const router = express.Router();
const multer = require('multer');

const FILE_TYPE_MAP = {
    'image/png' : 'png',
    'image/jpg' : 'jpg',
    'image/jpeg' : 'jpeg'
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const isValid = FILE_TYPE_MAP[file.mimetype];
        let uploadError = new Error('invalid image type');
        if(isValid){
            uploadError = null
        }
        cb(uploadError, 'public/uploads')
    },
    filename: function (req, file, cb) {
      const fileName = file.originalname.split(' ').join('-');
      const extension = FILE_TYPE_MAP[file.mimetype];
      cb(null, `POST${fileName}-${Date.now()}.${extension}`)
    }
  })
  
const uploadOptions = multer({ storage: storage })

//Get LIST of Posts
router.get(`/`, async (req,res)=>{
    const postList = await Post.find()
    .populate('author', 'name postname profilePic')
    .populate({path: 'likes', populate: 'user'})
    .populate({path: 'comments', populate: 'author'});

    if(!postList){
        res.status(500).json({'success': false})
    }
    res.send(postList);
});

//Get Post by ID
router.get(`/:id`, async (req,res)=>{
    const post = await Post.findById(req.params.id)
    .populate('author', 'name postname profilePic')
    .populate({path: 'likes', populate: 'user'})
    .populate({path: 'comments', populate: 'author'});

    if(!post){
        res.status(500).json({'success': false})
    }
    res.send(post);
});

//get likes of a specific post
router.get(`/likes/:id`, async (req,res)=>{
    const post = await Post.findById(req.params.id).select("likes")
    .populate({path: 'likes', populate: 'user'})

    if(!post){
        res.status(500).json({'success': false})
    }
    res.send(post);
});

router.get(`/get/count`, async (req,res)=>{
    const postCount = await Post.countDocuments(count => count).clone();
    if(!postCount){
        res.status(500).json({'success': false})
    } 
    res.send({postCount: postCount});
});

//Get List of Posts from User ID
router.get(`/user/:id`, async (req, res) => {
    const userId = req.params.id;
    const postList = await Post.find({ user: `${userId}` })
    .populate('author', 'name postname profilePic')
    .populate({path: 'likes', populate: 'user'})
    .populate({path: 'comments', populate: 'author'})
    .exec();
  
    if (!postList) {
      res.status(500).json({ success: false });
    }
    res.status(200).send(postList);
  });


//New Post
router.post('/', uploadOptions.single('image'), async (req,res)=>{

    let url = '';
    if(req.file){
        const fileName = req.file.filename
        const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;
        url = `${basePath}${fileName}`
    }

    let post = new Post({
        author: req.body.author,
        caption: req.body.caption,
        image: url,
        likes: [],
        comments: []
    })
    post = await post.save();
    if(!post)
        return res.status(400).send('post cannot be created');

    res.send(post);
})

//change caption
router.put('/:id',async (req,res)=>{
    const post = await Post.findByIdAndUpdate(
        req.params.id,
        {
            caption: req.body.caption
        },
        {new:true}
    )
    if(!post)
    return res.status(400).send('post cannot be created');

    res.send(post);
})

//change likes
router.put('/like/:id',async (req,res)=>{
    if(!req.body.likes)return res.status(400).send("Empty parameters")

    const likes = Promise.all(req.body.likes.map(async like => {
        let newLike = new Like({
            user: like.user,
        })
        newLike = await newLike.save();
        return newLike._id;
    }))
    const likesArr = await likes;

    const post = await Post.findByIdAndUpdate(
        req.params.id,
        {
            likes: likesArr
        },
        {new:true}
    )
    if(!post)
    return res.status(400).send('post cannot be created');

    res.send(post);
})

//change comments
router.put('/comment/:id',async (req,res)=>{
    if(!req.body.comments)return res.status(400).send("Empty parameters")

    const comments = Promise.all(req.body.comments.map(async comment => {
        let newComment = new Comment({
            author: comment.author,
            content: comment.content,
            timestamp: comment.timestamp
        })
        newComment = await newComment.save();
        return newComment._id;
    }))
    const commentsArr = await comments;


    const post = await Post.findByIdAndUpdate(
        req.params.id,
        {
            comments: commentsArr
        },
        {new:true}
    )
    if(!post)
    return res.status(400).send('post cannot be created');

    res.send(post);
})

router.delete('/:id', (req,res)=>{
    Post.findByIdAndRemove(req.params.id).then( async post => {
        if(post){
            await post.likes.map( async like => {
                await Like.findByIdAndRemove(like)
            })
            await post.comments.map( async comment => {
                await Comment.findByIdAndRemove(comment)
            })
            return res.status(200).json({success:true, message:'post is deleted'})
        } else {
            return res.status(404).json({success:false,message:"post not found"})
        }
    }).catch(err=>{
        return res.status(400).json({success:false, error:err})
    })
})


module.exports = router;