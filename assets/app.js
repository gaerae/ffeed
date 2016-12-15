// your a facebook app id
var facebookAppId = '1770780396504220'

// app
new Vue({
  el: '#app',
  data: {
    loadingMessage: false,
    mainMessage: '',
    searchQuery: null,
    searchResult: null,
    feedId: null,
    feedLimit: 15,
    feedTotalCount: 0,
    feedInfo: null,
    feedList: null,
    ticking: false
  },

  created: function () {
    if (facebookAppId == '{app-id}') {
      this.mainMessage = 'You need to create a Facebook App ID.'
      console.error('assets/app.js > line 2: facebookAppId')
      return false
    }
    FB.init({appId: facebookAppId, version: 'v2.8', status: true, cookie: true, xfbml: true})
    this.parseURL(window.location.search)
    this.apiCall('apiFeedInit')
    this.onInfiniteList()
  },

  watch: {
    searchQuery: function() {
      this.searchResult = null
      this.feedList = null
      self.mainMessage = ''
      this.apiCall('apiSearch')
    }
  },

  methods: {
    // parse a url
    parseURL: function(url) {
      var tempParsing = [], tempSplit, tempUrls = url.slice(url.indexOf('?') + 1).split('&');
      for (var i = 0; i < tempUrls.length; i++) {
          tempSplit = tempUrls[i].split('=');
          tempParsing[tempSplit[0]] = tempSplit[1];
      }
      this.feedId = (tempParsing['id']) ? tempParsing['id'] : null
      this.feedLimit = (tempParsing['limit']) ? tempParsing['limit'] : this.feedLimit
    },

    // parse a message string
    parseMessage: function(message) {
      message = message || ''
      var urlPattern = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/i
      var hashPattern = /(#[^\s]+)/g
      return message.replace(urlPattern, function(url){
        return '<a href="'+url+'" target="_blank">'+url+'</a>'
      }).replace(hashPattern, function(hashtag){
        return '<a href="https://www.facebook.com/hashtag/'+encodeURI(hashtag.replace('#', ''))+'" target="_blank">'+hashtag+'</a>'
      })
    },

    // infinite list
    onInfiniteList: function(){
      var self = this
      window.addEventListener('scroll', function(e) {
        if ((window.innerHeight + window.pageYOffset) >= document.body.offsetHeight) {
          if (self.ticking === false) {
            self.apiCall('apiInfiniteList')
            self.ticking = true
          }
        } else {
          self.ticking = false
        }
      })
    },

    // api call
    apiCall: function(callBackFunction) {
      var self = this
      self.loadingMessage = true
      FB.getLoginStatus(function(response) {
        if (response.status === 'connected') {
          self[callBackFunction]()
        } else {
          self.mainMessage = 'A simple page that returns the feed of a specific facebook page and group.<br/>You need to log in facebook account.'
        }
        self.loadingMessage = false
      })

    },

    // search
    apiSearch: function() {
      var self = this
      if (self.searchQuery === null || self.searchQuery == '') {
        self.searchResult = null
        self.mainMessage = 'Please enter search values to perform search.'
        return false
      }
      FB.api('/', 'post',
        {batch: [{method:'get', relative_url:'/search?include_headers=false&type=page&q='+encodeURI(self.searchQuery)},
                 {method:'get', relative_url:'/search?include_headers=false&type=group&q='+encodeURI(self.searchQuery)}
        ]},
        function (response) {
          if (response && !response.error) {
            const tempPage = JSON.parse(response[0].body)
            const tempGroup = JSON.parse(response[1].body)
            const tempResult = []
            let pageResultCount = tempPage.data.length + 1
            tempGroup.data.forEach(function(data){
              tempResult[pageResultCount] = data
              pageResultCount++
            })
            self.searchResult = Object.assign({}, tempPage.data, tempResult)
          } else {
            self.searchResult = null
            self.mainMessage = 'No data.<br/>Error message: '+response.error.message
          }
      })
    },

    // feed init
    apiFeedInit: function() {
      var self = this
      if (this.feedId === null || self.searchQuery == '') {
        self.mainMessage = 'Please enter search values to perform search.'
        return false
      }
      FB.api(
        '/'+self.feedId,
        {summary: true, metadata: 1, fields :'metadata.fields(type),name,id,picture{url},feed.limit('+self.feedLimit+'){attachments,likes.summary(true),comments.summary(true),shares,message,created_time,link,picture,full_picture,type,permalink_url,name},posts.limit('+self.feedLimit+'){attachments,likes.summary(true),comments.summary(true),shares,message,created_time,link,picture,full_picture,type,permalink_url,name}'},
        function (response) {
          self.feedInfo = {
            type: response.metadata.type,
            id: response.id,
            name: response.name,
            link: '//fb.com/'+response.id,
            picture: response.picture.data.url
          }
          if (response && !response.error) {
            if ((typeof response.posts === "object") && (response.posts !== null)) {
              // page
              self.feedList = response.posts
            } else if ((typeof response.feed === "object") && (response.feed !== null)) {
              // group
              self.feedList = response.feed
            } else {
              return false
            }
            // total feed count
            self.feedTotalCount = self.feedList.data.length + 1
          } else {
            self.feedList = null
            self.mainMessage = 'No data.<br/>Error message: '+response.error.message
          }
      })
    },

    // infinite list
    apiInfiniteList: function() {
      var self = this
      if (self.feedList !== null) {
        FB.api(
          self.feedList.paging.next,
          function (response) {
            if (response && !response.error) {
              const tempData = []
              response.data.forEach(function(data){
                tempData[self.feedTotalCount] = data
                self.feedTotalCount++
              })
              self.feedList.data = Object.assign({}, self.feedList.data, tempData)
              self.feedList.paging = Object.assign({}, self.feedList.paging, response.paging)
              self.ticking = false
            } else {
              self.mainMessage = 'No data.<br/>Error message: '+response.error.message
            }
        })
      }
    }
  }
})
