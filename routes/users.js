const {User} = require('../models/user.js')
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { UserFollow } = require('../models/userFollow.js');

router.get(`/`, async (req,res)=>{
    // const userList = await User.find().select('name phone email');
    const userList = await User.find().select('-passwordHash');


    if(!userList){
        res.status(500).json({'success': false})
    }
    res.send(userList);
});

router.get(`/:id`, async (req,res)=>{
    const user = await User.findById(req.params.id).select('-passwordHash');

    if(!user){
        res.status(500).json({message: 'The user with the given ID was not found'})
    }
    res.status(200).send(user);
});

router.get(`/get/count`, async (req,res)=>{
    const userCount = await User.countDocuments(count => count).clone();
    if(!userCount){
        res.status(500).json({'success': false})
    } 
    res.send({userCount: userCount});
});

router.post('/login', async (req,res)=>{
    const user = await User.findOne({email: req.body.email});
    const secret = process.env.secret;
    if(!user){
        return res.status(400).send('User not found');
    }

    if(user && bcrypt.compareSync(req.body.password, user.passwordHash)){
        const token = jwt.sign(
            {
            userId: user.id,
            isAdmin:user.isAdmin
            }, 
            secret,
            {expiresIn: '1d'}
        )

        res.status(200).send({user: user.email, token: token});
    } else {
        res.status(400).send('Wrong Password');
    }

})

router.post('/register', async (req,res)=>{
    let user = new User({
        username: req.body.username,
        name: req.body.name,
        email: req.body.email,
        passwordHash: bcrypt.hashSync(req.body.password, 10),
        isAdmin: req.body.isAdmin,
        age: req.body.age,
        weight: req.body.weight,
        height: req.body.height,
        profilePic: req.body.profilePic
    })
    user = await user.save();

    if(!user)
        return res.status(400).send('User cannot be created')

    res.send(user);

})

router.put('/:id',async (req,res)=>{
    const user = await User.findByIdAndUpdate(
        req.params.id,
        {
            username: req.body.username,
            name: req.body.name,
            email: req.body.email,
            age: req.body.age,
            weight: req.body.weight,
            height: req.body.height,
            profilePic: req.body.profilePic
        },
        {new:true}
    )
    if(!user)
    return res.status(400).send('user cannot be created');

    res.send(user);
})


router.delete('/:id', (req,res)=>{
    User.findByIdAndRemove(req.params.id).then(async user =>{
        if(user){
            await user.followed.map( async follower => {
                await UserFollow.findByIdAndRemove(follower)
            })
            await user.following.map( async whoever => {
                await UserFollow.findByIdAndRemove(whoever)
            })
            return res.status(200).json({success:true, message:'user is deleted'})
        } else {
            return res.status(404).json({success:false,message:"user not found"})
        }
    }).catch(err=>{
        return res.status(400).json({success:false, error:err})
    })
})

module.exports = router;