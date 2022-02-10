const { Schema, model } = require("mongoose");
const EmpSchema = new Schema(
  {
    emp_name: {
      type: String,
      required: true,
    },
    emp_id: { type: String, required: true },
    emp_sal: { type: Number, required: true },
    emp_edu: { type: String, required: true },
    emp_email: { type: String, required: true },
    emp_phone: { type: Number, required: true },
    emp_photo: {
      type: [""],
      required: true,
      default: [
        "https://cdn-icons.flaticon.com/png/512/1144/premium/1144709.png?token=exp=1643957151~hmac=dc2f9effef5a25bf2ba47acdf68ec33e",
      ],
    },
    emp_location: { type: String, required: true },
    emp_exp: { type: Number, required: true },
    emp_gender: { enum: ["male", "female"], type: String, required: true },
    emp_skills: { type: [""], required: true },
  },
  { timestamps: true }
);
let EmployeeModel = model("employee", EmpSchema);
module.exports = EmployeeModel;
