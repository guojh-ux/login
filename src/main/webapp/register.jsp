<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="java.util.*" %>
<%!
    // 输出到 HTML 前做转义，避免输入里的符号破坏页面
    private String esc(String s) {
        if (s == null) return "";
        return s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;").replace("\"", "&quot;");
    }
%>
<%
    request.setCharacterEncoding("UTF-8");

    String username = request.getParameter("username");
    String password = request.getParameter("password");
    String confirm  = request.getParameter("confirm");
    String msg = "";

    if ("POST".equalsIgnoreCase(request.getMethod())) {
        if (username == null || username.trim().isEmpty()) {
            msg = "请填写用户名或手机号";
        } else if (password == null || password.isEmpty()) {
            msg = "请填写密码";
        } else if (!password.equals(confirm)) {
            msg = "两次输入的密码不一致";
        } else {
            username = username.trim();
            // 用户表放在 application 作用域：所有用户共享，Tomcat 重启后清空
            synchronized (application) {
                Map<String,String> users = (Map<String,String>) application.getAttribute("users");
                if (users == null) {
                    users = new HashMap<String,String>();
                    application.setAttribute("users", users);
                }
                if ("admin".equals(username) || users.containsKey(username)) {
                    msg = "该用户名或手机号已被注册";
                } else {
                    users.put(username, password);
                    response.sendRedirect("index.jsp?reg=1");   // 注册成功，回到登录界面
                    return;
                }
            }
        }
    }
%>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>注册账号</title>
    <%-- 交互式主题：粒子背景 + 3D 倾斜卡片 + 捂眼小角色 --%>
    <link rel="stylesheet" href="css/auth.css">
</head>
<body>

<%-- 粒子背景画布（particles.js 风格） --%>
<canvas id="bg"></canvas>

<%-- 3D 舞台：鼠标在卡片上移动时，卡片会跟着倾斜 --%>
<div class="stage">

    <%-- 整个注册界面都在这个 form 里 --%>
    <form class="box" action="register.jsp" method="post">

        <%-- 捂眼小角色：眼球跟随鼠标；聚焦密码框时它会捂住眼睛 --%>
        <div class="guard" id="guard">
            <div class="face"></div>
            <div class="eye l"><span class="pupil"></span></div>
            <div class="eye r"><span class="pupil"></span></div>
            <div class="mouth"></div>
            <div class="hand l"></div>
            <div class="hand r"></div>
        </div>

        <h3>注册账号</h3>

        <label for="username">用户名 / 手机号</label>
        <input type="text" id="username" name="username" value="<%= esc(username) %>" placeholder="请输入用户名或手机号">

        <label for="password">密码</label>
        <input type="password" id="password" name="password" placeholder="请输入密码">

        <label for="confirm">确认密码</label>
        <input type="password" id="confirm" name="confirm" placeholder="请再次输入密码">

        <input type="submit" value="注 册">

        <%-- 错误提示 --%>
        <p class="msg error"><%= msg %></p>

        <p class="tip"><a href="index.jsp">已有账号？返回登录</a></p>
    </form>
</div>

<script src="js/auth.js"></script>
</body>
</html>
