//logs.js
const app = getApp();
const util = require('../../utils/util.js');
const api = require('../../utils/api.js');
const imgCofig = require('../../utils/img-cofig.js');

Page({
  data: {
    backgroundImg: 'calm',
    userInfo: {},
    time: util.greet(new Date()),
    address: '定位中...',
    weatherNow: {
      tmp: '', //温度
      cond_txt: '', //实况天气
      cond_code: 999, //实况天气
      wind_dir: '', //风向
      wind_sc: '', //风力
      hum: '', //湿度
      pres: '', //大气压强
      pcpn: '', //降水量
      loc: '' //更新时间
    },
    hourlyWeather: [[], []],
    dailyWeather: [],
    lifestyle: []
  },
  onLoad: function(option) {
    if (option.city) {
      let city = JSON.parse(option.city);
      this.setData({
        address: city.name
      });
      this.getWeather(city);
      return;
    }

    this.getLocation();
  },
  onPullDownRefresh() {
    let pages = getCurrentPages();
    let page = pages[pages.length - 1];
    let option = page.options;
    if (option.city) {
      let city = JSON.parse(option.city);
      this.setData({
        address: city.name
      });
      this.getWeather(city);
      return;
    }

    this.getLocation();
    wx.stopPullDownRefresh();
  },
  onShareAppMessage() {
    return {
      title: '今日天气',
      path: '/pages/weather/weather'
    }
  },

  getLocation() {
    let that = this;
    wx.getLocation({
      type: 'wgs84',
      success(res) {
        // 获取地理位置
        api
          .getLocation(res)
          .then(res => {
            that.setData({
              address: res.address
            });
          })
          .catch(err => {
            that.setData({
              address: '定位失败，请手动选择'
            });
          });

        that.getWeather(res);
      },
      fail(err) {
        wx.showToast({
          title: `失败${err.errMsg}`,
          icon: 'none',
          duration: 2000
        });
      }
    });
  },

  getWeather(data) {
    let that = this;
    // 获取实时天气
    api.getWeatherNow(data).then(res => {
      that.setWeatherNow(res.data);
      that.setBackgroundImg(that.data.now.icon);
    });

    // 获取未来24小时
    api.getWeatherHourly(data).then(res => {
      that.setWeatherHourly(res.data.hourly.filter((item, index) => index % 3 === 0))
    });

    // 获取近3天
    api.getWeatherDaily(data).then(res => {
      that.setWeatherDaily(res.data.daily);
    });

    // 生活指数
    api.getWeatherLifestyle(data).then(res => {
      that.setLifestyle(res.data.daily);
    });
  },

  setBackgroundImg(code) {
    let list = imgCofig.bgImgList;
    let obj = {};
    obj = list.find(item => {
      return item.codes.includes(parseInt(code));
    });
    this.setData({
      backgroundImg: obj.name
    });
  },

  setWeatherNow(data) {
    this.setData({
      weatherNow: {
        tmp: data.now.temp,
        cond_txt: data.now.text,
        cond_code: data.now.icon,
        wind_dir: data.now.windDir,
        wind_sc: data.now.windScale,
        hum: data.now.humidity,
        pres: data.now.pressure,
        pcpn: data.now.precip,
        loc: data.now.obsTime.substring(11, 16)
      }
    });
  },

  setWeatherHourly(data) {
    data.map(item => {
      item.time = item.fxTime.substring(11, 16);
    });
    this.setData({
      hourlyWeather: [data.slice(0, 4), data.slice(4)]
    });
  },

  setWeatherDaily(data) {
    data = data.slice(0, 3);
    data.map(item => {
      item.date = item.fxDate
        .split('-')
        .slice(1)
        .join('/');
    });
    this.setData({
      dailyWeather: data
    });
  },

  setLifestyle(data) {
    data = data.filter(item => {
      return imgCofig.lifestyleImgList[item.type]
    })
    data.forEach(item => {
      item.imgSrc = imgCofig.lifestyleImgList[item.type].src;
    });
    this.setData({
      lifestyle: data
    });
  }
});
