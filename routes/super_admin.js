var express = require('express');
const { GetAllSites, UpdateSiteSettings, GetAllStaffs, UpdateStaff, CreateProject, GetAllProjects, GetTaskParam } = require('../controller/super_admin.controller');
const { isAuth, isAdmin, isSuperAdmin } = require('../controller/user.controller');
const { ServerMode } = require('../controller/web.controller');
var router = express.Router();

/* GET users listing. */
router.get('/', isAuth, isSuperAdmin, function(req, res, next) {
    res.render('administrators/super_admin')
});

// ROUTER FOR PROJECTS GET PAGE GETTING THE PROJECTS
router.get('/projects', isAuth, isSuperAdmin, async function(req, res, next) {
    let projects = await GetAllProjects();
    console.log(projects);
    res.render('administrators/super_admin/__super_admin_projects', {projects:projects})
});

router.get('/project/:project_id', isAuth, isSuperAdmin, async function(req, res, next) {
    let id = req.params.project_id
    let characters_params = await GetTaskParam("characters_tasks");
    let _3d_params = await GetTaskParam("modelling_and_animation_tasks");
    res.render('administrators/super_admin/super_admin_projects', {title: id, _3d_params: _3d_params, char_params: characters_params})
});

// ROUTER FOR PROJECT FORM POSTING
router.post('/projects', isAuth, isSuperAdmin, async(req, res, next)=>{
    let project_id = req.body.project_id;
    let project_name = req.body.project_name;

    let inserted = await CreateProject(project_id, project_name);
    if(inserted){
        projects = await GetAllProjects();
    }
    res.render('administrators/super_admin/super_admin_projects', {projects:projects})
});

router.get('/sites', isAuth, isSuperAdmin, async function(req, res, next) {
    let sites = await GetAllSites();
    console.log(sites);
    res.render('administrators/super_admin/sites', {sites:sites})
});

router.post('/sites', isAuth, isSuperAdmin, async function(req, res, next) {
    let site_name = req.body.site_name;
    let status = req.body.site_status;
    let message = req.body.message;

    let sites = await UpdateSiteSettings(site_name,status,message);
    console.log(site_name);
    res.render('administrators/super_admin/sites', {sites:sites})
});

router.get('/staffs', isAuth, isSuperAdmin, async(req, res, next)=>{
    let staffs = await GetAllStaffs();
    // console.log(staffs);
    header = staffs.fields;
    staffs = staffs.data;
    // console.log(header);
    res.render('administrators/super_admin/staffs', {staffs:staffs,header: header, })
});

router.post('/staffs', isAuth, isSuperAdmin, async(req, res, next)=>{
    let userid = req.body.userid;
    let rank = req.body.rank;

    let staffs = await UpdateStaff(userid, rank);
    header = staffs.fields;
    staffs = staffs.data;
    res.render('administrators/super_admin/staffs', {staffs:staffs,header: header, })
});

module.exports = router;
