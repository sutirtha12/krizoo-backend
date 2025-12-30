const model=require("../models/user_schema.js")
const jwt=require('jsonwebtoken')
const hashing=require('bcrypt')


const signup_controller=async (req,res)=>{
    try {
        const {
            username,
            firstname,
            lastname,
            dob,
            phonenumber,
            email,
            role,
            password,
            address
        }=req.body
        const checkdetail=await model.findOne({$or:[{username},{email}]})
        if(checkdetail){
            return res.json({
                status:"failed",
            message:"existing username /email id found"
            })
        }
        const hashpassword=await hashing.hash(password,12)
        const result= await model.create({
            username,
            firstname,
            lastname,
            dob,
            phonenumber,
            email,
            role,
            password:hashpassword,
            address

        })
        const token = jwt.sign(
      {
        userid: checkusername._id,
        username: checkusername.username
      },
      "sutirtha",
      { expiresIn: "10d" }
    );
        if(result){
            res.json({
                status:"sucess",
                data:result,
                token
            })
        }
    } catch (error) {
        res.json({
            status:"failed",
            message:"signup couldnt perfomed try again incorrect details/passowords"
        }).status(404)
    }
}


   const login_controller = async (req, res) => {
  try {
    console.log("LOGIN BODY:", req.body)


    const { username, password } = req.body;

    const checkusername = await model.findOne({ username });
    if (!checkusername) {
      return res.json({
        status: "failed",
        message: "incorrect username"
      });
    }

    const checkpassword = await hashing.compare(
      password,
      checkusername.password
    );
    if (!checkpassword) {
      return res.json({
        status: "failed",
        message: "incorrect password"
      });
    }

    const token = jwt.sign(
      {
        userid: checkusername._id,
        username: checkusername.username
      },
      "sutirtha",
      { expiresIn: "10d" }
    );

    // ✅ SINGLE RESPONSE ONLY
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: "/"
    });


    return res.json({
      status: "success",
      data: checkusername,
      token
    });

  } catch (error) {
    return res.status(500).json({
      status: "failed",
      message: "login failed"
    });
  }
};
    

module.exports={signup_controller,login_controller}