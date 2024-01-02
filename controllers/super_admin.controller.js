const { pool } = require("../config/database");

async function CreateProject(project_id, project_name) {
    const data = await pool.query("INSERT INTO projects VALUES ($1,$2)", [project_id, project_name]);
    return true;
}

async function CreateProject(project_id, project_name) {
    const data = await pool.query("INSERT INTO projects VALUES ($1,$2)", [project_id, project_name]);
    return true;
}

async function GetAllProjects() {
    const data = await pool.query("SELECT * FROM projects");
    if(data.rowCount == 0)return false;
    return data.rows;
}

async function GetTaskParam(task) {
    const data = await pool.query(`SELECT * FROM ${task}`);
    let header = data.fields;
    console.log(header);
    return header;
}

async function GetAllSites() {
    const data = await pool.query("SELECT * FROM web_control_panel");
    if(data.rowCount == 0)return false;
    return data.rows;
}

async function UpdateSiteSettings(site_name,status,message){
    const data = await pool.query(`UPDATE web_control_panel SET status = '${status}' , message ='${message}' WHERE site_name = ('${site_name}')`);
    // console.log(data.rows);
    // return data.rows; // RETURNS SINGLY THE UPDATED ROW
    const sites = await GetAllSites();
    return sites;
}

async function GetAllStaffs() {
    let data = await pool.query('SELECT userid,email,rank from staffs');
    let fields = data.fields.map(fields =>({name: fields.name}));

    data = data.rows
    // console.log(fields,data);
    return {data, fields};
}

async function UpdateStaff(userid,rank) {
    let data = await pool.query(`UPDATE staffs SET rank = '${rank}' WHERE userid = ('${userid}')`);
    return await GetAllStaffs();
}

module.exports = {
    CreateProject,
    GetAllProjects,
    GetTaskParam,
    GetAllSites,
    GetAllStaffs,
    UpdateStaff,
    UpdateSiteSettings,
}