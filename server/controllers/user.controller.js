const User = require("../models/user.model");
const PrimarySchool = require("../models/primary-school.model");
const bcrypt = require('bcrypt');
const saltRounds = 10;

exports.userPostFormLogin =  async (req,res) => {
  res.status(200).json({
    user: res.locals.user
  }) 
}

exports.userSignUp = async  (req,res) => {
  const newUser = req.body; 
  await bcrypt.hash(req.body.password, saltRounds,async function(err, hash) {
    try {
      newUser.password = hash;
      new User(newUser).save();
      const userSend = await User.findOne({email:newUser.email})
      res.status(200).json({
          user: userSend
      }) 
    }catch {
      res.status(404).json({
        message : "Error FROM SERVER"
      })
    } 

  });
}
 

exports.UserEditInformation = async (req,res) => {
    try {
      const {id} = req.params;
      const {phoneNumber} = req.body;

    
      if(phoneNumber.length < 8) {
        res.status(404).json({
          message : "Phone Number Wrong! Too Short"
        })
        return;
      }
       await User.findByIdAndUpdate(id,req.body);
       const exitsUser = await User.findById(id)
       res.status(200).json({
        user : exitsUser
      })
    }catch (err) {
      res.status(404).json({
        message : "Wrong ! Not found User"
      })
    }
}
exports.UserEditPriSchool = async (req,res) => {
    try {
      const {id} = req.params;
      await PrimarySchool.findOneAndUpdate({idUser: id}, req.body)
      const primarySchoolUser  =  await PrimarySchool.findOne({idUser:id});
      res.status(200).json({
        priSchool: primarySchoolUser
      })
    } catch (err) {
      res.status(404).json({
        message : "Wrong ! Not found User"
      })
    }
}
exports.UserGetPriSchool = async (req,res) => {
  try {
      const {id} = req.params;
      const informationPri = await PrimarySchool.findOne({idUser : id});
      if(!informationPri)  {
         new PrimarySchool({idUser : id}).save();
      } 
      res.status(200).json({
        priSchool : informationPri
      })
  } catch (err) {
    res.status(404).json({
      message : "Wrong ! Not found User"
    })
  }
}