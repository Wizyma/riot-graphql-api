import fetch from 'node-fetch'
import fs from 'fs'
import path from 'path'
import { getSummonerData, getMatches, getMatch } from './helpers/riot-api'

const Query = {
    summoner: async (_, { name }, ctx, info) => await getSummonerData(name, ctx),
    match: async (_, { game_id }, ctx) => await getMatch(game_id, ctx),
    matches: async (_, params, ctx) => await getMatches(params, ctx)
}

export default Query