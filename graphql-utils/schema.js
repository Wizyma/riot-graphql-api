const typeDefs = `
type Summoner {
    profileIconId: ID!
    name: String!
    summonerLevel: Int!
    accountId: ID! 
    id: ID! 
    revisionDate: Int!
    spectator: Spectator
    matches(start: Int, end: Int): Matches
}

# get all user Matches
type Matches {
    matches: [Matchs]
    startIndex: Int!
    endIndex: Int!
    totalGames: Int!
}

type Matchs {
    lane: String!
    gameId: ID!
    champion: Int!
    platformId: ID!
    timestamp: Int!
    queue: Int!
    role: String!
    season: Int!
    # the id has to match the gameId
    match: Match!
}

# get a single match that match the given match ID
type Match {
   seasonId: ID! 
   queueId:ID!
   gameId: ID!
   participantIdentities: [ParticipantIdentities!]!
   gameVersion: String!
   platformId: ID!
   gameMode: String!
   mapId: Int!
   gameType: String!
   teams: [Teams!]!
   participants: [Participants!]!
   gameDuration: Int!
   gameCreation: Int!
}

type ParticipantIdentities {
    player: Player!
    participantId: ID!
}

type Player {
    currentPlatformId: ID!
    summonerName: String!
    platformId: ID!
    matches: [Matches!]!
    currentAccountId: Int!
    profileIcon: Int!
    summonerId: ID!
    accountId: ID!
}

type Teams {
    firstDragon: Boolean!
    bans: [Bans]
    firstInhibitor: Boolean!
    win: String !
    firstRiftHerald: Boolean!
    firstBaron: Boolean!
    baronKills: Int!
    riftHeraldKills: Int!
    firstBlood: Boolean!
    teamId: ID!
    firstTower: Boolean!
    vilemawKills: Int!
    inhibitorKills: Int!
    towerKills: Int!
    dominionVictoryScore: Int!
    dragonKills: Int! 
}

type Bans {
    pickTurn: Int!
    championId: ID!
}

type Participants {
    stats: Stats!
    spell1Id: ID!
    participantId: ID!
    highestAchievedSeasonTier: String!
    spell2Id: ID!
    teamId: ID!
    timeline: Timeline!
    championId: ID!
}

type Timeline {
    lane: String!
    participantId: ID!
    role: String!
}

type Stats {
    neutralMinionsKilledTeamJungle: Int!
    visionScore: Int!
    magicDamageDealtToChampions: Int!
    largestMultiKill: Int!
    totalTimeCrowdControlDealt: Int!
    longestTimeSpentLiving: Int!
    perk1Var1: Int!
    perk1Var3: Int!
    perk1Var2: Int!
    tripleKills: Int!
    perk5: Int!
    perk4: Int!
    playerScore9: Int!
    playerScore8: Int!
    kills: Int!
    playerScore1: Int!
    playerScore0: Int!
    playerScore3: Int!
    playerScore2: Int!
    playerScore5: Int!
    playerScore4: Int!
    playerScore7: Int!
    playerScore6: Int!
    perk5Var1: Int!
    perk5Var3: Int!
    perk5Var2: Int!
    totalScoreRank: Int!
    neutralMinionsKilled: Int!
    damageDealtToTurrets: Int!
    physicalDamageDealtToChampions: Int!
    damageDealtToObjectives: Int!
    perk2Var2: Int!
    perk2Var3: Int!
    totalUnitsHealed: Int!
    perk2Var1: Int!
    perk4Var1: Int!
    totalDamageTaken: Int!
    perk4Var3: Int!
    wardsKilled: Int!
    largestCriticalStrike: Int!
    largestKillingSpree: Int!
    quadraKills: Int!
    magicDamageDealt: Int!
    firstBloodAssist: Boolean!
    item2: Int!
    item3: Int!
    item0: Int!
    item1: Int!
    item6: Int!
    item4: Int!
    item5: Int!
    perk1: Int!
    perk0: Int!
    perk3: Int!
    perk2: Int!
    perk3Var3: Int!
    perk3Var2: Int!
    perk3Var1: Int!
    damageSelfMitigated: Int!
    magicalDamageTaken: Int!
    perk0Var2: Int!
    firstInhibitorKill: Boolean!
    trueDamageTaken: Int!
    assists: Int!
    perk4Var2: Int!
    goldSpent: Int!
    trueDamageDealt: Int!
    participantId: Int!
    physicalDamageDealt: Int!
    sightWardsBoughtInGame: Int!
    totalDamageDealtToChampions: Int!
    physicalDamageTaken: Int!
    totalPlayerScore: Int!
    win: Boolean!
    objectivePlayerScore: Int!
    totalDamageDealt: Int!
    neutralMinionsKilledEnemyJungle: Int!
    deaths: Int!
    wardsPlaced: Int!
    perkPrimaryStyle: Int!
    perkSubStyle: Int!
    turretKills: Int!
    firstBloodKill: Int!
    trueDamageDealtToChampions: Int!
    goldEarned: Int!
    killingSprees: Int!
    unrealKills: Int!
    firstTowerAssist: Boolean!
    firstTowerKill: Boolean!
    champLevel: Int!
    doubleKills: Int!
    inhibitorKills: Int!
    firstInhibitorAssist: Boolean!
    perk0Var1: Int!
    combatPlayerScore: Int!
    perk0Var3: Int!
    visionWardsBoughtInGame: Int!
    pentaKills: Int!
    totalHeal: Int!
    totalMinionsKilled: Int!
    timeCCingOthers: Int!
}

type Spectator {
    gameId: Int! 
    gameStartTime: Int! 
    platformId: String! 
    gameMode: String! 
    mapId: Int! 
    gameType: String! 
}

type Query {
    summoner(name: String!): Summoner!
    matches(summoner_id: ID!, recent: Boolean!, start: Int, end: Int): Matches
    match(game_id: ID!): Match!
}
`

export default typeDefs