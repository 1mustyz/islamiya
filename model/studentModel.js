const { boolean } = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const StudentSchema = Schema(
  {
    fullname: { type: String },
    nickname: { type: String },
    yr: { type: String },
    married: { type: Boolean },
    phone: { type: String },
    student_id: { type: String },
    imgUrl: { type: String },
    public_id: { type: String },
  },
  { timestamps: true }
);

const student = mongoose.model("Student", StudentSchema);
module.exports = student;
