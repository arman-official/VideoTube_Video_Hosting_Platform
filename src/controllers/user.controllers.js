import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiErrors.js"
import {User} from "../models/user.model.js"
import {ApiResponse} from "../utils/apiResponse.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js";

// not asyncHandler bec ye internally method (not for any web req)
const generateAccessAndRefreshTokens = async(userId)=>{
    try {
        const user= await User.findById(userId)
        const accessToken=await user.generateAccessToken()
        const refreshToken=await user.generateRefreshToken()

        user.refreshToken= refreshToken
        await user.save({validateBeforeSave: false})

        return {accessToken,refreshToken}

    } catch (error) {
        throw new ApiError(500,"Something went wrong in generating Access and Refresh Tokens")
    }
}
 
const registerUser= asyncHandler( async(req,res) => {
    // will take fullName, email, pass,avatar, coverImage, from user
    // store in req.body. ( no)
    // already req.body me aa raha h data
    // validate if any username is already present
    // check for images and avatar
    // upoad in cloudnary, avatar
    // create entry in db(User)
    // remove password & refresh token from responce
    // check for user creation
    // return res



    // load in db

const {fullName, email, username, password } = req.body
    console.log("email:",email)

    // now to check koi field empty toh nahi..

    if([fullName, email, username, password].some((field) => !field || field.trim()==="")){
        throw new ApiError(400, "All fields are required")
    }

    const existedUser = await User.findOne({
        $or: [{username},{email}]
    })
    if(existedUser){
        throw new ApiError(400, "User already exists with this email or username")
    }
    // after adding middleware ,multer added files field in req
    console.log(req.files);


    const avatarLocalPath = req.files?.avatar?.[0]?.path
    // const coverImageLocalPath= req.files?.coverImage?.[0]?.path

    let coverImageLocalPath;
    if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length>0){
        coverImageLocalPath= req.files.coverImage[0]
    }
    // if(!avatarLocalPath){
    //     throw new ApiError(400," Avatar file is req.")
    // }
    // now upload then to cloudinary

    const avatar= await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    // wapass se check karo , avatar(required) upload hua ya ni
    // if(!avatar){
    //     throw new ApiError(400," Avatar file is req.")
    // }

    // now upload in db
    // db se ek insaan hi baat kr raha... User b/c vo mongoose ka model h

    const user = await User.create({
        fullName,
        avatar: avatar?.url || "",
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase(),
    })
    // if(!user){
    //     throw new ApiError()
    // } we have diff way // additionally we can chain more task
    const createdUser = await User.findById(user._id).select("-password -refreshToken")

    if(!createdUser){
        throw new ApiError(500," Something went wrong")
    }

    res.status(201).json(new ApiResponse(200, createdUser, "User registered Successfully"))
})

const loginUser= asyncHandler( async(req,res)=>{
    // we take userName/email and password from user
    // then check pass matches or not (if not ,throw error)
    // if matches send user to dashboard page

    //1. req.body se data lao
    // check if user exist
    // then
    // we take userName/email and password from user
    // then check pass matches or not (if not ,throw error)
    // access and refresh token
    //send cookies

    const {email,username,password}=req.body

    if(!(username || email)){
        throw new ApiError(400,"username or pass req.")
    }
    const existedUser = await User.findOne({
        $or : [{username},{email}] 
    })
    if(!existedUser){
        throw new ApiError(404,"user not found")
    }
    if(!await existedUser.isPasswordCorrect(password)){
        throw new ApiError(404,"Password incorrect")
    }
    const {accessToken,refreshToken}= await generateAccessAndRefreshTokens(existedUser._id)

    const loggedInUser= await User.findById(existedUser._id).select("-password -refreshToken")

    const options= {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",refreshToken,options)
    .json(
        new ApiResponse(
            200,
            {
                existedUser: loggedInUser, accessToken, refreshToken // optional tokens 
            },
            "User logged in Successfully."
        )
    )
})

const logoutUser= asyncHandler( async(req,res)=>{
    await User.findByIdAndUpdate(req.user._id,
        {
            $set:{
                refreshToken: ""
            }
        },
        {
            new: true
        },
    )
    const options= {
        httpOnly: true,
        secure: true
    }
    return res
    .status(200)
    .clearCookie("accessToken",options)
    .clearCookie("refreshToken",options)
    .json(new ApiResponse(200,{},"User Loggedout Successfully!"))

})
export { registerUser, loginUser, logoutUser }
