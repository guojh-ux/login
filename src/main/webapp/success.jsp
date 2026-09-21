<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%!
    // 输出到 HTML 前做转义，避免用户名里的符号破坏页面
    private String esc(String s) {
        if (s == null) return "";
        return s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;").replace("\"", "&quot;");
    }
%>
<%
    // 从session取出登录用户
    String user = (String) session.getAttribute("loginUser");
    if(user == null){
        // 没有登录，直接跳回登录页
        response.sendRedirect("index.jsp");
        return;
    }
%>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>登录成功</title>
    <%-- 与登录/注册页共用同一套交互主题 --%>
    <link rel="stylesheet" href="css/auth.css">
</head>
<body>

<%-- 粒子背景画布 --%>
<canvas id="bg"></canvas>

<%-- 彩带庆祝层：盖在卡片上方，pointer-events:none 所以不挡点击 --%>
<canvas id="fx"></canvas>

<%-- 3D 舞台：鼠标在卡片上移动时，卡片会跟着倾斜 --%>
<div class="stage">

    <div class="box">

        <%-- 小角色：切成庆祝状态，眼睛弯成 ^ ^ 并原地蹦跳 --%>
        <div class="guard happy" id="guard">
            <div class="face"></div>
            <div class="eye l"><span class="pupil"></span></div>
            <div class="eye r"><span class="pupil"></span></div>
            <div class="mouth"></div>
            <div class="hand l"></div>
            <div class="hand r"></div>
        </div>

        <%-- 圆环 + 对勾依次"画"出来 --%>
        <div class="tick">
            <svg viewBox="0 0 52 52">
                <circle class="tick-circle" cx="26" cy="26" r="24"/>
                <path class="tick-path" d="M14 27 l8 8 l16 -16"/>
            </svg>
        </div>

        <h3>登录成功！</h3>

        <p class="welcome">欢迎你：<b><%= esc(user) %></b></p>

        <p class="tip"><a href="index.jsp">返回登录</a></p>

        <p class="count" id="count">10 秒后自动返回登录页…</p>
    </div>
</div>

<script src="js/auth.js"></script>
</body>
</html>
