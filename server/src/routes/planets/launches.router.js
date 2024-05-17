const express = require('express');
const { httpGetAllLaunches, httpAddNewLaunch, httpDeletelaunch } = require('./launches.controller');
const launchesRouter = express.Router();


launchesRouter.get('/', httpGetAllLaunches);
launchesRouter.post('/', httpAddNewLaunch);
launchesRouter.delete('/:id', httpDeletelaunch);
module.exports = launchesRouter;