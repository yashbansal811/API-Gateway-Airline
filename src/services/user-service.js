const {UserRepository} = require('../repositories');
const{AppError}=require('../utils');
const userRepository=new UserRepository();
const {StatusCodes}=require('http-status-codes');
const{Auth}=require('../utils/common');

async function createUser(data){
    try{
        const user=await userRepository.create(data);
        return user;
    }
    catch(error){
        if(error.name === 'SequelizeUniqueConstraintError'){
            throw new AppError('Email is already in use',StatusCodes.CONFLICT);
        }
        if(error.name === 'SequelizeValidationError'){
            let explanation=[];
            error.errors.forEach((err)=>{
                explanation.push(err.message);
            });
            console.log(explanation);
            throw new AppError(explanation,StatusCodes.BAD_REQUEST);
        }
        throw new AppError('Cannot create a user',StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function signin(data){
    try{
        const user=await userRepository.getUserByEmail(data.email);
        if(!user){
            throw new AppError('User does not exists',StatusCodes.NOT_FOUND);
        }
        const passwordMatch = Auth.checkPassword(data.password,user.password);
        if(!passwordMatch){
            throw new AppError('Invalid password',StatusCodes.BAD_REQUEST);
        }
        const jwt=Auth.createToken({id:user.id,email:user.email});
        return jwt;
    }
    catch(error){
        if(error instanceof AppError){
            throw error;
        }
        throw new AppError('Something went wrong',StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function isAuthenticated(token){
    try{
        if(!token){
            throw new AppError('Missing JWT Token',StatusCodes.BAD_REQUEST);
        }
        const response=Auth.verifyToken(token);
        const user=await userRepository.get(response.id);
        if(!user){
            throw new AppError('User not found',StatusCodes.NOT_FOUND);
        }
        return user.id;
    }
    catch(error){
        if(error instanceof AppError){
            throw error;
        }
        if(error.name == 'JsonWebTokenError'){
            throw new AppError('Invalid JWT Error',StatusCodes.BAD_REQUEST);
        }
        throw new AppError('Something went wrong',StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

module.exports={
    createUser,
    signin,
    isAuthenticated
}
