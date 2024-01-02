const { pool } = require("../config/database");


async function GetProjects() {
    const data = await pool.query("SELECT * FROM projects");
    if(data.rowCount == 0)return false;
    return data.rows;
}

async function GetProjectsById(id) {
    const data = await pool.query(`SELECT * FROM projects WHERE project_id = '${id}'`);
    if(data.rowCount == 0)return false;
    return data.rows;
}

module.exports = {
    GetProjects,
    GetProjectsById
}