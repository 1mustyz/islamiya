const cloudinary = require("cloudinary").v2;

// cloudinary configuration for saving files
cloudinary.config({
  cloud_name: 'drwxitp8n',
  api_key: '325286914776221',
  api_secret: 'KxD1nlzIbZGVZWLIrmZNVN41rrs',
});
const opts = {
  // overwrite: true,
  // invalidate: true,
  resource_type: "auto",
  transformation: [{ width: 500, height: 500, crop: "limit" }],
  allowed_formats: ["jpg", "png"],
  max_file_size: 2000000, // Limit to 2 MB
};

module.exports = (image) => {
  //imgage = > base64
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(image, opts, (error, result) => {
      if (result && result.secure_url) {
        return resolve(result);
      }
      console.log(error.message);
      return reject({ message: error.message });
    });
  });
};
