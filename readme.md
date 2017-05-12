# Kinice本人的博客

## 介绍

本来是要把这个repo作为毕设做的，但一步一步就做成了一个博客。

本博客使用以下技术开发：

1. node express + ejs
2. gulp + less 
3. mongodb

其余不提。

完成了LESS的重构，并且引入了K-article，感觉还不错。

基本的功能已经上线，全面完善了自我介绍的核心功能，采用了impress.js，炫酷屌炸天。

服务器已经部署好，地址是[kinice.top](http://www.kinice.top)。

## 运行

### 环境配置

具体配置过程我写到了我的博客里，欢迎观看。

[本博客阿里云配置过程（一）服务器及域名备案篇](http://kinice.top/article/570c82d23e1e9f0f76cfc972)

[本博客阿里云配置过程（二）Node线上环境配置篇](http://kinice.top/article/57bb2805e15e9aa25b48cf60)

[本博客阿里云配置过程（三）怎么让我们的Node应用跑起来](http://kinice.top/article/57ebb4ce32c50a670ba94c8f)

本博客需要提前在系统里安装 `Node v5.0.0+`，`npm 3.0.0+`，`mongodb 3.0.0+`

先clone本项目到本地，在`finalShow/`中新建一个settings.js，格式按照settings.js.default，里面填上你自己的数据库配置。

start之前需要开启数据库哦。

### 步骤

```
    $ git clone [this repository]

    $ cd finalShow/

    $ vi settings.js #新建settings.js，内容同settings.js.default，自行更改其中配置

    $ npm install

    $ npm start
```