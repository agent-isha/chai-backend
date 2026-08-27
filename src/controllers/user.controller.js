import {asynchandler} from "../utils/asynchandler.js"
import {Apierror} from "../utils/Apierror.js"
import {User} from "../models/user.model.js"
import {uploadCloudinary} from "../utils/cloudinary.js"
import {Apiresponse} from "../utils/Apiresponse.js";
const registerUser=asynchandler(async(req,res,next)=>{
    //get user details from frontend
    //validation-not empty
    //check if user already exist:username,email
    //check for images ,check for avatar
    //upload them to cloudinary,avatar
    //create user object-create entry in db
    //remove p-assword and refresh token feild from response
    //check for user creation
    //return res


    const{fullName,email,username,password}=req.body
    console.log("email",email);
    if(
        [fullName,email,username,password].some((field)=>field?.trim()=="")
    ){
        throw new Apierror(400,"all fields are required")
    }
    const existedUser=User.findOne({
        $or:[ {username},{email}]
    })
    if(existedUser){
        throw new Apierror(409,"user with email or username already exists")
    }
    const avatarLocalPath=req.files?.avatar[0]?.path;
    const coverImageLocalPath=req.files?.coverImage[0]?.path;
    if(!avatarLocalpath){
        throw new Apierror(400,"avatar is required");
    }
    const avatar=await uploadCloudinary(avatarLocalPath)
    const coverImage=await uploadCloudinary(coverImageLocalPath)
    if(!avatar){
        throw new Apierror(400,"Avatar file is required");
    }
    const user=await User.create({
        fullName,
        avatar:avatar.url,
        coverImage:coverImage?.url||"",
        email,
        password,
        username:username.toLowerCase()
    })
    const createdUser=await User.findById(user._id).select(
        "-password -refreshToken"
    )
    if(!createdUser){
        throw new Apierror(400,"avatar file is required")
    }
    return res.status(201).json(
        new Apiresponse(200,createdUser,"user registered successfully")
    )

    res.status(200).json({
        message: "User registration working"
    });



});
export {registerUser};