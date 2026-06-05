const {UserController}=require('../../controllers');
const express=require('express');
const router=express.Router();
const {AuthMiddlewares}=require('../../middlewares');

router.post('/signup',AuthMiddlewares.validateAuthRequest,UserController.createUser);

router.post('/signin',AuthMiddlewares.validateAuthRequest,UserController.signin);

module.exports=router;