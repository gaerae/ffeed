<p align="center"><a href="http://gaerae.com/ffeed" target="_blank"><img width="200"src="assets/cover.png"></a></p>

# FFeed - Facebook Feed
A simple page that returns the feed of a specific facebook page and group.

## Usage
Replace `{app-id}` in `assets/appid.js` 
```javascript
// your a facebook app id
const facebookAppId = '{app-id}'
```

* [Create a Facebook App ID](https://developers.facebook.com/docs/apps/register#create-app)
* [Vue.js](https://vuejs.org)

## URL Options: The Query String Parameters

* `id`: 766343270153764 or gaeraecom
* `limit`: 15
* `fields`: type,icon,name,picture,message,permalink,caption,count
* `skin`: base or white

```
http://gaerae.com/ffeed/?id=gaeraecom&limit=10&fields=type,icon,name,picture,message,permalink,caption,count&skin=white
```

## License

[MIT](http://opensource.org/licenses/MIT)
