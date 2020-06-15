const getters = {
    // 获取歌手的数据
    getSinger(state) {
        return state.singer
    },
    getPlaying(state) {
        return state.playing
    },
    getFullScreen(state) {
        return state.fullScreen
    },
    getPlayList(state) {
        return state.playList
    },
    getSequence(state) {
        return state.sequenceList
    },
    getMode(state) {
        return state.mode
    },
    getCurrentIndex(state) {
        return state.currentIndex
    },
    getCurrentSong(state) {
        return state.playList[state.currentIndex] || {}
    },
    getDisc(state) {
        return state.disc
    },
    getTopList(state) {
        return state.topList
    },
    getSearchHistory(state) {
        return state.searchHistory
    },
    getPlayHistory(state) {
        return state.playHistory
    },
    getFavorite(state) {
        return state.favorite
    }
}

export default getters