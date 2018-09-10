### VUE工程首页加载慢的优化
#### vue-router懒加载

1. require-amd模式(AMD风格)：
```js
const tvProgram = resolve => require(['@/page/tvProgram'], resolve);
```
2. require-ensure模式(webpack分割代码块的语法)：

语法：`语法: require.ensure(dependencies: String[], callback: function([require]), [chunkName: String])`
```js
const list = r => require.ensure([], () => r(require('../components/list/list')), 'list');
```
3. 官方文档中推荐的懒加载的写法：

```js
const Foo = () => import (`@/component/Foo`)
```
把组件按组分块：

有时候我们想把某个路由下的所有组件都打包在同个异步块 (chunk) 中。只需要使用 命名 chunk，一个特殊的注释语法来提供 chunk name (需要 Webpack > 2.4)。
```js
const Foo = () => import(/* webpackChunkName: "group-foo" */ './Foo.vue')
const Bar = () => import(/* webpackChunkName: "group-foo" */ './Bar.vue')
const Baz = () => import(/* webpackChunkName: "group-foo" */ './Baz.vue')
```
Webpack 会将任何一个异步模块与相同的块名称组合到相同的异步块中。

同时设置webpack.base.conf.js
```js
output: {
 path: config.build.assetsRoot,
 filename: '[name].js',
 chunkFilename: '[name].js',  // 需要配置的地方
 publicPath: process.env.NODE_ENV === 'production'
  ? config.build.assetsPublicPath
  : config.dev.assetsPublicPath
}
```
#### 异步组件
Vue 允许你以一个工厂函数的方式定义你的组件,可以在工厂函数中返回一个 Promise，所以把 webpack 2 和 ES2015 语法加在一起，我们可以写成这样：
```js
Vue.component(
  'async-webpack-example',
  // 这个 `import` 函数会返回一个 `Promise` 对象。
  () => import('./my-async-component')
)
```
当使用局部注册的时候，你也可以直接提供一个返回 Promise 的函数：
```js
new Vue({
  // ...
  components: {
    'my-component': () => import('./my-async-component')
  }
})
```
#### 工程文件打包的时候不生成.map文件。
npm run build编译之后，我们查看编译生成的文件，发现有很多.map文件，这些文件也占了不小的空间。.map文件的作用是帮助编译后的代码调试，但是我们上线的代码已经调试完成，所以上线时可以不生成.map文件。

在config/index.js中将productionSourceMap的值修改为false，就可以在编译时不生成.map文件了。
#### 建议后台做gzip压缩，性能提升很大
#### 使用CDN加速
在项目开发中，我们会用到很多第三方库，如果可以按需引入，我们可以只引入自己需要的组件，来减少所占空间，但也会有一些不能按需引入，我们可以采用CDN外部加载，在index.html中从CDN引入组件，去掉其他页面的组件import，修改webpack.base.config.js，在externals中加入该组件，这是为了避免编译时找不到组件报错。

首先是引入资源`<script src="https://cdn.bootcss.com/vue/2.4.4/vue.min.js"></script>`

然后项目中需要改的地方是bulid文件夹下面的webpack.base.conf.js文件，改的地方为
```js
module.exports = {
  entry: {
    app: './src/main.js'
  },
  externals:{
    'vue': 'Vue',
  },
```
这里需要将vue公开出去，供全局使用，这里小写的vue是我们引入资源时对应的名字，`后面大写的文字我们不能定义,而是由库的主人所暴露出来的全局方法名`

接下来就是将我们项目中引用对应资源的地方将原先的引入方式`import`去掉

#### 网页静态化（服务端渲染）
vue官方提供了解决方案

#### 图片资源的压缩

#### 其他
这样我们的路由信息配置好了，然后每次切换路由的时候，尽量避免不要重复请求数据，所以我们还需要配置一下组件的keep-alive：在app.vue组件里面。
```html
<keep-alive exclude="moviesDetail">
   <router-view></router-view>
</keep-alive>
```
