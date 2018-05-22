// pages/playMusic/playMusic.js
const app = getApp()
var utilObj = require('../../utils/util.js')
import { DBPost } from '../../db/DBPost.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isPlayingMusic: true,
    progress: 0,
    isCollect: false,
    like: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.id) {
      var dbPost = new DBPost(options.id)
      var musicData = dbPost.getMusicById().data
      app.globalData.nowMusic = musicData
      this.setData({
        musicIdx: dbPost.getMusicById().index
      })
    }
    this.setData({
      music: app.globalData.nowMusic,
    })
    if (options.collect === 'true') {
      this.setData({
        isCollect: true
      })
    }
    this.audioCtx = wx.createAudioContext('myAudio')
    this.audioCtx.play()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  onMusicTap() {
    if (this.data.isPlayingMusic) {
      this.audioCtx.pause()
      this.setData({
        isPlayingMusic: !this.data.isPlayingMusic
      })
    } else {
      this.audioCtx.play()
      this.setData({
        isPlayingMusic: !this.data.isPlayingMusic
      })
    }
  },
  musicStart(e) {
    var progress = parseInt((e.detail.currentTime / e.detail.duration) * 100)
    this.setData({
      progress: progress
    })
  },
  back() {
    if (this.data.isCollect) {
      wx.redirectTo({
        url: '../index/index',
      })
    } else {
      wx.navigateBack({
        
      })
    }
  },
  rightIcon(){
    if (this.data.isCollect) {
      wx.showModal({
        title: '不喜欢这首歌',
        content: '确定丢弃此歌曲吗？',
        success: function (res) {
          if (res.confirm) {
            wx.redirectTo({
              url: '../index/index',
            })
          }
        }
      })
    } else {
      var dbPost = new DBPost()
      if (this.data.musicIdx < dbPost.getAllMusic().length-1) {
        var musicId = dbPost.getAllMusic()[this.data.musicIdx + 1].id
        wx.redirectTo({
          url: '../playMusic/playMusic?id=' + musicId + '&collect' + false,
        })
      } else {
        wx.showToast({
          title: '已经是最后一首了',
          icon: 'none',
          duration: 2000
        })
      }
    }

  },
  leftIcon() {
    if (this.data.isCollect){
      var dbPost = new DBPost()
      console.log("---------------add music----------------------")
      var header = {
        Cookie: "JSESSIONID=" + app.globalData.cookie
      }
      wx.request({
        url: app.globalData.host + '/mini/add/music',
        data: {
          minisign: app.globalData.minisign,
          music: {
            musicUrl: this.data.music.musicUrl,
            musicTitle: this.data.music.musicTitle,
            imgUrl: this.data.music.imgUrl
          }
        },
        header: header,
        method: 'POST',
        success: res => {
          console.log(res)
          this.setData({
            like: true
          })
          wx.showToast({
            title: '收藏歌曲成功',
            icon: 'success',
            duration: 2000
          })
          dbPost.addMusic(app.globalData.nowMusic)
        },
        fail: function (res) {
          console.log(res)
        }
      })
    }else{
      if (this.data.musicIdx >= 1) {
        var dbPost = new DBPost(), musicId = dbPost.getAllMusic()[this.data.musicIdx-1].id
        wx.redirectTo({
          url: '../playMusic/playMusic?id=' + musicId + '&collect' + false,
        })
      }else{
        wx.showToast({
          title: '已经是第一首了',
          icon:'none',
          duration: 2000
        })
      }
    }
  
  }
})