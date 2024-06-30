const express = require('express');
const User = require('../src/models/UserSchema');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fetchUser = require('../middleware/fetchUser');
const { body, validationResult } = require('express-validator');
const JWT_SECRET = 'harshwebsite';  // This should be kept secret and ideally stored in environment variables





//create user
router.post('/createuser', [
  body('name', 'Name is required').notEmpty(),  //check for name is empty or not
  body('email', 'Invalid email').isEmail(),     //check weather email is valid or not
  body('password', 'Password must be at least 8 characters long').isLength({ min: 8 }),  //check weather password is havong min length of 8 or not
  body('mobile', 'Enter valid mobile no').isMobilePhone('any'),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { name, password, email, mobile } = req.body;   //require all these things from the body

    let newuser = await User.findOne({ email });      //check if the user already exist with the same email or not as email is our primary key if user exist than simply return user already exist
    if (newuser) {
      return res.status(400).json({ error: "The email already exists" });
    }

    let newuser2 = await User.findOne({ mobile });      //check if the user already exist with the same mobile or not as email is our primary key if user exist than simply return user already exist
    if (newuser2) {
      return res.status(400).json({ error: "The mobile already exists" });
    }

    let secPass = await bcrypt.hash(password, 10);   //concept of securing password using bcryptjs so that in case database is hacked or something still the password wont be accessed
    newuser = await User.create({  //creating the user
      name,
      email,
      password: secPass,
      mobile
    });

    const data = {                        //creating a data object for middleware function
      user: { _id: newuser._id }
    };
    const authtoken = jwt.sign(data, JWT_SECRET);   //signing a JWT token for authenticaiton 
    res.status(201).json({ message: "User created", authtoken });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Internal Server Error');
  }
});


// Update user profile
router.put('/updateuser', [
  body('name').optional().notEmpty().withMessage('Name is required'),
  body('email').optional().isEmail().withMessage('Invalid email'),
  body('password').optional().isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
  body('mobile').optional().isMobilePhone('any').withMessage('Enter valid mobile no')
], fetchUser, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, password, mobile } = req.body;

  try {
    let updateUser = {};
    if (name) updateUser.name = name;
    if (email) updateUser.email = email;
    if (password) updateUser.password = password;
    if (mobile) updateUser.mobile = mobile;

    if(email||password){
      const checkemail=await User.find({email})
      const checkmobile=await User.find({mobile})
      if(checkemail||checkmobile){
        return res.status(400).json({error:"email or mobile alredy exist"})
      }
    }
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updateUser },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(updatedUser);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Internal Server Error');
  }
});


// login
router.post('/login', [
  body('credentials')
    .custom((value, { req }) => {
      if (!value) {
        throw new Error('mobile or email are required');
      }
      if (!/\S+@\S+\.\S+/.test(value) && !/^\+?[1-9]\d{1,14}$/.test(value)) {
        throw new Error('Invalid email or mobile number');
      }
      return true;
    }),
  body('password', 'Password is required').exists()
], async (req, res) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { credentials, password } = req.body;
  try {
    let user;
    if (/\S+@\S+\.\S+/.test(credentials)) {
      user = await User.findOne({ email: credentials });
    } else if (/^\+?[1-9]\d{1,14}$/.test(credentials)) {
      user = await User.findOne({ mobile: credentials });
    }

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const passwordCompare = await bcrypt.compare(password, user.password);  //check the password by decrypting it using same bcryptjs
    if (!passwordCompare) {
      return res.status(400).json({ error: "Incorrect password" });
    }

    const data = {
      user: { _id: user._id }
    };
    const authtoken = jwt.sign(data, JWT_SECRET);   //signing the JWT token
    res.status(200).json({ message: 'Login successful', authtoken });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});








//delete user
router.delete('/deleteuser', fetchUser, async (req, res) => {
  try {
    let user = await User.findById(req.user._id); // Find user by id
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    await User.findByIdAndDelete(req.user._id); // Delete user by id
    res.status(200).json({ success: "User has been deleted" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});




// Get all user details
router.get('/getusers', fetchUser, async (req, res) => {
  try {
    const users = await User.find({ _id: { $ne: req.user._id } }).select("-password");   //we can have the user without selecting the password

    if (users.length === 0) {
      return res.status(404).json({ error: "Users not found" });
    }

    res.status(200).json(users);

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Internal Server Error');
  }
});




//get user by name
router.post('/getuserbyname', fetchUser, async (req, res) => {
  try {
    const {name}=req.body
    const users = await User.find({name}).select("-password");   //we can have the user without selecting the password
    if(!name||name===''){
      return res.status(400).json({error:"Please enter the name"})
    }
    if (users.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(users);

  } catch (error) {
    console.error(err.message);
    res.status(500).send('Internal Server Error');
  }
})







module.exports = router;