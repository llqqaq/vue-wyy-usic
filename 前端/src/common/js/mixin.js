import { mapGetters, mapActions } from 'vuex'
import { shuffle } from "@/common/js/util.js";


export const playListMixin = {
    computed: {
        // 注意这里是括号
        ...mapGetters([
            'getPlayList'
        ])
    },
    mounted() {
        this.handlePlayList(this.getPlayList)
    },
    // 在keep-alive，切换组件后触发触发的事件
    activated() {
        this.handlePlayList(this.getPlayList)
    },
    watch: {
        getPlayList(newValue) {
            this.handlePlayList(newValue)
        }
    },
    methods: {
        handlePlayList() {
            // 如果组件中有这个事件，则被覆盖，无则发出错误警告
            throw new Error('component must implement handlePlayList method')
        }
    }
}

// 播放器
export const playerMixin = {
    data() {
        return {
            playMode: {
                sequence: 0,
                loop: 1,
                random: 2
            }
        }
    },
    computed: {
        getIcon() {
            return this.getMode === this.playMode.sequence ? ' icon-shunxubofang' : this.getMode === this.playMode.loop ? 'icon-danquxunhuan' : 'icon-moshisuijixunhuan'
        },
        ...mapGetters([
            'getFavorite'
        ])
    },
    methods: {
        // 切换播放模式
        togglePattern() {
            let num = (this.getMode + 1) % 3;
            this.setMode(num);
            let list = null;
            if (this.getMode === this.playMode.random) {
                list = shuffle(this.getSequence);
            } else {
                list = this.getSequence;
            }
            // console.log(`切换前的${this.getCurrentIndex}`);
            // console.log(this.getPlayList);
            let index = this._getCurrentIndex(list);
            this.setCurrentIndex(index);
            // console.log(`切换后的${this.getCurrentIndex}`);
            // console.log(list);
            // console.log("切换前的playlist");
            // console.log(this.getPlayList);
            this.setPlayList(list);
            // console.log("切换前的playlist");
            // console.log(this.getPlayList);
        },
        // 获取当前歌曲的下标
        _getCurrentIndex(list) {
            let index = list.findIndex(item => {
                return item.id === this.getCurrentSong.id;
            });
            return index;
        },
        // 获取icon的样式
        getFavoIcon(song) {
            let exit = this._findIndex(this.getFavorite, song)
            if (exit) {
                return 'icon-likeon2x'
            } else {
                return 'icon-like'
            }
        },
        // 切换icon样式
        toggleFavoIcon(song) {
            let exit = this._findIndex(this.getFavorite, song)
            if (exit) {
                this.deleteOneFavor(song)
            } else {
                this.saveFavorites(song)
            }
            console.log(this.getFavorite)
        },
        _findIndex(list, song) {
            let index = list.findIndex(item => {
                return item.id === song.id
            })
            return index > -1
        },
        ...mapActions([
            'deleteOneFavor',
            'saveFavorites'
        ])
    }
}

// 搜索相关
export const searchMixin = {
    data() {
        return {
            value: ''
        }
    },
    computed: {
        ...mapGetters(["getSearchHistory"])
    },
    methods: {
        // 滚动触发
        beforeScroll() {
            // 收起键盘
            this.$refs.searchBox.blur();
        },
        // input发生改变
        query(newQuery) {
            this.value = newQuery;
        },
        addQuery(query) {
            this.$refs.searchBox.setQuery(query);
        },
        // 缓存历史
        setHistory(value) {
            this.cacheHistory(value);
            this.value = "";
        },
        ...mapActions(["cacheHistory", "deleteHistory"]),
    }
}
