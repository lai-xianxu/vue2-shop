# vue_shop

## Project setup
```
npm install
```
![](/src/assets/程序学习交流群聊二维码.png)
<div>811481586 编程学习交流群 API文档,数据库,软件,PDF手册,chrome插件等等资料在群文件</div>


### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

* http 是无状态的
* 通过 cookie 在客户端记录状态
* 通过 session 在服务器端记录状态
* 通过 token 方式维持状态
* 前端与服务器之间存在跨域问题时使用
* 登录前输入帐号、密码 -》 服务器验证后返回token -》 客户端保存token -》 后续请求都携带token数据发送请求（用户的验证） -》 服务器验证token是否通过
