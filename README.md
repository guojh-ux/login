# JSP 登录 / 注册 Demo

一个基于 **JSP + Tomcat** 的登录注册示例，重点在**交互式界面美化**。
纯原生 HTML / CSS / JavaScript，**无任何第三方依赖、无 CDN**，断网也能跑。

## 功能

- **登录**：内置账号 `admin` / `123456`，同时支持注册出来的新账号
- **注册**：用户名 / 手机号 + 两次密码确认，全部校验都在服务端做
  | 情况 | 提示 |
  |---|---|
  | 用户名或手机号为空 | 请填写用户名或手机号 |
  | 密码为空 | 请填写密码 |
  | 两次密码不一致 | 两次输入的密码不一致 |
  | 用户名已被占用（含 `admin`） | 该用户名或手机号已被注册 |
- **登录成功页**：打勾动画 + 彩带庆祝 + 10 秒自动返回登录页（点击或按任意键可取消）
- **访问保护**：未登录直接访问成功页会被 `sendRedirect` 打回登录页

## 界面与交互

| 效果 | 说明 |
|---|---|
| 粒子背景 | Canvas 粒子漂移，鼠标会把附近粒子「吸」过去，近距离粒子自动连线 |
| 3D 倾斜卡片 | 鼠标在卡片上移动时整张卡片跟着倾斜，另有一团柔光跟随光标滑动 |
| 捂眼小角色 | 眼球实时跟随鼠标、每 2~5 秒随机眨眼；**聚焦密码框时会捂住眼睛**（防偷看） |
| 输入框 | 聚焦时青色描边 + 外发光，并在 3D 空间里浮起（`translateZ`） |
| 按钮 | 三色渐变滑动 + 光晕，按下缩小 |

交互思路参考了这几个开源项目：

- [VincentGarreau/particles.js](https://github.com/VincentGarreau/particles.js) — 粒子背景 / 鼠标吸引 / 连线
- [micku7zu/vanilla-tilt.js](https://github.com/micku7zu/vanilla-tilt.js) — 3D 倾斜 + 眩光
- [liuqingsong1528/Peek-Free-Login](https://github.com/liuqingsong1528/Peek-Free-Login) — 眼球跟随 / 眨眼 / 捂眼防偷看

## 目录结构

```
jsp-login/
├── .project / .classpath / .settings/     Eclipse 工程配置
└── src/main/
    ├── java/                               Java 源码（本示例为空）
    └── webapp/
        ├── index.jsp                       登录页
        ├── register.jsp                    注册页
        ├── success.jsp                     登录成功页
        ├── css/auth.css                    主题样式
        ├── js/auth.js                      交互脚本
        └── WEB-INF/web.xml                 部署描述符
```

## 运行方式

1. 安装 **JDK 17+** 和 **Tomcat 11**
2. Eclipse 导入工程：`File → Import → General → Existing Projects into Workspace`，选本目录
3. `Servers` 视图添加 Tomcat，右键工程 → `Run As → Run on Server`
4. 访问 **http://localhost:8080/WebApp/**

> ⚠️ 注意：`.settings/org.eclipse.wst.common.component` 里配置的 **context-root 是 `WebApp`**，
> 所以访问路径是 `/WebApp/`，**不是**目录名 `jsp-login`（Tomcat 的上下文路径区分大小写）。
> 想统一的话：右键工程 → `Properties → Web Project Settings → Context root` 改成 `jsp-login`。

## 已知限制（仅用于课程演示）

- 用户数据存在 **`application` 作用域的内存 `Map`** 里，**Tomcat 重启即全部清空**
- 密码**明文存储**，没有数据库、没有验证码；真实项目请改用数据库 + 加盐哈希
- 没有做 CSRF / 频率限制等安全加固
