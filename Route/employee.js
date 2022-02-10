const { Router } = require("express");
const router = Router();
const multer = require("multer");
const EmpSchema = require("../Model/Employees");
const { ensureAuthenticated } = require("../helper/auth_helper");

//? load multer middelware
let { storage } = require("../middelware/multer");
const upload = multer({ storage: storage });

//?============start of GET METHODS=====================
/*@ GET METHOD**********
@ACCESS PUBLIC
@URL employee/home */
router.get("/home", async (req, res) => {
  let payload = await EmpSchema.find({}).lean();
  res.render("../views/home", { payload });
});

/*@ GET METHOD**********
@ACCESS Private
@URL employee/create-emp */
router.get("/create-emp", ensureAuthenticated, (req, res) => {
  res.render("../views/employees/create-emp", { title: "home page" });
});

/* http GET METHOD**********
@ACCESS PUBLIC
@URL employee/emp-profile */

router.get("/:id", async (req, res) => {
  let payload = await EmpSchema.findOne({ _id: req.params.id }).lean();
  res.render("../views/employees/employeeProfile", { payload });
});

/* http GET METHOD**********
@ACCESS Private
@URL employee/edit-emp */
router.get("/edit-emp/:id", ensureAuthenticated, async (req, res) => {
  let editPayload = await EmpSchema.findOne({ _id: req.params.id }).lean();
  res.render("../views/employees/editEmp", { editPayload });
});

//?============End of GET METHODS=====================

//?============Start of POST METHODS=====================

/*@ POST METHOD**********
@ACCESS PRIVATE
@URL employee/create-emp */
router.post("/create-emp", upload.single("emp_photo"), async (req, res) => {
  // console.log(req.body);
  // console.log(req.file);
  // res.send("ok");

  let payload = {
    emp_name: req.body.emp_name,
    emp_id: req.body.emp_id,
    emp_gender: req.body.emp_gender,
    emp_sal: req.body.emp_sal,
    emp_edu: req.body.emp_edu,
    emp_email: req.body.emp_email,
    emp_phone: req.body.emp_phone,
    emp_photo: req.file,
    emp_location: req.body.emp_location,
    emp_exp: req.body.emp_exp,
    emp_skills: req.body.emp_skills,
  };
  await EmpSchema.create(payload);
  req.flash("SUCCESS_MESSAGE", "This is a Message");
  res.redirect("/employee/home", 302, {});
});

//?============end of POST METHODS=====================

//?============Start of PUT METHODS=====================
router.put("/edit-emp/:id", upload.single("emp_photo"), (req, res) => {
  EmpSchema.findOne({ _id: req.params.id }).then(editEmp => {
    (editEmp.emp_photo = req.file),
      (editEmp.emp_id = req.body.emp_id),
      (editEmp.emp_name = req.body.emp_name),
      (editEmp.emp_sal = req.body.emp_sal),
      (editEmp.emp_edu = req.body.emp_edu),
      (editEmp.emp_exp = req.body.emp_exp),
      (editEmp.emp_email = req.body.emp_email),
      (editEmp.emp_phone = req.body.emp_phone),
      (editEmp.emp_gender = req.body.emp_gender),
      (editEmp.emp_skills = req.body.emp_skills),
      (editEmp.emp_location = req.body.emp_location),
      //?update data in database
      editEmp
        .save()
        .then(_ => {
          req.flash("SUCCESS_MESSAGE", "This is a edited message");
          res.redirect("/employee/home", 302, {});
        })
        .catch(err => {
          console.log(err);
        });
  });
});
//?============ends of PUT METHODS=====================

//?============Start of delete METHODS=====================
router.delete("/delete-emp/:id", async (req, res) => {
  await EmpSchema.deleteOne({ _id: req.params.id });
  req.flash("SUCCESS_MESSAGE", "This is a deleted message");
  res.redirect("/employee/home", 302, {});
});
//?============end of delete METHODS=====================

module.exports = router;
