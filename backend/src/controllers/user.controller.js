import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import { User } from "../models/user.js";
import ApiResponse from "../utils/ApiResponse.js";
import uploadOnCloudinary from "../utils/cloudinary.js";
import path from "path"

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save();
    return { accessToken, refreshToken };
  } catch (error) {
    console.error("token generation error", error);

    throw new ApiError(
      500,
      "something went wrong while generating refresh and access token"
    );
  }
};

// export const registerUser = asyncHandler(async (req, res) => {
//   const { firstname, lastname, email, password, age, gender, about, skills } =
//     req.body;
  
//   if (
//     [firstname, lastname, email, password].some((field) => field?.trim() == "")
//   ) {
//     throw new ApiError(400, "All fields must be requried");
//   }

//   const existingUser = await User.findOne({
//     $or: [{ firstname }, { email }],
//   });

//   if (existingUser) {
//     throw new ApiError(409, "User with email or username already exists");
//   }

//   // const avatarLocalPath = req.files?.avatar[0]?.path;
//   // console.log(
//   //   "Errrrorr in register controller avatar Local file",
//   //   avatarLocalPath
//   // );

//   // if (!avatarLocalPath) {
//   //   throw new ApiError(400, "Avatar file is required");
//   // }

//   // const avatar = await uploadOnCloudinary(avatarLocalPath);

//   const avatarLocalPath = req.files?.avatar?.[0]?.path
//   // console.log("BODY:", req.body);
//   // console.log("FILES:", req.files.avatar[0]?.path);
//   // console.log("FILES:", req.files.path);
//   // console.log("FILE (single) path :", req.file);

// console.log("req.files =", req.files);
// console.log("req.file =", req.file);
// console.log("Avatar local file",avatarLocalPath);

// if (!avatarLocalPath) {
//   throw new ApiError(400, "Avatar file is required");
// }

// // Convert to absolute path for Cloudinary
// const absoluteAvatarPath = path.resolve(avatarLocalPath);

// const avatar = await uploadOnCloudinary(absoluteAvatarPath);
//   if (!avatar) {
//     throw new ApiError(400, "Avatar file required");
//   }

//   const user = await User.create({
//     firstname: firstname.toLowerCase(),
//     lastname,
//     avatar: avatar.url,
//     email,
//     password,
//   });

//   const createdUser = await User.findById(user._id).select(
//     "-password -refreshToken"
//   );

//   if (!createdUser) {
//     throw new ApiError(400, "something went wrong while creating user");
//   }

//   return res
//     .status(201)
//     .json(new ApiResponse(200, createdUser, "User created successfully"));
// });

export const registerUser = asyncHandler(async (req, res) => {
  const { firstname, lastname, email, password, age, gender, about, skills } =
    req.body;

  if ([firstname, lastname, email, password].some(f => !f || f.trim() === "")) {
    throw new ApiError(400, "All fields must be required");
  }

  const existingUser = await User.findOne({
    $or: [{ firstname }, { email }],
  });

  if (existingUser) {
    throw new ApiError(409, "User with email or username already exists");
  }

  console.log("req.files =", req.files);

  // ✔ Your final correct multer path
  const avatarLocalPath = req.files?.avatar?.[0]?.path;

  console.log("Avatar path:", avatarLocalPath);

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required");
  }

  const absoluteAvatarPath = path.resolve(avatarLocalPath);

  const avatar = await uploadOnCloudinary(absoluteAvatarPath);

  if (!avatar) {
    throw new ApiError(400, "Avatar upload failed");
  }

  const user = await User.create({
    firstname: firstname.toLowerCase(),
    lastname,
    avatar: avatar.url,
    email,
    password,
    age,
    gender,
    about,
    skills: skills?.split(",").map(s => s.trim()),
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User created successfully"));
});

export const loginUser = asyncHandler(async (req, res) => {
  const { email, password, firstname } = req.body;

  if (!email || !password || !firstname) {
    throw new ApiError(400, "email or password is required");
  }

  const user = await User.findOne({
    $or: [{ email }, { firstname }],
  });

  if (!user) {
    throw new ApiError(404, "user does not exist");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user credentials");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User logged in successfully"
      )
    );
});

export const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: {
        refreshToken: 1,
      },
    },
    { new: true }
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", options)
    .cookie("refreshToken", options)
    .json(new ApiResponse(200,{},"User logout successfully"))
});

export const changeCurrentPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  const user = await User.findById(req.user?._id);

  const passwordCorrect = await user.isPasswordCorrect(oldPassword);

  if (!passwordCorrect) {
    throw new ApiError(400, "Invalid Old password");
  }

  user.password = newPassword;

  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password changed successfully"));
});

export const currentUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "current user fetched successfully"));
});

export const updateAccountDetails = asyncHandler(async (req, res) => {
  const { firstname, lastname, email, age, gender, about, skills } = req.body;

  if (!firstname || !lastname || !email) {
    throw new ApiError(400, "All fields are required");
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        firstname: firstname,
        lastname: lastname,
        email: email,
        age: age,
        gender: gender,
        about: about,
        skills: skills,
      },
    },
    { new: true }
  ).select("-password");
  return res
    .status(200)
    .json(new ApiResponse(200, user, "Account details update successfully"));
});

export const updateUserAvatar = asyncHandler(async (req, res) => {
  const avatarLocalPath = req.files?.path;

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is missing");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);

  if (!avatar.url) {
    throw new ApiError(400, "Error while uploading an avatar");
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        avatar: avatar.url,
      },
    },
    { new: true }
  ).select("-password");
  return res
    .status(200)
    .json(new ApiResponse(200, user, "Avatar updated successfully"));
});
