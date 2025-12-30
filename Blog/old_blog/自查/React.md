React

## setState

同步/异步，react18之后默认异步

## 类组件

大写字母开头。继承自React.Component。实现render函数

## 生命周期

![img](https://s.poetries.top/images/20210409153312.png)

### constructor

初始化state，进行方法绑定

### compoentDidMount

组件挂载立即调用

依赖DOM的操作

发送网络请求

添加订阅（在comoponentWillUnmount取消订阅）



## conText

1. 创建一个context
2. 通过context.provider为后代提供数据
3. 设置组件contextType
4. 获取数据（this.context）

![image-20250313140731402](https://typora-image-mrz.oss-cn-beijing.aliyuncs.com/image-20250313140731402.png)

![image-20250313140825110](https://typora-image-mrz.oss-cn-beijing.aliyuncs.com/image-20250313140825110.png)