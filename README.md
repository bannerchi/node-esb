#Node-esb
文档： 中文 | English
##项目描述
###Esb系统
esb是一个中间件系统，负责链接用户逻辑和第三方接口，主要是处理大量的并发任务，本质是一个消息队列 + 定时任务系统。

##项目进度

- [x] messagebus 底层封装，主要封装rabbiitMq 方法。
- [x] daemon 封装，主要用于处理后台程序运行和管理，基于pm2。
- [x] cron 封装， 处理秒级别cronjob.
- [x] listener 类， 面向用户使用，也是用户最常用的类。
- [x] payload 类 ， 结合listener使用处理数据和 exchange queue关系。
- [ ] dispatcher 类， 负责连接数据库和listener关系。
- [x] cli工具 创建结构；
- [x] cli工具 创建listener;
- [ ] cli工具 创建cron job;
- [x] 数据库结构和字段设计; 
- [ ] web界面提供