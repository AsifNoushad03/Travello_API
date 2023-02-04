const router = require("express").Router();
const User = require('../Models/User')
const CryptoJS = require("crypto-js")
const jwt = require("jsonwebtoken")



// Register
router.post("/register", async (req, res) => {
    const { username, email, password } = req.body
    if (!username || !email || !password) {
        return res.status(400).send('All fields must be filled !');
    }

    const emailExists = await User.findOne({ email: req.body.email });
    if (emailExists) return res.status(400).send('Email already exists');

    const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: CryptoJS.AES.encrypt(req.body.password, process.env.PASS_SEC).toString(),
    })
    try {
        const savedUser = await newUser.save()
        res.status(201).json(savedUser)
        console.log(savedUser)
    } catch (err) {
        res.status(500).json(err);
    }
})

// Login 
router.post("/login", async (req, res) => {
    const { username, password } = req.body
    if (!username || !password) {
        return res.status(400).send('All fields must be filled !');
    }
    try {
        const user = await User.findOne({ username: req.body.username })
        if (!user) {
            res.status(400).json('username is already taken')
        }

        const hashPassword = CryptoJS.AES.decrypt(user.password, process.env.PASS_SEC);

        const Originalpassword = hashPassword.toString(CryptoJS.enc.Utf8)
        Originalpassword !== req.body.password && res.status(401).json("Wrong Password")

        const accesToken = jwt.sign({
            id: user._id,
            isAdmin: user.isAdmin,
        }, process.env.JWT_SEC,
            { expiresIn: "3d" }
        )

        const { password, ...others } = user._doc;
        res.status(200).json({ ...others, accesToken });

    } catch (err) {
        res.status(500).json(err)
    }

})

module.exports = router