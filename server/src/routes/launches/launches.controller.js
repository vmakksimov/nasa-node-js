const {
    getAllLaunches,
    addNewLaunch,
    scheduleNewLaunch,
    abortLaunchById,
    existsLaunchWithId
} = require('../../models/launches.model');

const { getPagination } = require('../../services/query');

/**
 * Retrieves all launches from the system and returns them in JSON format with status 200.
 *
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @return {Object} An array of all launches in JSON format with status 200
 */
async function httpGetAllLaunches(req, res) {
    const { skip, limit } = getPagination(req.query);
    const launches = await getAllLaunches(skip, limit);
    return res.status(200).json(launches);
}

/**
 * Adds a new launch to the system based on the request body.
 *
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @return {Object} The newly added launch in JSON format with status 201
 */
async function httpAddNewLaunch(req, res) {
    const launch = req.body;
    if (!launch.mission || !launch.rocket || !launch.launchDate || !launch.target) {
        return res.status(400).json({ error: 'Missing required fileds!' });
    }
    launch.launchDate = new Date(launch.launchDate);
    if (isNaN(launch.launchDate)) {
        return res.status(400).json({ error: 'Invalid launch date!' });
    }
    // addNewLaunch(launch);
    await scheduleNewLaunch(launch);
    console.log("launchhh", launch)
    return res.status(201).json(launch);
}

async function httpDeletelaunch(req, res) {
    const launchId = Number(req.params.id)
    const existsLaunch = await existsLaunchWithId(launchId);
    if (!existsLaunch) {
        return res.status(404).json({ error: 'Launch not found!' });
    }

    const aborted = await abortLaunchById(launchId);
    if (!aborted) {
        return res.status(400).json({ error: 'Launch not aborted!' });
    }
    return res.status(201).json({ aborted: true });

}


module.exports = {
    httpGetAllLaunches,
    httpAddNewLaunch,
    httpDeletelaunch,
}