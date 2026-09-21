<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ page import="java.util.*" %>
<html>
<head>
    <title>用户登录</title>
    <%-- 交互式主题：粒子背景 + 3D 倾斜卡片 + 捂眼小角色 --%>
    <link rel="stylesheet" href="css/auth.css">
</head>
<body>
<%
    // 获取表单提交参数
    String username = request.getParameter("username");
    String password = request.getParameter("password");
    String errorMsg = "";

    // 判断是否提交了表单（参数不为空才校验）
    if(username != null && password != null){
        // 已注册用户表：由 register.jsp 写入 application 作用域
        Map<String,String> users = (Map<String,String>) application.getAttribute("users");
        // 内置账号 admin / 123456，或者注册过的账号
        boolean ok = ("admin".equals(username) && "123456".equals(password))
                  || (users != null && password.equals(users.get(username)));
        if(ok){
            // 登录成功，把用户名存入session
            session.setAttribute("loginUser",username);
            // 服务器转发跳转到成功页面
            request.getRequestDispatcher("success.jsp").forward(request,response);
            return;
        }else{
            errorMsg = "用户名或者密码错误！";
        }
    }
%>

<%-- 粒子背景画布（particles.js 风格） --%>
<canvas id="bg"></canvas>

<%-- 3D 舞台：鼠标在卡片上移动时，卡片会跟着倾斜 --%>
<div class="stage">

    <%-- 整个登录界面都在这个 form 里 --%>
    <form class="box" action="index.jsp" method="post">

        <%-- 捂眼小角色：眼球跟随鼠标；聚焦密码框时它会捂住眼睛 --%>
        <div class="guard" id="guard">
            <div class="face"></div>
            <div class="eye l"><span class="pupil"></span></div>
            <div class="eye r"><span class="pupil"></span></div>
            <div class="mouth"></div>
            <div class="hand l"></div>
            <div class="hand r"></div>
        </div>

        <h3>用户登录</h3>

        <label for="username">用户名</label>
        <input type="text" id="username" name="username" placeholder="请输入用户名">

        <label for="password">密码</label>
        <input type="password" id="password" name="password" placeholder="请输入密码">

        <input type="submit" value="登 录">

        <%-- 错误提示 --%>
        <p class="msg error"><%= errorMsg %></p>

        <%-- 注册成功后的提示 --%>
        <% if("1".equals(request.getParameter("reg"))) { %>
            <p class="msg ok">注册成功，请登录</p>
        <% } %>

        <%-- 注册入口 --%>
        <p class="tip"><a href="register.jsp">没有账号？去注册</a></p>
    </form>
</div>

<script src="js/auth.js"></script>
</body>
</html>
