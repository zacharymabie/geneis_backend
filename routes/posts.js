const {Post} = require('../models/post.js');
const {post} = require('../models/post.js');
const {Like} = require('../models/like.js');
const {Comment} = require('../models/comment.js');
const express = require('express');
const router = express.Router();

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
    const postList = await Post.find({ user: `${userId}` }).exec();
  
    if (!postList) {
      res.status(500).json({ success: false });
    }
    res.status(200).send(postList);
  });

router.post('/', async (req,res)=>{
    const likes = Promise.all(req.body.likes.map(async like => {
        let newLike = new Like({
            post: like.post,
        })
        newLike = await newLike.save();
        return newLike._id;
    }))
    const likesArr = await likes;

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

    let post = new Post({
        author: req.body.author,
        caption: req.body.caption,
        image: req.body.image,
        likes: likesArr,
        comments: commentsArr
    })
    post = await post.save();
    if(!post)
        return res.status(400).send('post cannot be created');

    res.send(post);
})

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

router.delete('/:id', (req,res)=>{
    Post.findByIdAndRemove(req.params.id).then(post =>{
        if(post){
            return res.status(200).json({success:true, message:'post is deleted'})
        } else {
            return res.status(404).json({success:false,message:"post not found"})
        }
    }).catch(err=>{
        return res.status(400).json({success:false, error:err})
    })
})


module.exports = router;