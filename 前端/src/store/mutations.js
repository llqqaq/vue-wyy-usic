const mutations = {
    setSinger(state, singer) {
        state.singer = singer
    },
    setPlaying(state, flag) {
        state.playing = flag
    },
    setFullScreen(state, flag) {
        state.fullScreen = flag
    },
    setPlayList(state, list) {
        state.playList = list
    },
    setSequenceList(state, list) {
        state.sequenceList = list
    },
    setMode(state, mode) {
        state.mode = mode
    },
    setCurrentIndex(state, index) {
        state.currentIndex = index
    },
    setDisc(state,disc) {
        state.disc = disc
    },
    setTopList(state,topList) {
        state.topList = topList
    },
    setSearchHistory(state,searchHistory){
        state.searchHistory = searchHistory
    },
    // 清空本地数据
    clearSHistory(state) {
        state.searchHistory = []
    },
    setPlayHistory(state,playHistory) {
        state.playHistory = playHistory
    },
    setFavorite(state,song){
        state.favorite = song
    }
}

export default mutations