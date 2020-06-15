import storage from 'good-storage'

const SEARCH_HISTORY = '_searchHistory'
const MAX_LENGTH = 15

const PLAY_HISTORY = '_playHistory_'
const PMAX_LENGTH = 200

const FAVORITE = '_favorite_'
const FMAX_LENGTH = 200

function inserArray(arr, value, compary, maxLength) {
    // 查询原数组中是否已经存在
    let index = arr.findIndex(compary)
    if (index === 0) {
        return
    }
    if (index > 0) {
        // 数组中直接删除
        arr.splice(index, 1)
    }
    arr.unshift(value)
    if (maxLength && arr.length > maxLength) {
        arr.pop
    }
    console.log();

}

// 将搜索历史加入缓存中
export const setSHistory = function (query) {
    // 获取
    let search = storage.get(SEARCH_HISTORY, [])
    inserArray(search, query, (item) => {
        return item === query
    }, MAX_LENGTH)
    // 设置
    storage.set(SEARCH_HISTORY, search)

    // 并且返回出去这个历史数组
    return search
}


// 获取本地的搜索历史
export const getHistory = () => {
    return storage.get(SEARCH_HISTORY, [])
}

// 将本地搜索历史清空
export const clearHistory = () => {
    storage.set(SEARCH_HISTORY, [])
    console.log('清空了');
}
// 删除某一条数据
export const deleteSOHistory = (val) => {
    let search = storage.get(SEARCH_HISTORY)
    console.log("里面接收的");
    console.log(val);
    let index = search.findIndex(item => {
        return item === val
    })
    if (index > -1) {
        search.splice(index, 1)
    }
    storage.set(SEARCH_HISTORY, search)
    return search
}

// 保存播放历史
export const savePHistory = (song) => {
    let history = storage.get(PLAY_HISTORY, [])
    inserArray(history, song, (item) => {
        return item.id === song.id
    }, PMAX_LENGTH)
    storage.set(PLAY_HISTORY, history)
    return history
}

// 获取播放历史
export const getPlayHistory = () => {
    return storage.get(PLAY_HISTORY, [])
}

// 保存喜欢听的
export const saveFavorite = (song) => {
    let favoriteList = storage.get(FAVORITE, [])
    // 插入数据
    inserArray(favoriteList, song, (item) => {
        return item.id === song.id
    }, FMAX_LENGTH)
    storage.set(FAVORITE, favoriteList)
    return favoriteList
}

// 删除某一条喜欢的
export const deleteFavoriteOne = (song) => {
    let favoriteList = storage.get(FAVORITE, [])
    let index =favoriteList.findIndex(item => {
        return item.id === song.id
    })
    if(index > -1) {
        favoriteList.splice(index,1)
    }
    storage.set(FAVORITE,favoriteList)
    return favoriteList
}

// 返回喜欢的
export const getFavorite = () => {
    return storage.get(FAVORITE,[])
}