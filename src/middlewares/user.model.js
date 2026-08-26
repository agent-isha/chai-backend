import mongoose,{schema} from "mongoose";
import Jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
const userSchema=new Schema({
    username:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
        index:true
    },
    email:{
        type:string,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
        
    },
    fullname:{
        type:string,
        required:true,
        trim:true,
        index:true
    },
    avatar:{
        type:string,
        required:true,
    },
    coverImage:{
        type:string,
    },
    watchHistory:{
        type:Schema.Types.ObjectId,
        ref:"Video"
    },
    password:{
        type:string,
        required:[true,"password is required"]

    },
    refreshToken:{
        types:string
    }
},
{
    timestamps:true
})
userSchema.pre("save",async function(next){
    if(!this.isModified("password")) return next();
    this .password= bcrypt.hash(this.password,10)
    next()
})
userSchema.methods.isPasswordCorrect=async function (password){
    return await bcrypt.compare(password,this.password)
}
userSchema.methods.generateAccessToken=function(){
    return Jwt.sign({
        id:this._id,
        email:this.email,
        username:this.username,
        fullname:this.fullname
    },process.env.ACCESS_TOKEN_SECRET,{expiresIn:process.env.ACCESS_TOKEN_EXPIRY})
}
userSchema.methods.generateRefreshToken=function(){
    return Jwt.sign({
        id:this._id,
        
    },process.env.REFRESH_TOKEN_SECRET,{expiresIn:process.env.REFRESH_TOKEN_EXPIRY})

}

export const user=mongoose.model("User",userSchema)