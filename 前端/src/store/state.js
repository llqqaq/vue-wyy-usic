import { getHistory,getPlayHistory,getFavorite } from '@/common/js/cache.js'
// 播放模式
const playMode = {
    sequence: 0,
    loop: 1,
    random: 2
}
const state = {
    // 歌手数据
    singer: {},
    // 播放器数据
    playing: false,
    fullScreen: false,
    playList: [],
    // 正在播放的列表
    sequenceList: [],
    // 播放模式
    mode: playMode.sequence,
    currentIndex: -1,
    // 推荐歌单数据
    disc: {},
    // 排汗榜歌单数据
    topList: {},
    // 搜索历史
    searchHistory: getHistory(),
    // 播放历史
    playHistory: getPlayHistory(),
    // 喜欢的
    favorite: getFavorite()
}

export default state