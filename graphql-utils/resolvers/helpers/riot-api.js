import fetch from 'node-fetch'
import { formatChampion, addInfoToChampion, addInfoChampionToMatchBans, addInfoChampionToMathPlayers } from './utils'

function getUrl (BASE_URL, RELATIVE_PATH) {
    return `${BASE_URL}/${RELATIVE_PATH}`
}

async function fetchData (url) {
    const res = await fetch(url)
                    .catch(err => {
                        throw err
                    })
    return await res.json()
}

async function formatMatchWithChampionInfo(match_list, key) {
    const { dynamic, keys, champions } = formatStaticData()
    const BASE_URL = 'https://euw1.api.riotgames.com/lol'

    return await Promise.all(match_list.matches.map(async match => {
        const { gameId } = match

        const match_info_url = getUrl(BASE_URL, `match/v3/matches/${gameId}?${key}`)
        const match_info_data = await fetchData(match_info_url)
 
        const {
            formated,
            match_with_champ_info
        } = addInfoToChampion(dynamic, champions, keys, match)

        const champion_for_match_bans = addInfoChampionToMatchBans(match_info_data, formated)
        const champion_for_player_info = addInfoChampionToMathPlayers(match_info_data, formated)

        const update_match_info = {
            ...match_info_data,
            participants: champion_for_player_info,
            teams: champion_for_match_bans
        }
 
        return {
            ...match_with_champ_info[0],
            match: update_match_info
        }
    }))
}

async function getSummonerLeague(id, key) {
    const BASE_URL = 'https://euw1.api.riotgames.com/lol'

    const league_url = getUrl(BASE_URL, `league/v3/positions/by-summoner/${id}?${key}`)
    const league_data = await fetchData(league_url)

    const { leagueId } =  league_data[0]

    const league_info_url = getUrl(BASE_URL, `league/v3/leagues/${leagueId}?${key}`)
    const league_info_data = await fetchData(league_info_url)

    return [Object.assign({}, league_data[0], { currentLeague: league_info_data })]
    
}


export async function getSummonerData(name, { key }) {
    const BASE_URL = 'https://euw1.api.riotgames.com/lol'

    // get summoner info 
    const summoner_url = getUrl(BASE_URL, `summoner/v3/summoners/by-name/${name}?${key}`)
    const summoner = await fetchData(summoner_url)

    const { id, accountId } = summoner
    const { dynamic, keys, champions } = formatStaticData()

    const league_data = await getSummonerLeague(id, key)

    // get mastered champions from the summoner, this request returns an array that can be empty
    const mastery_champion_url = getUrl(BASE_URL, `champion-mastery/v3/champion-masteries/by-summoner/${id}?${key}`)
    const mastery_champion = await fetchData(mastery_champion_url)

    // summoner match list
    const match_list_url = getUrl(BASE_URL, `match/v3/matchlists/by-account/${accountId}?beginIndex=0&endIndex=2&${key}`)
    const match_list = await fetchData(match_list_url)

    const match_info = await formatMatchWithChampionInfo(match_list, key)

    const match_with_info = {
        ...match_list,
        matches: match_info
    }

    if (mastery_champion.length >= 1) {
        const with_mastery = mastery_champion.map(champ => {
            const { match_with_champ_info } = addInfoToChampion(dynamic, champions, keys, champ)
            return match_with_champ_info
        }).filter(e => e !== undefined).map(e => e[0])

        return {
            ...summoner,
            championMastery: with_mastery,
            matches: match_with_info,
            sumLeague: league_data,
        }
    }

    return {
        ...summoner,
        matches: match_with_info,
        sumLeague: league_data,
    }
}

export async function getMatches({ summoner_id, start, end, recent }, { key }) {
    const BASE_URL = 'https://euw1.api.riotgames.com/lol'
    // TODO: implement start, end and later the filter by champions etc...
    const match_list_url = getUrl(BASE_URL, 
        recent ? `match/v3/matchlists/by-account/${summoner_id}/recent?${key}` 
                : `match/v3/matchlists/by-account/${summoner_id}?${key}`)
    const match_list = await fetchData(match_list_url)

    const match_info = await formatMatchWithChampionInfo(match_list, key)

    return {
        ...match_list,
        matches: match_info
    }
}

export async function getMatch(gameId, { key }) {
    const { dynamic, keys, champions } = formatStaticData()
    const BASE_URL = 'https://euw1.api.riotgames.com/lol'

    const match_info_url = getUrl(BASE_URL, `match/v3/matches/${gameId}?${key}`)
    const match_info_data = await fetchData(match_info_url)

    const {
        formated
    } = addInfoToChampion(dynamic, champions, keys)

    const champion_for_match_bans = addInfoChampionToMatchBans(match_info_data, formated)
    const champion_for_player_info = addInfoChampionToMathPlayers(match_info_data, formated)

    return {
        ...match_info_data,
        participants: champion_for_player_info,
        teams: champion_for_match_bans
    }
}

function formatStaticData() {
    const formatedChamp = formatChampion(false)
    const dynamicChampionsInfo = formatChampion(true)
    const { keys, champions } = formatedChamp

    return {
        dynamic: dynamicChampionsInfo,
        keys,
        champions,
    }
}

