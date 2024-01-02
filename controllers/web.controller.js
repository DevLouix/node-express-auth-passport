const { pool } = require("../config/database");

async function CheckAccess() {    
    const data = await pool.query("SELECT status FROM web_control_panel WHERE site_name = ('workspace.louixani')");

    if(data.rows[0].status == "NOT ACCESSIBLE")return false;
    
    return true;
}

async function GetControlMessage() {
    const data = await pool.query("SELECT message FROM web_control_panel WHERE site_name = 'workspace.louixani'");
    console.log(data.rows[0].message,"message");
    return(data.rows[0].message);
}

async function ServerMode(req, res, next) {
    let mode = await CheckAccess();
    if(mode){
        next();
    }else{
        res.redirect('/redirect/site-state');
    }
}

module.exports = {
    CheckAccess,
    GetControlMessage,
    ServerMode
}