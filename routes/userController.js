var express = require('express');
var router = express.Router();
var localStorage = require('localStorage')
const {jwtkey} = require('../keys');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
var User = require('../models/user');
var _ = require('lodash');
var ObjectId = require('mongoose').Types.ObjectId;

/*------------------------------------------------------traj3lik list user ----------------------*/
router.get('/list/user', function(req,res)  {
    User.find({})
    .exec(function(err, lisP){
      if(err){
        console.log("err");
      } else{
        res.json(lisP);
      }
    });
  });

  router.route('/:email').get(function (req, res)
 {
    let email = req.params.email;
    User.find({email},function (err, lisP) {
      if(err){
        console.log("err");
      } else{
        res.json(lisP);
      }
    });
    }); 


/* -------------------------------------------------bch ta3mil compte --------------------------------------*/ 
router.post('/register', (req, res) => {
    let userData = req.body
    let user = new User(userData)
    user.save((err, registeredUser) => {
      if (err) {
        console.log(err)      
      } else {
        let payload = {subject: user._id}
      let token = jwt.sign(payload, 'secretKey')
      res.status(200).send({token})
      }
    })
  })


/*-----------------------------------------------------ta3 login -------------------------------------------*/
  /*router.post('/login', (req, res) => {
    let userData = req.body
    User.findOne({email: userData.email}, (err, user) => {
      if (err) {
        console.log(err)    
      } else {
        if (!user) {
          res.status(401).send('Invalid Email')
        } else 
        if ( user.password !== userData.password) {
          res.status(401).send('Invalid Password')
        } else {
          let payload = {subject: user._id}
          let token = jwt.sign(payload, 'secretKey')
          res.status(200).send({token})
        }
      }
    })
  }) */
  router.post('/login',async (req,res)=>{
    const {email,password} = req.body

    if(!email || !password){
        return res.status(422).send({error :"must provide email or password"})
    }
    const user = await User.findOne({email})
    if(!user){
        return res.status(422).send({error :"must provide email or password"})
    } else {
      await user.comparePassword(password); 
      localStorage.setItem('am', 'yes');
      const token = jwt.sign({userId:user._id},jwtkey);
      res.send({token});

    }
})

/*-------------------------------------------------------------bch tmodifi user --------------------------------------*/

  router.put('/list/user/:email', function (req, res, next) {
    // fetch user
    User.findOne({"email": req.params.email}, function(err, post) {
        if (err) return next(err);

        _.assign(post, req.body); // update user
        if(post != null) {
        post.save(function(err) {
            if (err) return next(err);
            return res.json(200, post);
        })}
        else {
          console.log("thabet");
          return next(err);
        }
    });
});

module.exports = router
