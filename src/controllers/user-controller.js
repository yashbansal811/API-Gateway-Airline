const {UserService}=require('../services');
const {SuccessResponse,ErrorResponse}=require('../utils/common')
const {StatusCodes}=require('http-status-codes');

async function createUser(req,res){
    try{
        const user=await UserService.createUser({
        email:req.body.email,
        password:req.body.password
        });
        SuccessResponse.data=user;
        return res.status(StatusCodes.CREATED).json(SuccessResponse);
    }
    catch(error){
        ErrorResponse.error=error;
        return res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json(ErrorResponse);
    }
}

async function signin(req,res){
    try{
        const jwt=await UserService.signin({
            email:req.body.email,
            password:req.body.password
        });
        SuccessResponse.data=jwt;
        return res.status(StatusCodes.OK).json(SuccessResponse);
    }
    catch(error){
        ErrorResponse.error=error;
        return res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json(ErrorResponse);
    }
}

async function addRole(req,res){
    try{
        const response=await UserService.addRoletoUser({
            id:req.body.id,
            role:req.body.role
        });
        SuccessResponse.data=response;
        return res.status(StatusCodes.OK).json(SuccessResponse);
    }
    catch(error){
        ErrorResponse.error=error;
        return res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json(ErrorResponse);
    }
}

module.exports={
    createUser,
    signin,
    addRole
}