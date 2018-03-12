import path from 'path'

export function formatChampion(dynamic = false) {
    const paths = {
        champions: path.resolve(path.join(process.cwd(), './static-data/champions/champions_fr_FR.json')),
        dynamic: path.resolve(path.join(process.cwd(), './static-data/champions/champions_dynamic_fr_FR.json')),
    }

    if(dynamic) {
        return Object.assign({}, require(paths.dynamic))
    }

    const champions =  Object.assign({}, require(paths.champions))
    const keys = Object.values(champions.keys)

    // delete useless info from the object
    delete champions.keys
    delete champions.format
    delete champions.type
    delete champions.version

    return {
        keys,
        champions
    }
}

/**
 * * if match is provided, it will add the champion info to the match automatically
 * @param {*} dynamicChamp 
 * @param {*} champions 
 * @param {Array} keys an array containing the name of all the champion 
 * @param {*} match Object containing info about the match
 */
export function addInfoToChampion(dynamicChamp, champions, keys, match = null) {
    dynamicChamp.champions.map(champ => {
        for (let i in champions.data) {
            keys.forEach(k => {
                if(champions.data[k].id === champ.id){
                    champ.championsInfo = champions.data[k]
                }
            })
        }

        if (match) {
            addChampionToMatches(match, champ)
        }
    })
}

export function addChampionToMatches(match, champ) {
    if (champ.id === match.champion) {
        match.champion = champ
    }
}

/**
 * * we assume that the function 'addInfoToChampion()' was called before
 * @param {Object} match Object containing info about one specific match 
 * @param {Object} dynamicChamp Object containing an array of champion
 */
export function addInfoChampionToMatchBans(match, dynamicChamp) {
    match.teams.map(team => team.bans).map(bans => {
        if(bans.length >= 1){
            bans.map(ban => {    
                dynamicChamp.champions.map(champ => {
                    if (ban.championId === champ.id) {
                        ban.champion = champ
                    }
                })
            })
        }
    })
}

/**
 * * we assume that the function 'addInfoToChampion()' was called before
 * @param {Object} match containing info about one specific match
 * @param {Object} dynamicChamp Object containing an array of champion
 */
export function addInfoChampionToMathPlayers(match, dynamicChamp) {
    match.participants.map(participant => {
        dynamicChamp.champions.map(champ => {
            if (participant.championId === champ.id) {
                participant.champion = champ
            }
        })
    })
}

