
const launches = require('./launches.mongo')
const planets = require('./planets.mongo')

// const launches = new Map()

// let latestFlightNumber = 100;

// const launch = {
//     flightNumber: 100,
//     mission: 'Kepler Exploration X',
//     rocket: 'Explorer IS1',
//     launchDate: new Date('December 27, 2030'),
//     target: 'Kepler-442 b',
//     customer: ['ZTM', 'NASA'],
//     upcoming: true,
//     success: true
// }

// saveLaunch(launch);


// launches.set(launch.flightNumber, launch);

async function saveLaunch(launch) {
    const planet = await planets.findOne({
        keplerName: launch.target
    })
    if (!planet) {
        throw new Error('No matching planet found')
    }
    await launches.findOneAndUpdate({
        flightNumber: launch.flightNumber
    },
        launch,
        {
            upsert: true
        })
}

async function getLatestFlightNumber() {
    const latestLaunch = await launches
        .findOne()
        .sort('-flightNumber')

    if (!latestLaunch) {
        return 100;
    }
    return latestLaunch.flightNumber
}

/**
 * Retrieves all launches from the launches map.
 *
 * @return {Array} An array of all launches
 */
async function getAllLaunches() {
    // return Array.from(launches.values())
    return await launches.find({}, { '_id': 0, '__v': 0 })
}

async function scheduleNewLaunch(launch) {
    const latestFlight = (await getLatestFlightNumber()) + 1;
    await saveLaunch({
        ...launch,
        success: true,
        upcoming: true,
        customers: ['ZTM', 'NASA'],
        flightNumber: latestFlight
    });
}

// With MAP
// function addNewLaunch(launch) {
//     latestFlightNumber++;
//     launches.set(
//         latestFlightNumber,
//         {
//             ...launch,
//             flightNumber: latestFlightNumber,
//             upcoming: true,
//             customers: ['ZTM', 'NASA'],
//             success: true
//         });
// }
async function existsLaunchWithId(laundId) {
    // TODO check if launch with laundID exists in mongo DB
    return await launches.findOne({
        flightNumber: laundId
    })
    // return launches.has(laundId);
}
async function abortLaunchById(id) {

    const aborted = await launches.updateOne({
        flightNumber: id
    }, {
        upcoming: false,
        success: false
    })
    // aborted.upcoming = false;
    // aborted.success = false;

    return aborted.acknowledged && aborted.modifiedCount === 1;


}

module.exports = {
    getAllLaunches,
    scheduleNewLaunch,
    abortLaunchById,
    existsLaunchWithId
}