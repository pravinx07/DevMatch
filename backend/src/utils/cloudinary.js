import {v2 as cloudinary} from "cloudinary"
import fs from "fs"

cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process
    .env.CLOUDINARY_API_SECRET
})
// console.log();

// const uploadOnCloudinary = async(localfilePath) => {
//     try {
//         if(!localfilePath) return null;

//         const response = await cloudinary.uploader.upload(localfilePath,{
//             resource_type:"auto"
//         })
//         console.log("Avatar file is in cloudinary middleware");
        
//          console.log("file uploaded on cloudinary; ", response.url);
         
//         // fs.unlinkSync(localfilePath)
//         return response
//     } catch (error) {
//         fs.unlinkSync(localfilePath)
//         return null
//     }
// }


const uploadOnCloudinary = async (localfilePath) => {
  try {
    if (!localfilePath) return null;

    const response = await cloudinary.uploader.upload(localfilePath, {
      resource_type: "auto",
      folder: "avatars"
    });

    console.log("Uploaded to cloudinary:", response.url);

    // remove local file
    fs.unlinkSync(localfilePath);

    return response;
  } catch (error) {
    console.log("Cloudinary error:", error.message);
    if (fs.existsSync(localfilePath)) fs.unlinkSync(localfilePath);
    return null;
  }
};


export default uploadOnCloudinary