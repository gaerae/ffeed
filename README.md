> **⚠️ Archived — no longer maintained (2026-10).** It depends on the Facebook JavaScript SDK and Graph API permissions that Facebook no longer grants to new apps, so the page at gaerae.com/ffeed may not work. Last update: 2020. The repository stays read-only for reference; forks are welcome.
> **유지보수 종료 (2026-10).** 더 이상 관리되지 않는 프로젝트입니다. 참고용으로 읽기 전용으로 보관합니다.

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
* `limit`: 50
* `fields`: type,icon,name,picture,message,permalink,caption,count
* `skin`: base or white

```
https://gaerae.com/ffeed/?id=gaeraecom&limit=50&fields=type,icon,name,picture,message,permalink,caption,count&skin=white
```

## License

[MIT](http://opensource.org/licenses/MIT)
