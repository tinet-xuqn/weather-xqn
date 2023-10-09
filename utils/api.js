// 引入SDK核心类
var QQMapWX = require('./qqmap-wx-jssdk.js');

// 实例化API核心类
var demo = new QQMapWX({
  key: 'WPTBZ-SSW66-3CTSH-E6XLG-3G3W3-KMBR6' // 必填
});

// 获取地理位置
const getLocation = function(option) {
	return new Promise(function(resolve,reject) {
		demo.reverseGeocoder({
			location: {
				latitude: option.latitude,
				longitude: option.longitude
			},
			success: res => {
				resolve(res.result)
			},
			fail: res => {
				wx.showToast({
				  title: '获取位置信息失败，请手动选择',
				  icon: 'none',
				  duration: 2000
				})
				reject(res)
			}
		})
	})
}

const getSuggestion = function(value) {
	return new Promise(function(resolve,reject) {
		demo.getSuggestion({
			keyword: value,
			success: res => {
				resolve(res)
			},
			fail: res => {
				wx.showToast({
				  title: '查询失败',
				  icon: 'none',
				  duration: 2000
				})
				reject(res)
			}
		})
	})
}

const geocoder = function(address) {
	return new Promise(function(resolve,reject) {
		demo.geocoder({
			address: address,
			success: res => {
				resolve(res)
			},
			fail: res => {
				wx.showToast({
				  title: '查询失败',
				  icon: 'none',
				  duration: 2000
				})
				reject(res)
			}
		})
	})
}


// 和风天气api
const BASE_URL = 'https://devapi.qweather.com/v7/'

const getWeather = function({ type,name }, option) {
  const data = {
    location: option.longitude + ',' + option.latitude,
    key: '71c8d39e87c84eb2a819c1f7a0e07bce'
  }
  if (option.hasOwnProperty('type')) {
    data.type = option.type
  }
	return new Promise((resolve,reject) => {
		wx.request({
			url: BASE_URL + type,
			data,
			success(res) {
				resolve(res)
			},
			fail: res => {
				wx.showToast({
				  title: `获取${name}信息失败，请稍后重试`,
				  icon: 'none',
				  duration: 2000
				})
				reject(res)
			}
		})
	})
}

const getWeatherNow = function(option) {
	return getWeather({ type: 'weather/now',name: '实时' },option)
}

const getWeatherHourly = function(option) {
	return getWeather({ type: 'weather/24h',name: '未来24小时' },option)
}

const getWeatherDaily = function(option) {
	return getWeather({ type: 'weather/3d',name: '近3天' },option)
}

const getWeatherLifestyle = function(option) {
	return getWeather({ type: 'indices/1d',name: '生活指数' },{ ...option, type: 0 })
}

const getAirNow = function(option) {
	return getWeather({ type: 'air/now',name: '空气质量' }, option)
}


module.exports = {
  getLocation,
  getSuggestion,
  geocoder,
  getWeatherNow,
  getWeatherHourly,
  getWeatherDaily,
  getWeatherLifestyle,
  getAirNow
}