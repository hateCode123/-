### ie9中遇到的兼容性问题
一、Pormise的问题，原来是Axios不能直接兼容IE9

npm install es6-promise

import promise from 'es6-promise';
promise.polyfill();

二、URLSearchParams未定义的问题，原来是IE9不支持URLSearchParams。（千万别用一些不被大众浏览器兼容的东西，都是坑）
先去项目里下载qs

npm install qs

然后去Axios放参数的时候这样放
```js
import qsfrom 'qs';
var params = {
'param1':1,
'param2':2
}
qs.stringify(params)
```
三、axios.GET方法在IE9会直接默认去拿缓存，返回的是304而不是正常拿到数据后的200.
这个就在GET方法的params中加个时间戳就行了
`time:new Date().getTime()`

四、如果在ie9、ie10、ie11打开是一片空白，用一下方法解决
首先`npm install --save babel-polyfill`

然后在main.js中的最前面引入babel-polyfill

`import 'babel-polyfill'`

在index.html 加入以下代码（非必须）

<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">

在config中的webpack.base.conf.js中,修改编译配置

`entry:{
    app:['babel-polyfill','./src/main.js']      
}`

五、IE9中，elementUI的el-input删除操作无法触发数据变动监听

解决办法：加入ie9input事件垫片

`cnpm install --save ie9-oninput-polyfill`

六、IE9中template标签使用问题

之前在tr标签里面用template标签包裹td标签，出现了比较严重的UI错乱，
所以。。IE9不能在tr标签中使用template标签

### ie10、ie11中的兼容性问题

一、在IE11上无法用router-link跳转，主要是当url的hash change的时候浏览器没有做出相应。里面主要是做了一个兼容。
```js
if (
  '-ms-scroll-limit' in document.documentElement.style && 
  '-ms-ime-align' in document.documentElement.style
) { // detect it's IE11
  window.addEventListener("hashchange", function(event) {
    var currentPath = window.location.hash.slice(1);
    if (store.state.route.path !== currentPath) {
      router.push(currentPath)
    }
  }, false)
}
```
这个兼容就是当检测到浏览器为IE的时候，手动给url加一个hashchange事件。
或者使用history模式，但是会造成ie9不兼容，上面方法应该更好一些


### 其他

#### 使用element-ui遇到的问题

一、IE9样式错乱
可能的原因1，element-ui 中使用了 display: flex; 样式，IE9不支持次样式，解决方法为，排查下各组件，避免使用带 display: flex; 的组件
二、IE11无法正常加载v-loading等问题
安装bable-polyfill