
const launches = new Map();

let latestFlightNumber = 100;

const launch = {
    flightNumber: 100,
    mission: 'Kepler Exploration X',
    rocket: 'Explorer IS1',
    launchDate: new Date('December 27, 2030'),
    target: 'Kepler-442 b',
    customer: ['ZTM', 'NASA'],
    upcoming: true,
    success: true
}


launches.set(launch.flightNumber, launch);

/**
 * Retrieves all launches from the launches map.
 *
 * @return {Array} An array of all launches
 */
function getAllLaunches() {
    return Array.from(launches.values())
}

function addNewLaunch(launch) {
    latestFlightNumber++;
    launches.set(
        latestFlightNumber,
        {
            ...launch,
            flightNumber: latestFlightNumber,
            upcoming: true,
            customers: ['ZTM', 'NASA'],
            success: true
        });
}
function existsLaunchWithId(laundId){
    return launches.has(laundId);
}
function aborted(id) {
    if (!launches.has(id)) {
        launches.delete(id);
        return true;
    } else {
        return false;
    }
}

module.exports = {
    getAllLaunches,
    addNewLaunch,
    aborted,
    existsLaunchWithId
}