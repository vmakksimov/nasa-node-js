
const axios = require('axios');
const launches = require('./launches.mongo')
const planets = require('./planets.mongo')
// Hardcoded data in the comments below (before real API data)
// const launches = new Map()
// let latestFlightNumber = 100;
// const launch = {
//     flightNumber: 100, // flight_number
//     mission: 'Kepler Exploration X', //mission_name
//     rocket: 'Explorer IS1', //rocket.name
//     launchDate: new Date('December 27, 2030'),  //date_local
//     target: 'Kepler-442 b',
//     customer: ['ZTM', 'NASA'],
//     upcoming: true, //upcoming
//     success: true // success
// }

// saveLaunch(launch);
// launches.set(launch.flightNumber, launch);
const SPACEX_API_URL = 'https://api.spacexdata.com/v4/launches/query'
async function populateLaunches() {
    const response = await axios.post(SPACEX_API_URL, {
        query: {},
        options: {
            pagination: false,
            populate: [
                {
                    path: 'rocket',
                    select: {
                        name: 1
                    }
                },
                {
                    path: 'payloads',
                    select: {
                        customers: 1
                    }
                }
            ]
        }
    })

    if (response.status !== 200) {
        console.log('Problem downloading launch data')
        throw new Error('Launch data download failed')
    }

    const launchDocs = response.data.docs;
    for (const launchDoc of launchDocs) {
        const launch = {
            flightNumber: launchDoc.flight_number,
            mission: launchDoc.name,
            rocket: launchDoc.rocket.name,
            launchDate: launchDoc.date_local,
            upcoming: launchDoc.upcoming,
            success: launchDoc.success,
            customers: launchDoc.payloads.flatMap((payload) => {
                return payload.customers
            }),

        }

        console.log(`${launch.flightNumber} ${launch.mission}`)
        await saveLaunch(launch)
    }
}
async function loadLaunchData() {
    const firstLaunch = await findLaunch({
        flightNumber: 1,
        rocket: 'Falcon 1',
        mission: 'FalconSat',
    })

    if (firstLaunch) {
        console.log('Launch data already loaded')
    } else {
        await populateLaunches()
    }

}

async function saveLaunch(launch) {
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
async function getAllLaunches(skip, limit) {
    // return Array.from(launches.values())
    return await launches
        .find({}, { '_id': 0, '__v': 0 })
        .sort({ flightNumber: 1 }) // ascending order
        .skip(skip)
        .limit(limit);
}

async function scheduleNewLaunch(launch) {
    const latestFlight = (await getLatestFlightNumber()) + 1;
    const planet = await planets.findOne({
        keplerName: launch.target
    })
    if (!planet) {
        throw new Error('No matching planet found')
    }
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

async function findLaunch(filter) {
    return await launches.findOne(filter);
}
async function existsLaunchWithId(laundId) {
    // TODO check if launch with laundID exists in mongo DB
    return await findLaunch({
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
    loadLaunchData,
    getAllLaunches,
    scheduleNewLaunch,
    abortLaunchById,
    existsLaunchWithId
}