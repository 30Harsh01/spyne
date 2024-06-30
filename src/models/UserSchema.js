const mongoose=require('mongoose')

const UserSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    mobile:{
            type:String,
            required:true,
            unique:true
    },
    password:{
        type:String,
        required:true,
        minlength:8  //min ength of password must be of 8
    }
})


const UserData=new mongoose.model("UserData",UserSchema)
module.exports=UserData
