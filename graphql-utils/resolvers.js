import fetch from 'node-fetch'

const resolvers = {
    Query: {
        summoner: async (_, { name }, ctx) => {
            const sums = await fetch(`https://euw1.api.riotgames.com/lol/summoner/v3/summoners/by-name/${name}?${ctx.key}`)
            return await sums.json()
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
