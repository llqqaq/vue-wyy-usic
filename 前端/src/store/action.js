import { shuffle } from '@/common/js/util.js'
import { setSHistory,deleteSOHistory,savePHistory,saveFavorite,deleteFavoriteOne } from '@/common/js/cache.js'
function findIndex(list, song) {
    // 记住这里还有一个return
    return list.findIndex(item => {
        return item.id === song.id
    })
}
const action = {
    // 在一个动作中需要多次使用mutations，建议用action
    // eslint-disable-next-line no-unused-vars
    selectPlay({ commit, state }, { list, index }) {
        commit('setSequenceList', list)
        if (state.mode === 2) {
            const nowList = list
            const randomList = shuffle(list)
            commit('setPlayList', randomList)
            index = findIndex(randomList, nowList[index])

        } else {
            commit('setPlayList', list)
        }
        commit('setCurrentIndex', index)
        commit('setFullScreen', true)
        commit('setPlaying', true)
    },
    // 在歌手详情界面点击随机播放
    randomPlay({ commit,state }, { list }) {
        commit('setSequenceList', list)
        commit('setMode', 2)
        console.log(state.mode);
        
        const randomList = shuffle(list)
        commit('setPlayList', randomList)
        commit('setCurrentIndex', 0)
        commit('setFullScreen', true)
        commit('setPlaying', true)
    },
    // 点击搜索建议
    cacheHistory({commit},query) {
        commit('setSearchHistory',setSHistory(query))
    },
    // 删除某一条数据
    deleteHistory({commit},value) {
        commit('setSearchHistory',deleteSOHistory(value))
    },

    // 歌单里面删除歌曲
    deleteSong({commit,state},song) {
        // 这里数组不是值赋值，不能直接修改
        let playList = state.playList.slice()
        let sequenceList = state.sequenceList.slice()
        let currentIndex = state.currentIndex
        let pIndex = findIndex(playList,song)
        playList.splice(pIndex,1)
        let sIndex = findIndex(sequenceList,song)
        sequenceList.splice(sIndex,1)
        if(currentIndex > pIndex || pIndex === playList.length) {
            currentIndex--
        }
        commit('setPlayList',playList)
        commit('setSequenceList',sequenceList)
        commit('setCurrentIndex',currentIndex)
        const playingState = playList.length>0
        commit('setPlaying',playingState)
    },

    // 清空歌单里面的所有歌曲
    deleteAll({commit}){
        commit('setPlayList',[])
        commit('setSequenceList',[])
        commit('setCurrentIndex',-1)
        // commit('setFullScreen', false)
        commit('setPlaying', false)
    },

    //播放历史
    savePlayHistory({commit},song) {
        commit('setPlayHistory',savePHistory(song))
    },

    // 插入歌曲
    insertSong({commit,state},song){
        let playList = state.playList.slice()
        let sequenceList = state.sequenceList.slice()
        let currentIndex = state.currentIndex

        // 当前播放的歌曲
        let currentSOng = playList[currentIndex]
        // 如若playList中存在插入歌曲
        let pIndex = findIndex(playList,song)
        // 插入，所以+1
        currentIndex++
        // 插入当前歌曲
        playList.splice(currentIndex,0,song)
        // 如果存在
        if(pIndex >-1) {
            // 如果存在插入前面
            if(pIndex <currentIndex){
                playList.splice(pIndex,1)
                currentIndex--
            }else{
                playList.splice(pIndex+1,1)
            }
        }

        // 查询当前播放歌曲 在sequenceList中的位置
        let sCurrentIndex = findIndex(sequenceList,currentSOng)
        let sIndex = findIndex(sequenceList,song)
        sCurrentIndex++
        sequenceList.splice(sCurrentIndex,0,song)
        if(sIndex >-1) {
            if(sCurrentIndex > sIndex){
                sequenceList.splice(sIndex,1)
                sCurrentIndex--
            }else{
                sequenceList.splice(sIndex+1,1)
            }
        }

        commit('setPlayList',playList)
        commit('setSequenceList',sequenceList)
        commit('setCurrentIndex',currentIndex)
        commit('setPlaying',true)
        commit('setFullScreen',true)
    },

    // 保存喜欢的数据
    saveFavorites({commit},song) {
        commit('setFavorite',saveFavorite(song))
    },

    // 删除某一条喜欢的数据
    deleteOneFavor({commit},song) {
        commit('setFavorite',deleteFavoriteOne(song))
    }
}

export default action