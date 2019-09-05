# Node-esb
文档： 中文 | English
## 目录
- [node-esb](#node-esb)
	- [项目描述](#项目描述)
	- [安装](#安装)
	- [使用说明](#使用说明)
	- [项目进度](#项目进度)
	
## 项目描述

### Esb系统
esb是一个中间件系统，负责链接用户逻辑和第三方接口，主要是处理大量的并发任务，本质是一个消息队列 + 定时任务系统。

## 安装

```bash
#use cli
npm install -g https://github.com/bannerchi/node-esb
#common
npm install --save https://github.com/bannerchi/node-esb
```

## 使用说明
*v1.0*
### CLI

为esb提供了一个cli，主要是构建代码，建exchange，queue,~~cron~~时使用

#### 构建结构
在根目录下

```bash
#可以指定你想要的根目录，默认当前根目录
node-esb build [baseDir]
```

创建完成的结构如下
- <br>
--connector <br>
--exchange <br>
~~--esb-config~~

~~*其中connector目录中放cronjob的文件*~~

~~*其中esb-config目录中放配置文件*~~


- - -
想要直接创建一个exchange

```bash
node-esb build -e YOU-WANT-NAME
```

- - -

想要直接创建一个queue

```bash
node-esb build -e YOUR-EX-NAME -q YOUR-QUEUE-NAME
```

你会得到一个文件结构还有个queue的文件模板

把你的执行代码放到

```javascript
function run(msg) {}

```

系统会执行你的代码，
请完成一个promise 函数就像示例那样，注意：这是一个消费者的函数。

- - -

~~创建一个cron目录用于放cronjob文件~~

- - -

~~接下来启动一个listener,listenerId是在数据库里面保存的id。~~

~~启动后台运行的listener~~


~~*cron 的命令和listen的类似*~~

**更多的cli命令请使用-h 参数查看**
```bash
node-esb -h
node-esb build -h
```

## 项目进度
- [x] messagebus 底层封装，主要封装rabbiitMq 方法。
- [x] daemon 封装，主要用于处理后台程序运行和管理，基于pm2。

~~- [x] cron 封装， 处理秒级别cronjob.~~
- [x] listener 类， 面向用户使用，也是用户最常用的类。
- [x] transformer 类， 面向用户使用，也是用户最常用的类。
- [x] payload 类 ， 结合listener使用处理数据和 exchange queue关系。
- [x] dispatcher 类， 负责连接数据库和listener关系。
- [x] cli工具 创建结构;

~~- [x] cli工具 创建listener;~~

- [ ] listener transformer 的测试用例;
- [ ] 详细的说明文档;

~~- [x] cli工具 创建cron job;~~
~~- [x] 数据库结构和字段设计;~~ 

## 项目说明
近期对之前项目做了比较大的调整不能对前面版本的兼容，
