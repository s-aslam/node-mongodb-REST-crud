const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');
const bcrypt = require('bcryptjs');



//Load the user model
require('../models/User');

const User = mongoose.model('users');

router.get('/login',(req,res)=>{
	res.render('users/login');
});

router.post('/login',(req,res,next)=>{
	passport.authenticate('local',{
		successRedirect:'/ideas',
		failureRedirect:'/users/login',
		failureFlash:true,
	})(req,res,next);
});


router.get('/register',(req,res)=>{
	res.render('users/register');
});

router.post('/register',(req,res)=>{

	let errors = [];

	if(req.body.password != req.body.password2){
		errors.push({text:'Password and confirm password does not matched'});
	}
	if(req.body.password.length < 6){
		errors.push({text:"Password must be six characters or greater"});
	}
	if(errors.length >0){
		res.render('users/register',{
			errors:errors,
			name:req.body.name,
			email:req.body.email,
			password:req.body.password,
			password2:req.body.password2,
		});
	}else{

		const userData = new User({
				name:req.body.name,
				email:req.body.email,
				password:req.body.password,
		});

		//Now encrypt the user password using bcrypt
		bcrypt.genSalt(10,(err,salt)=>{
			if(err) throw err;
			bcrypt.hash(userData.password,salt,(err,hash)=>{
				if(err) throw err;
				userData.password = hash;
			});

			//Now check is user exits with same email before saving in DB
			User.find({email:req.body.email})
			.then(user=>{
				if(typeof user != undefined && user.length > 0){
					console.log(user);
					req.flash('error_msg','User already exists with same email');
					res.render('users/register',{
						name:req.body.name,
						email:req.body.email,
						password:req.body.password,
						password2:req.body.password2,
					});
				}
				else{
					//Now save the user in our DB
					userData.save()
					.then(user=>{
						console.log(user);
						req.flash('success_msg','Your are successfully registered, Now you can login');
						res.redirect('/users/login');
					})
					.catch(err=>{
						console.log(err);
						req.flash('error_msg','Something went wrong!');
						res.redirect('/users/register');
					});//user save end here
				}//else end here
			})
			.catch(err=>{
				console.log(err);
				req.flash('error_msg','Somthing went wrong!');
				res.redirect('/users/register');
			});//user find end here
		})

	}
});


router.get('/logout',(req,res)=>{
	req.logout();
	req.flash('success_msg','Your are logout');
	res.redirect('/users/login');
});

module.exports = router;