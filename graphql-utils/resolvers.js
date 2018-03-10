import fetch from 'node-fetch'
import fs from 'fs'
import path from 'path'

const resolvers = {
    Query: {
        summoner: async (_, { name }, ctx) => {
            const res = await fetch(`https://euw1.api.riotgames.com/lol/summoner/v3/summoners/by-name/${name}?${ctx.key}`)
            const summoner = await res.json()
            
            if(ctx.request.body.query.match('matches')){
                // TODO: implement all matches and match search
                const champions = Object.assign({}, require('../static-data/champions/champions_fr_FR.json'))
                const dynamicChampionsInfo = Object.assign({}, require('../static-data/champions/champions_dynamic_fr_FR.json'))

                const res = await fetch(`https://euw1.api.riotgames.com/lol/match/v3/matchlists/by-account/${summoner.accountId}?beginIndex=0&endIndex=1&${ctx.key}`)
                const matches = await res.json()

                const champKeys = Object.values(champions.keys)
                delete champions.keys
                delete champions.format
                delete champions.type
                delete champions.version

                const match = await Promise.all(matches.matches.map(async elem => {
                    const matchRes = await fetch(`https://euw1.api.riotgames.com/lol/match/v3/matches/${elem.gameId}?${ctx.key}`)
                    const m = await matchRes.json()

                    dynamicChampionsInfo.champions.map(champ => {
                        for (let i in champions.data) {
                            champKeys.forEach(k => {
                                if(champions.data[k].id === champ.id){
                                    champ.championsInfo = champions.data[k]
                                }
                            })
                        }

                        if (champ.id === elem.champion) {
                            elem.champion = champ
                        }
                    })

                    m.teams.map(team => team.bans).map(bans => {
                        bans.map(ban => {    
                            dynamicChampionsInfo.champions.map(champ => {
                                if (ban.championId === champ.id) {
                                    ban.champion = champ
                                }
                            })
                        })
                    })

                    m.participants.map(participant => {
                        dynamicChampionsInfo.champions.map(champ => {
                            if (participant.championId === champ.id) {
                                participant.champion = champ
                            }
                        })
                    })

                    elem.match = m
                }))

                summoner.matches = matches
            }

            if(process.env.DEV && summoner) {
                fs.writeFile(`${process.cwd()}/debug.json`, JSON.stringify(summoner), (err) => {
                    if(err) throw err
                    console.log('> debug file create succesfully')
                })
            }
        
            return summoner
        },
        match: async (_, { game_id }, ctx) => {
            const match = await fetch(`https://euw1.api.riotgames.com/lol/match/v3/matches/${game_id}?${ctx.key}`)
            return await match.json()
        },
        matches: async (_, { summoner_id, start, end, recent }, ctx) => {
            // TODO: implement start, end and later the filter by champions etc...
            if(!recent){
                const res = await fetch(`https://euw1.api.riotgames.com/lol/match/v3/matchlists/by-account/${summoner_id}?${ctx.key}`)
                const mchs = await res.json()
                if(mchs.status){
                    throw new Error(`Une erreur est survenue lors de la requete, code : ${mchs.status.status_code}`)
                }
                console.log(mchs)
                return mchs
            }

            const res = await fetch(`https://euw1.api.riotgames.com/lol/match/v3/matchlists/by-account/${summoner_id}/recent?${ctx.key}`)
            const mchs = await res.json()

            if(mchs.status){
                throw new Error(`Une erreur est survenue lors de la requete, code : ${mchs.status.status_code}`)
            }
            return mchs
        }
    }
}

export default resolvers
