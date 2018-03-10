import fetch from 'node-fetch'
import fs from 'fs'
import path from 'path'
import schedule from 'node-schedule'
import urls from '../riot-url'

// TODO: Get the different static file by language
const languages = [
    "en_US",
    "cs_CZ",
    "de_DE",
    "el_GR",
    "en_AU",
    "en_GB",
    "en_PH",
    "en_SG",
    "es_AR",
    "es_ES",
    "es_MX",
    "fr_FR",
    "hu_HU",
    "id_ID",
    "it_IT",
    "ja_JP",
    "ko_KR",
    "ms_MY",
    "pl_PL",
    "pt_BR",
    "ro_RO",
    "ru_RU",
    "th_TH",
    "tr_TR",
    "vn_VN",
    "zh_CN",
    "zh_MY",
    "zh_TW"
]

// TODO: Get the different static file regions
const regions = ['RU', 'KR', 'BR1', 'OC1', 'JP1', 'NA1', 'EUN1', 'EUW1', 'TR1', 'LA1', 'LA2']
const folders = ['champions', 'items', 'maps', 'masteries']

/**
 * Check if the forlders in static data exists 
 * and create it if not
 */
async function checkFolderExists() {
    const data_path = path.join(process.cwd(), '/static-data')

    folders.map(folder => {
        fs.stat(`${data_path}/${folder}`, (err, stats) => {
            if (err && err.errno === -2) {
                fs.mkdir(`${data_path}/${folder}`, (err) => {
                    if(err) throw err
                    console.log(`> the folder : ${folder} was succesfully created`)
                });
            }
        })
    })   
}

/**
 * Update the dynamic champion json every Thursday
 */
function updateChampions() {
    const rule = new schedule.RecurrenceRule();
    rule.dayOfWeek = 1
    const job = schedule.scheduleJob(rule, async () => {
        console.log('> the update job started.')
        const data_path = path.join(process.cwd(), `/static-data`)

        const res = await fetch(`https://euw1.api.riotgames.com/lol/platform/v3/champions?freeToPlay=false&${process.env.API_KEY}`)
        const data = await res.json()

        fs.writeFile(`${data_path}/champions/champions_dynamic_fr_FR.json`, JSON.stringify(data), (err) => {
            if(err) throw err
            console.log('> The update job updated champions succesfully')
        })
    })
    
}

function getDynamicInfo() {
    const data_path = path.join(process.cwd(), `/static-data`)

    fs.stat(`${data_path}/champions/champions_dynamic_fr_FR.json`, async (err, stats) => {
        if(err && err.errno === -2){
            const res = await fetch(`https://euw1.api.riotgames.com/lol/platform/v3/champions?freeToPlay=false&${process.env.API_KEY}`)
            const data = await res.json()

            fs.writeFile(`${data_path}/champions/champions_dynamic_fr_FR.json`, JSON.stringify(data), (err) => {
                if(err) throw err
                console.log('> The updated champions info was wrote succesfully')
            })
        }
    })
}

/**
 * Get the the static files from the riot api to avoid 
 * doing ton of request on they servers and to no have 
 * the limit rate error because of request spam
 */
function getStaticFiles() {
    checkFolderExists()
    getDynamicInfo()
    updateChampions()

    folders.map(folder => {
        const data_path = path.join(process.cwd(), `/static-data/${folder}`)
        fs.readFile(`${data_path}/${folder}_fr_FR.json`, async (err, data) => {
            const options = {
                api_key: process.env.API_KEY,
                lang: 'fr_FR'
            }
            const url = urls.urls.static[folder](options)
            if(err && err.errno !== -2) throw err
            if (!data) {
                const res = await fetch(url)
                const data = await res.json()
            
                fs.writeFile(`${data_path}/${folder}_fr_FR.json`, JSON.stringify(data), (err) => {
                    if(err) throw err
                    console.log('> file registered')
                })
            }
        })
    })
}

export {
    getStaticFiles
}

