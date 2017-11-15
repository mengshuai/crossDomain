# iTalentSDK用法

## 介绍

分类：

* 1. sdk-client: iTalentSDKClient
* 2. sdk-server: iTalentSDKServer

其中： client包含iframe之间通信，和基础方法的调用，但是不包含基础方法响应后处理，用于内层iframe

    server包含iframe之间通信，和基础方法的调用，且包含基础方法响应后处理, 用于需要做处理的窗口，如：最外层italent

主要用途：

* 内部iFrame设置宽高
* 内部iFrame改变hash，外部记录
* 内部iFrame通过最外层Window弹窗，关闭弹窗
* iFrame之间通信

## iframe嵌套规则

若iframe的URL为`http://10.129.7.55/iframe.html#home%3FwidgetId%3Diframe1`

解码后对应：`http://10.129.7.55/iframe.html#home?widgetId=iframe1`

其中widgetId为iframe的身份，该身份在设置宽高，记录hashChange时可以使用。

父window的hash就为`#home%3Fiframe1%3Dhttp%3A%2F%2F10.129.7.55%2Fiframe.html%23home%253FwidgetId%253Diframe1`

解码后对应：`#home?iframe1=http://10.129.7.55/iframe.html#home%3FwidgetId%3Diframe1` 

加载iframe

```
<iframe src="http://10.129.7.55/iframe.html#home%3FwidgetId%3Diframe1" id="iframe1" scrolling="auto" frameboder="0" />
```

> 每一级的hash后的queryString都需要编码

## 设置iframe宽高

> 内部iframe通过外部iFrame改变iFrame节点的宽高。

* 1. 外部窗口注册

```
window.iTalentSDK.register();

```

* 2. 内部iFrame回调

```
window.iTalentSDK.updateSize(null, width, height);
//width 默认为 100%
//height 默认为 document.body.height

```

* 3.外部窗口注销

```
window.iTalentSDK.unregister(event_name);
```
* 4.获取数据的公共方法

```
window.iTalentSDK.getPopUpData();

```
## 记录内部iframe的hashchange

> 内部iframe的历史记录由外部记录。
> 当内部iframe的hashchange时，通过修改父window的`iframe1=http://10.129.7.55/iframe.html#home%3FwidgetId%3Diframe1`的iframe1的url来记录下级的历史记录。


* 1. 外部窗口注册

```
window.iTalentSDK.register();
```

* 2. 内部iframe注册

```
window.iTalentSDK.register(null);
//或者
window.iTalentSDK.bindHashChangeEvent();

```

## 修改外层href记录的iframe地址

> 手动触发iframe记录内部地址

* 1. 外部窗口注册

```
window.iTalentSDK.register();
```

* 2. 内部iframe触发记录地址

```

window.iTalentSDK.recodeIframeUrl(null, {
    _italentHashNotChange : true || false // true则会触发外层hashChange事件，false则单纯记录
});

```


## 内层iframe通过最外层window弹窗

> 内部iframe通过最外层window弹窗

* 1. 外部窗口注册

```
window.iTalentSDK.register();

```

* 2. 内部iframe打开弹窗

```
window.iTalentSDK.showPopup(url, width, height, data,transferFrameUrl,childPosition,isNeedAnimate,isNeedSetWidthAndHeight);
//width,height 不传就自适应宽高
//data为 你需要传入的数据
//transferFrameUrl  跳转链接，没有可不传
//childPosition 作用：定位子类弹窗动画开始的位置。如果不是一级弹窗，需传该参数,对应的点击的相对位置
{top:e.target.getBoundingClientRect().top,left:e.target.getBoundingClientRect().left} 
//isNeedAnimate 是否需要弹窗动画,默认是true
//isNeedSetWidthAndHeight //是否需要sdk设置宽和高, 默认是false,传true以后前面传的width和height失效


```
* 3. 弹窗调整自身位置

```
window.iTalentSDK.updateSize(null, width, height);

```

## 关闭弹窗

> 内部iframe通过最外层window关闭弹窗

* 1. 每层窗口注册

```
window.iTalentSDK.register();

```

* 2. 内部iframe关闭弹窗

```
window.iTalentSDK.hidePopup();

```


## iframe之间通信

> 通信双方需要协定消息名称，以辨识发给自己的消息
> 以 `app名+'_' + 频道名 + '_' + 下划线`为消息名，如`talentUI_home_feed`

* 1. 监听事件方

```
window.iTalentSDK.register([{
    listenEvent : 'talentUI_home_feed',
    context : this,
    cb : function(){
        alert("I'm ***, I recive a message from home feed!");
    }
}]);

//context:指定作用域，作用是在回调函数用使用，不传回调函数里面的this 指的是window，传了以后，回调里面的this 指的是当前视图

```

* 2. 发送事件方

```
window.iTalentSDK.sendMessage({
    publishEvent : 'talentUI_home_feed',
    data : {
        id : 111,
        changeName : 'feed name'
    }
})

```


changelog : 

0.0.1-1
*  加入showPopup传递参数，利用window.name传递
*  修改hash后触发hashchange事件——server端需要监听
*  client端在register的时候，发送url给server端记录，以防止不是hashchang的时候，需要记录url

