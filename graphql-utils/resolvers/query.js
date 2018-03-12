import fetch from 'node-fetch'
import fs from 'fs'
import path from 'path'
import { formatChampion, addInfoToChampion, addInfoChampionToMatchBans, addInfoChampionToMathPlayers } from './helpers/utils'

const Query = {
    summoner: async (_, { name }, ctx) => {
        const res = await fetch(`https://euw1.api.riotgames.com/lol/summoner/v3/summoners/by-name/${name}?${ctx.key}`)
        const summoner = await res.json()
        
        if(ctx.request.body.query.match('matches')){
            // TODO: implement all matches and match search
            const formatedChamp = formatChampion(false)
            const dynamicChampionsInfo = formatChampion(true)
            const { keys, champions } = formatedChamp

            const res = await fetch(`https://euw1.api.riotgames.com/lol/match/v3/matchlists/by-account/${summoner.accountId}?beginIndex=0&endIndex=1&${ctx.key}`)
            const matches = await res.json()

            const match = await Promise.all(matches.matches.map(async elem => {
                const matchRes = await fetch(`https://euw1.api.riotgames.com/lol/match/v3/matches/${elem.gameId}?${ctx.key}`)
                const m = await matchRes.json()

                addInfoToChampion(dynamicChampionsInfo, champions, keys, elem)
                addInfoChampionToMatchBans(m, dynamicChampionsInfo)
                addInfoChampionToMathPlayers(m, dynamicChampionsInfo)

                elem.match = m
            }))

            summoner.matches = matches
        }

        // create a dump of the graphql request for mock_data utilities
        if(process.env.DEV && summoner) {
            fs.writeFile(`${process.cwd()}/debug.json`, JSON.stringify(summoner), (err) => {
                if(err) throw err
                console.log('> debug file create succesfully')
            })
        }
    
        return summoner
    },
    match: async (_, { game_id }, ctx) => {
        const res = await fetch(`https://euw1.api.riotgames.com/lol/match/v3/matches/${game_id}?${ctx.key}`)
        const match = await res.json()
        const formatedChamp = formatChampion(false)
        const dynamicChampionsInfo = formatChampion(true)
        const { keys, champions } = formatedChamp

        addInfoToChampion(dynamicChampionsInfo, champions, keys)
        addInfoChampionToMatchBans(match, dynamicChampionsInfo)
        addInfoChampionToMathPlayers(match, dynamicChampionsInfo)

        return match
    },
    matches: async (_, { summoner_id, start, end, recent }, ctx) => {
        const formatedChamp = formatChampion(false)
        const dynamicChampionsInfo = formatChampion(true)
        const { keys, champions } = formatedChamp

        // TODO: implement start, end and later the filter by champions etc...
        if(!recent){
            const res = await fetch(`https://euw1.api.riotgames.com/lol/match/v3/matchlists/by-account/${summoner_id}?${ctx.key}`)
            const matches = await res.json()

            if(matches.status){
                throw new Error(`Une erreur est survenue lors de la requete, code : ${matches.status.status_code}`)
            }

            const match = await Promise.all(matches.matches.map(async elem => {
                const matchRes = await fetch(`https://euw1.api.riotgames.com/lol/match/v3/matches/${elem.gameId}?${ctx.key}`)
                const m = await matchRes.json()
                addInfoToChampion(dynamicChampionsInfo, champions, keys, elem)
                if(m.gameId){
                    addInfoChampionToMatchBans(m, dynamicChampionsInfo)
                    addInfoChampionToMathPlayers(m, dynamicChampionsInfo)
                }

                elem.match = m
            }))
            console.log(match)
            return matches
        }

        const res = await fetch(`https://euw1.api.riotgames.com/lol/match/v3/matchlists/by-account/${summoner_id}/recent?${ctx.key}`)
        const matches = await res.json()

        if(matches.status){
            throw new Error(`Une erreur est survenue lors de la requete, code : ${matches.status.status_code}`)
        }

        const match = await Promise.all(matches.matches.map(async elem => {
            const matchRes = await fetch(`https://euw1.api.riotgames.com/lol/match/v3/matches/${elem.gameId}?${ctx.key}`)
            const m = await matchRes.json()
            addInfoToChampion(dynamicChampionsInfo, champions, keys, elem)
            if(m.gameId){
                addInfoChampionToMatchBans(m, dynamicChampionsInfo)
                addInfoChampionToMathPlayers(m, dynamicChampionsInfo)
            }
            elem.match = m
        }))

        return matches
    }
}

export default Query