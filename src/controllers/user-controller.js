const {UserService}=require('../services');
const {SuccessResponse,ErrorResponse}=require('../utils/common')
const {StatusCodes}=require('http-status-codes');

async function createUser(req,res){
    try{
        const response=await UserService.createUser({
        email:req.body.email,
        password:req.body.password
        });
        SuccessResponse.data=response;
        return res.status(StatusCodes.CREATED).json(SuccessResponse);
    }
    catch(error){
        ErrorResponse.error=error;
        return res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json(ErrorResponse);
    }
}
module.exports={
    createUser
}