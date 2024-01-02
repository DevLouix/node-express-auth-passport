const bcrypt = require('bcryptjs');
const User = require('../../../models/user.model');

// CHECKING IF USER EXISTS
async function CheckUserid (username){
    let user_exists = await User.findOne({ name: username});

    if(user_exists){return false}
    
    return true;
}

async function CheckEmail(email) {
    let email_exists = await User.findOne({ name: email});

    if(email_exists){return false}
    
    return true;
}

async function InsertNewUser(user_data) {
    const user = await User.create(user_data);
    await user.save();
    console.log(user)
}

// HASHING PASSWORD FOR USER
async function matchPassword(password,hashedPassword){
    try {
        // password = await bcrypt.hash(password, 10);
        // console.log('inside try, received pass');
        // console.log(password,hashedPassword);
        const match = await bcrypt.compare(password,hashedPassword);
        console.log(match);
        return match;
    } catch (e) {
        console.log(e);
    }
}

function isAuth(req, res, next) {
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/');
}

function isAdmin(req, res, next) {
    if(req.isAuthenticated()){
        if (req.user.rank == "Admin" || req.user.rank == "admin" || req.user.rank == "ADMIN") {
            console.log(req.user.rank,"inside auth");
            return next();            
        }else{
            res.redirect('/dashboard');
        }
    }else{
        res.redirect('/');
    }
}

function isSuperAdmin(req, res, next) {
    if(req.isAuthenticated()){
        if (req.user.rank == "SuperAdmin" || req.user.rank == "Super_Admin" || req.user.rank == "super_admin") {
            console.log(req.user.rank,"inside auth");
            return next();            
        }else{
            res.redirect('/dashboard');
        }
    }else{
        res.redirect('/');
    }
}

function notAuth(req, res, next) {
    if(req.isAuthenticated()){
      res.redirect('/dashboard');
    }
    next();
}

module.exports = {
    CheckUserid,
    CheckEmail,
    InsertNewUser,
    matchPassword,
    isAuth,
    isAdmin,
    isSuperAdmin,
    notAuth
}