0.0.1-2
*  修改iframeId传递规则，从window.name中获取， {__iTalentFrameId : '', __iTalentFrameType : '' // iframe, pop}
*  每次iframe加载先默认加载 italent-transfer-data.html

0.0.1-3
* 利用appName字段在sdk中集中包装eventName
* 提供获取getPopUpData数据的公用方法
* sendMessage 方法中加入context参数，回调时把作用域传回去，不传默认是window

0.0.1-4
* 修改函数命名不规范
* 修改封装eventName bug


0.0.1-5
* 修改弹窗定位问题
* 添加showPopUp 添加一个参数transferFrameUrl(跳转页地址)
* 修改隐藏弹窗bug

0.0.1-6
* 修改整天页面刷新问题
* 解决register注册重复bug
* server中_hidePopup中添加容错信息
* 添加loading
* 添加弹窗动画

0.0.1-7
* 去掉iframe的背景和边框
* 添加直接调取hidePopup的容错信息
* 添加getItalentHostUrl方法，该方法是传url得到italent的url地址

0.0.1-8
* 判断文件是否重载

0.0.1-9
* 解决app使用sdk单独弹窗问题

0.0.2
* 添加轮询修改iframe高度问题
* ie8兼容bug

0.0.2-1
* 添加ESC监听事件
* 修改loading隐藏时机
* 修改loadingurl
* 兼容__iTalentWidgetUpdateSize 字符串和布尔值

0.0.2-2
* 解决ie8重复绑定事件
* 解决多层iframe嵌套修改iframe高度问题
* 解决iframe修改高度不流畅，在轮询修改高度之前先修改一下高度

0.0.3
* 添加getErrorPageUrl方法
* 解决打开新标签页修改title值,配合italent做的修改
* 解决sdkserverie8下重复绑定事件

0.0.4
* 解决ie8内存回收问题
* 解决safari下iframe 没有name 值默认取id做为name
* 解决ie，低版本chrome弹窗定位不居中问题
* 解决ie8切换tab多次刷新问题

0.0.5
* 解决hashchange bug

0.1.0
* 添加弹窗是否有动画开关
* 添加弹窗是否需要添加边框和阴影

0.1.1
* 解决二级弹窗定位不准问题
* showPopup 添加参数isNeedAnimate,isNeedSetWidthAndHeight
* 添加判断是否是ie8，如果是ie8才走回收iframe机制
* 去掉边框和阴影开关

0.1.2
* 解决二级弹窗缩放偏移太多
* 添加弹窗有滚动条error日志

0.1.3
* 去掉格式化listenEvent

0.1.4
* 解决beisencloud iframe设置宽高问题
0.1.5
* 解决ie版本判断错误问题

#如何查看项目弹窗是否有滚动条日志(http://ops.beisencorp.com:88/OpsAdmin/Account/SignIn)

````
//站点名称指的是“应用程序池”,直白一点说就是项目域名,现在项目有BSGlobal.appName的就是指appName，没有默认是"sdk"

````
![](http://gitlab.beisen.co/ux/iTalent-sdk/raw/master/do.png)

0.1.7
* ie9降级处理动画
* ie8去掉border
* getItalentHostUrl方法localtion.href兼容?或#处理

0.1.8
* 解决iframe内点击收起iframe外的弹层
* 解决低版本搜狗浏览器transform不兼容问题
* 修改判断iframe中有滚动条的bug，并添加上只有线上才会打error日志

0.1.9
* 解决ie8-ie9 iframe内点击收起iframe外的弹层bug

0.1.9-4
* 解决loading文字乱码问题
* 解决二级弹窗快速点击确定取消按钮时sdk报错的问题

0.1.9-5
* 解决非cloud的二级弹窗弹出效果异常问题

0.1.9-6
* 解决点击引起的vds.js报错问题

0.1.9-7
* 去掉IE下的黑色背景色

0.1.9-8
* 解决二级弹窗关闭后，一级弹窗出现模糊的问题（高版本浏览器不会出现该问题，仅发现在window电脑上的 chrome 50 51版本）

0.1.9-10 
* 新增Beisencloud一级弹窗预加载

0.1.9-12
* 新增Beisencloud二级弹窗预加载，更改遮罩层背景颜色

0.1.9-13
* 路由跳转Bug修复，导致弹窗位置不对

0.1.9-14
* 修复弹窗消失错误问题

0.1.9-15
* iframe自适应

0.1.9-16
* 解决iframe高宽为100%时模糊问题

0.1.9-17
* 解决三层iframe嵌套时出现滚动条

0.1.9-18
* 解决Beisencloud业务扩展，弹窗资源版不对

0.1.9-19
* 解决路由跳转时，多个Iframe存在

0.1.9-20
* 解决第二次弹窗白页问题

0.1.9-21
* 修复当页面为Top时，lookup点击确定消失问题

0.1.9-22
* 修复iframe在Ie下有默认背景色问题，为BC绑定Top的resize事件提供视口高宽   

0.1.9-23
* 新增gettopsize方法，默认获得Top视口高宽

0.1.9-24
* 解决跨域问题

0.1.9-30
* 增加预加载flag(后续版本该flag已被删除)

0.1.9-31
* 增加ie9容错

0.1.9-32
* 解决路由问题

0.1.9-33
* 解决两个预加载后一个弹窗出不来问题及审批中心未加载完弹窗出不来问题

0.1.9-34
* 提供遮罩侧边栏方法

0.1.9-35
* 为头部遮罩增加1px高度

0.1.9-36
* 为侧边栏遮罩增加2px高度

0.1.9-37
* 调用侧边栏遮罩时隐藏整体遮罩(38版本删除)

0.1.9-38
* 修复整体遮罩未及时隐藏的问题

0.1.9-39
* 修复侧边栏遮罩问题

0.1.9-40
* 修改二级导航的遮罩边距

0.1.9-41
* 修复非iframe弹窗调用_changeLeftMenuShade方法时，第二次弹窗遮罩异常的问题

0.1.9-42
* 增加容错代码，解决报错问题
