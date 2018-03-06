import fetch from 'node-fetch'

const resolvers = {
    Query: {
        summoner: async (_, { name }, ctx) => {
            const sums = await fetch(`https://euw1.api.riotgames.com/lol/summoner/v3/summoners/by-name/${name}?${ctx.key}`)
            return await sums.json()
        },
    }
}

export default resolvers
