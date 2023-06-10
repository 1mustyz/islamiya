const UploadImage = require("../middlewares/ImageUploader");
const Student = require("../model/studentModel");

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
// posting neew record
module.exports.uploadRecord = async function (req, res) {
  const { file, body } = req;

  let data = {
    fullname: body.fullname,
    nickname: body.nickname,
    yr: body.yr,
    married: body.married,
    phone: body.phone,
    student_id: body.student_id,
  };
  const stdExist = await Student.exists({
    student_id: body.student_id,
  });

  if (!stdExist) {
    if (file) {
      try {
        const { secure_url, public_id } = await cloudinary.uploader.upload(
          file.path,
          opts
        );

        data.imgUrl = secure_url;
        data.public_id = public_id;

        Student.collection.insertOne(data);
        res.status(200).json({
          success: true,
          msg: "Your record has been added successfully",
        });
        // res.status(200).json({ secure_url, public_id });
      } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Error uploading file" });
      }
    }
  } else {
    res.status(500).json({
      error: "This user already exists update or delete",
      success: false,
    });
    return;
  }
};

// updationg exsisting record.
module.exports.updateRecord = async function (req, res) {
  try {
    const { file, body } = req;
    const currentUser = await Student.findById(req.params.id)
      .then((res) => {
        return res;
      })
      .catch((err) => {
        return err;
      });

    let data = {
      fullname: body.fullname,
      nickname: body.nickname,
      yr: body.yr,
      married: body.married,
      phone: body.phone,
      student_id: body.student_id,
    };

    if (file) {
      const imgId = currentUser.public_id;
      if (imgId) {
        await cloudinary.uploader.destroy(imgId);
      }

      const { secure_url, public_id } = await cloudinary.uploader.upload(
        file.path,
        opts
      );

      data.imgUrl = secure_url;
      data.public_id = public_id;

      const userUpdate = await Student.updateOne(
        { _id: req.params.id },
        {
          $set: {
            fullname: data.fullname,
            nickname: data.nickname,
            yr: data.yr,
            married: data.married,
            phone: data.phone,
            public_id: data.public_id,
            imgUrl: data.imgUrl,
          },
        }
      );

      res.status(200).json({
        success: true,
        msg: "Update successfully",
        data: userUpdate,
      });
    } else {
      const userUpdate = await Student.updateOne(
        { _id: req.params.id },
        {
          $set: {
            fullname: data.fullname,
            nickname: data.nickname,
            yr: data.yr,
            married: data.married,
            phone: data.phone,
            // public_id: data.public_id,
            // imgUrl: data.imgUrl,
          },
        }
      );

      res.status(200).json({
        success: true,
        msg: "Update successfully",
        data: userUpdate,
      });
    }
  } catch (error) {
    res.status(500).json({ error: "Error updating record" });
  }

  // try {
  //   const { secure_url, public_id } = await cloudinary.uploader.upload(
  //     file.path,
  //     opts
  //   );

  //   data.imgUrl = secure_url;
  //   data.public_id = public_id;

  //   Student.collection.insertOne(data);
  //   res.json({
  //     success: true,
  //     msg: "Your record has been added successfully",
  //   });
  //   // res.status(200).json({ secure_url, public_id });
  // } catch (error) {
  //   console.log(error);
  //   res.status(500).json({ error: "Error uploading file" });
  // }
};

// delete single student by Id
module.exports.deleteRecord = async function (req, res) {
  const id = req.params.id;
  try {
    await Student.findById(id)
      .then(async (response) => {
        const result = await cloudinary.uploader.destroy(response.public_id);
        if (result) {
          await Student.findByIdAndDelete(id).then((resutlt) => {
            res.json({ success: true, msg: "Record deleted successfully" });
            return;
          });
        } else {
          res
            .status(500)
            .json({ msg: "Image Fail to  delete on cloud storage" });
          return;
        }
      })
      .catch((error) => {
        console.log(error);
      });
  } catch (error) {
    res.status(400).json({ error });
  }
};
// get all student records
module.exports.getAllRecord = async function (req, res) {
  try {
    const all = await Student.find();
    res.status(200).json({ data: all, success: true });
  } catch (error) {
    res.status(400).json({ error, success: false });
  }
};

// get all student record by year of graduation
module.exports.get_all_by_gradyear = async function (req, res) {
  try {
    const all = await Student.find({ yr: req.params.yr });

    res.status(200).json({ data: all });
  } catch (error) {
    res.status(400).json({ error });
  }
};

// delete all record of student
module.exports.delete_all_record = async function (req, res) {
  try {
    const remove = await Student.deleteMany();
    res.status(200).json({ remove, msg: "All student record deleted" });
  } catch (error) {
    res.status(400).json({ error });
  }
};
// delete image file with the public id as a parameter
module.exports.deleteImage = async function (req, res) {
  try {
    const result = await cloudinary.uploader.destroy(req.params.id);
    res
      .status(200)
      .json({ success: true, message: "Image deleted successfully" });
    return result;
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: "Failed to delete image", success: false });
  }
};
