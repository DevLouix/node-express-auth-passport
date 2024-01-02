const express = require('express');
const router = express.Router();
const flash = require('express-flash');
const { notAuth, isAuth } = require('../controllers/user/db_controllers/user.controller');
const { CheckAccess, GetControlMessage, ServerMode } = require('../controllers/web.controller');

router.use(flash());

router.get('/', async(req, res, next)=>{
    const access = await CheckAccess();
    if(access){
        res.redirect('/dashboard')
    }else if(!access){
        let message = await GetControlMessage();
        await req.flash('message',message)
        res.redirect('/redirect/site-state')
    }
});

router.get('/site-state', isAuth, async function(req, res, next) {
    const access = await CheckAccess();
    if (!access){
        let [message] = req.flash('message');
        if(message == undefined){
            let message = await GetControlMessage();
            res.render('web_controls/site-state', { message: message});
        }else{
            res.render('web_controls/site-state', { message: message});
        }
    }else{
        res.redirect('/dashboard')
    }
    
  });


module.exports = router