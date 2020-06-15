import axios from 'axios'
// 设置接口基地址
const musicAxios = axios.create({
    baseURL: 'http://localhost:3000'
})


// 获取首页轮播图
export const getBanner = () => {
    return musicAxios.get('/banner')
}
// 首页推荐的歌单
export const getGeDan = () => {
    // return musicAxios.get("/top/playlist/highquality?cat='流行'")
    return musicAxios.get('/top/playlist/highquality?limit=30')
}
// 歌单详情
export const getGedanDetail = (id) => {
    return musicAxios.get(`/playlist/detail?id=${id}`)
}

// 获取热门歌手列表
export const getHotSongers = () => {
    return musicAxios.get('/top/artists?offset=0&limit=20')
}

// 获取歌手列表
export const getSongers = () => {
    return musicAxios.get('/artist/list?cat=5001&limit=99')
}

// 获取歌手单曲详情
export const getSingerInfo = (id) => {
    return musicAxios.get(`/artists?id=${id}`)
}

// 获取歌词
export const getLyric = (id) => {
    return musicAxios.get(`/lyric?id=${id}`)
}

// 排行榜
export const getRankingList = () => {
    return musicAxios.get('/toplist/detail')
}

// 获取热门搜索的词
export const getHotKey = () => {
    return musicAxios.get('/search/hot')
}

// 建议搜索，返回搜索关键词的歌曲
export const getSuggestList = (keywords,offset) => {
    // if(!keywords) return
    return musicAxios.get(`/search?keywords=${keywords}&offset=${offset}`)
}
