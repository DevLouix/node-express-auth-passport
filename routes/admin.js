const express = require('express');
const { isAuth, isAdmin } = require('../controller/user.controller');
const router = express.Router();

router.get('/', isAuth, isAdmin, (req, res, next)=>{
    res.send('admin page');
})

module.exports = router