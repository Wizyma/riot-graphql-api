const typeDefs = `
type Summoner {
    profileIconId: Int!
    name: String!
    summonerLevel: Int!
    accountId: ID! @unique
    id: ID! @unique
    revisionDate: Int!
    spectator: Spectator @relation(id: 0)
}

type Spectator {
    gameId: Int! @default(value: "Not Fount, the player maybe not spectating right now !")
    gameStartTime: Int! @default(value: "Not Fount, the player maybe not spectating right now !")
    platformId: String! @default(value: "Not Fount, the player maybe not spectating right now !")
    gameMode: String! @default(value: "Not Fount, the player maybe not spectating right now !")
    mapId: Int! @default(value: "Not Fount, the player maybe not spectating right now !")
    gameType: String! @default(value: "Not Fount, the player maybe not spectating right now !")
}

type Query {
    summoner(name: String!): Summoner!
}
`

export default typeDefs