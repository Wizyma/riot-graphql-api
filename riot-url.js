export default {
    urls: {
        static : {
            champions: ({ lang, api_key }) => `https://euw1.api.riotgames.com/lol/static-data/v3/champions?locale=${lang}&champListData=all&tags=all&dataById=false&${api_key}`,
            items: ({ lang, api_key }) =>`https://euw1.api.riotgames.com/lol/static-data/v3/items?locale=${lang}&itemListData=all&tags=all&${api_key}`,
            maps: ({ lang, api_key }) => `https://euw1.api.riotgames.com/lol/static-data/v3/maps?locale=${lang}&${api_key}`,
            masteries: ({ lang, api_key }) => `https://euw1.api.riotgames.com/lol/static-data/v3/masteries?locale=${lang}&tags=all&masteryListData=all&${api_key}`
        }
    }
}