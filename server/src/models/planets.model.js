const { parse } = require('csv-parse');
const { json } = require('express');
const fs = require('fs');
const path = require('path');

const planets = require('./planets.mongo');

// const habitablePlanets = [];

function isHabitablePlanet(planet) {
    return planet['koi_disposition'] === 'CONFIRMED'
        && planet['koi_insol'] > 0.36 && planet['koi_insol'] < 1.11
        && planet['koi_prad'] < 1.6;
}

function loadPlanetsData() {
    return new Promise((resolve, reject) => {
        fs.createReadStream(path.join(__dirname, '..', '..', 'data', 'kepler_data.csv'))
            .pipe(parse({
                comment: '#',
                columns: true
            }))
            .on('data', async (data) => {
                if (isHabitablePlanet(data)) {
                    // habitablePlanets.push(data);
                    savePlanet(data);
                }
            })
            .on('error', (err) => {
                console.log('error response:', err)
                reject(err)
            })
            .on('end', async () => {
                const countHabitablePlanets = (await getAllPlanets()).length
                console.log(`Amount of habitable planets founds: ${countHabitablePlanets}`)
                resolve();
            })
    })
}

async function savePlanet(planet) {
    try {
        await planets.updateOne({
            keplerName: planet.kepler_name
        }, {
            keplerName: planet.kepler_name
        }, {
            upsert: true
        })
    } catch (err) {
        console.error(`Could not save planet ${err}`)
    }
}

async function getAllPlanets() {
    return await planets.find({}, {
        '_id': 0,
        '__v': 0
    })
}

module.exports = {
    loadPlanetsData,
    getAllPlanets,
}