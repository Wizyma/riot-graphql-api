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
 * @param {*} champions_info 
 * @param {*} champions 
 * @param {Array} keys an array containing the name of all the champion 
 * @param {*} toAdd Object that champions will be add to
 */
export function addInfoToChampion(champions_info, champions, keys, toAdd = null) {
    const formated = champions_info.champions.map(champ => {
        const to_return = []
        const id_inserted = []
        for (let i in champions.data) {
            keys.map((k, x) => {
                if(champions.data[k].id === champ.id && !id_inserted.includes(champ.id)){
                    to_return.push({
                        ...champ,
                        championsInfo: champions.data[k]
                    })
                    id_inserted.push(champ.id)
                }
            })
        }

        return to_return[0]
    })

    if (toAdd) {
        const match_with_champ_info = formated.map(champ => {
            return addChampionToMatches(toAdd, champ)
        }).filter(match => match !== undefined)
  
        return {
            formated,
            match_with_champ_info
        }
    }

    return {
        formated
    }
}

export function addChampionToMatches(toAdd, champ) {
    if(toAdd.championId) {
        if (champ.id === toAdd.championId) {
            return {
                ...toAdd,
                champion: champ
            }
        }
    }
    if(toAdd.champion){
        if (champ.id === toAdd.champion) {
            return {
                ...toAdd,
                champion: champ
            }
        }
    }
}

/**
 * * we assume that the function 'addInfoToChampion()' was called before
 * @param {Object} match Object containing info about one specific match 
 * @param {Object} dynamicChamp Object containing an array of champion
 */
export function addInfoChampionToMatchBans(match, dynamicChamp) {
    const match_with_bans = match.teams.map(team => {
        const bans = team.bans
        if(bans.length >= 1){
            const bans_for_team = bans.map(ban => {    
                return dynamicChamp.map(champ => {
                    if (ban.championId === champ.id) {
                        return {
                            ...ban,
                            champion: champ
                        }
                    }
                }).filter(e => e !== undefined)
            }).filter(e => {
                if(e !== undefined){
                    return e[0]
                }
            }).map(e => e[0])

            return {
                ...team,
                bans: bans_for_team
            }
        }
    })

    return match_with_bans
}

/**
 * * we assume that the function 'addInfoToChampion()' was called before
 * @param {Object} match containing info about one specific match
 * @param {Object} dynamicChamp Object containing an array of champion
 */
export function addInfoChampionToMathPlayers(match, dynamicChamp) {
    const match_with_played_champ_info = match.participants.map(participant => {
        return dynamicChamp.map(champ => {
            if (participant.championId === champ.id) {
                return {
                    ...participant,
                    champion: champ
                }
            }
        }).filter(e => e !== undefined)
    }).map(e => e[0])

    return match_with_played_champ_info
}

