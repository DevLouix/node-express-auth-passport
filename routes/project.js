const express = require('express');
const { GetProjectsById } = require('../controller/projects.controller');
const { isAuth } = require('../controller/user.controller');
const router = express.Router();

/* GET users listing. */
router.get('/:project_id', isAuth, async function (req, res, next) {
    const id = req.params.project_id;
    let project = await GetProjectsById(id);
    let title = project[0].project_name

    res.render('projects', { user: req.user, title: title, project: project[0],});
});

module.exports = router;
