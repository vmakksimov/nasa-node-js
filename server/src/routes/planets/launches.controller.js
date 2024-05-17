const { getAllLaunches, addNewLaunch, aborted, existsLaunchWithId } = require('../../models/launches.model');

/**
 * Retrieves all launches from the system and returns them in JSON format with status 200.
 *
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @return {Object} An array of all launches in JSON format with status 200
 */
function httpGetAllLaunches(req, res) {
    return res.status(200).json(getAllLaunches());
}

/**
 * Adds a new launch to the system based on the request body.
 *
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @return {Object} The newly added launch in JSON format with status 201
 */
function httpAddNewLaunch(req, res) {
    const launch = req.body;
    if (!launch.mission || !launch.rocket || !launch.launchDate || !launch.target){
        return res.status(400).json({error: 'Missing required fileds!'});
    }
    launch.launchDate = new Date(launch.launchDate);
    if (isNaN(launch.launchDate)){
        return res.status(400).json({error: 'Invalid launch date!'});
    }
    addNewLaunch(launch);
    return res.status(201).json(launch);
}

function httpDeletelaunch(req, res) {
    const launchId = req.params.id
    aborted(launchId);
    if(existsLaunchWithId(launchId)){
        return res.status(201).json(aborted);
    }else{
        return res.status(404).json({error: 'Launch not found!'});
    }

}


module.exports = {
    httpGetAllLaunches,
    httpAddNewLaunch,
    httpDeletelaunch,
}