/* ============================================================
   交互脚本  ——  auth.js
   参考以下开源实现：
     · VincentGarreau/particles.js      粒子漂移 + 鼠标吸引 + 就近连线
     · micku7zu/vanilla-tilt.js         3D 倾斜 + 眩光跟随
     · liuqingsong1528/Peek-Free-Login  眼球跟随鼠标 + 随机眨眼 + 聚焦密码框时捂眼
   纯原生 JS，无任何依赖。
   ============================================================ */
(function () {
    'use strict';

    /* ========================================================
       1. 粒子背景（particles.js 风格）
       ======================================================== */
    var canvas = document.getElementById('bg');
    if (canvas && canvas.getContext) {
        var ctx = canvas.getContext('2d');
        var COUNT = 70;         // 粒子数量
        var LINK = 130;         // 粒子之间连线的最大距离
        var ATTRACT = 170;      // 鼠标吸引半径
        var dots = [];
        var mouse = { x: null, y: null };

        function resize() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        resize();
        window.addEventListener('resize', resize);

        for (var i = 0; i < COUNT; i++) {
            dots.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 0.6,
                vy: (Math.random() - 0.5) * 0.6,
                r: Math.random() * 1.8 + 0.8
            });
        }

        window.addEventListener('mousemove', function (e) {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        });
        window.addEventListener('mouseout', function () {
            mouse.x = null;
            mouse.y = null;
        });

        (function frame() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            for (var i = 0; i < dots.length; i++) {
                var d = dots[i];
                d.x += d.vx;
                d.y += d.vy;

                // 撞到边缘就反弹
                if (d.x < 0 || d.x > canvas.width)  { d.vx *= -1; }
                if (d.y < 0 || d.y > canvas.height) { d.vy *= -1; }

                // 鼠标吸引：粒子被光标轻轻拽过去（particles.js 的 grab 模式）
                if (mouse.x !== null) {
                    var dx = mouse.x - d.x;
                    var dy = mouse.y - d.y;
                    var len = Math.sqrt(dx * dx + dy * dy);
                    if (len < ATTRACT && len > 0.1) {
                        d.x += dx / len * 0.7;
                        d.y += dy / len * 0.7;
                    }
                }

                ctx.beginPath();
                ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(150, 230, 255, .75)';
                ctx.fill();
            }

            // 就近连线：距离越近线越亮
            for (var a = 0; a < dots.length; a++) {
                for (var b = a + 1; b < dots.length; b++) {
                    var lx = dots[a].x - dots[b].x;
                    var ly = dots[a].y - dots[b].y;
                    var sq = lx * lx + ly * ly;
                    if (sq < LINK * LINK) {
                        ctx.beginPath();
                        ctx.moveTo(dots[a].x, dots[a].y);
                        ctx.lineTo(dots[b].x, dots[b].y);
                        ctx.strokeStyle = 'rgba(120, 200, 255, ' + (0.22 * (1 - sq / (LINK * LINK))) + ')';
                        ctx.lineWidth = 1;
                        ctx.stroke();
                    }
                }
            }

            requestAnimationFrame(frame);
        })();
    }

    /* ========================================================
       2. 卡片 3D 倾斜 + 眩光（vanilla-tilt.js 风格）
       ======================================================== */
    var stage = document.querySelector('.stage');
    var card = document.querySelector('.box');
    var MAX = 10;               // 最大倾斜角度（度），参考实现的 max 是 15

    if (stage && card) {
        stage.addEventListener('mousemove', function (e) {
            var rect = card.getBoundingClientRect();
            var px = (e.clientX - rect.left) / rect.width;      // 0 ~ 1
            var py = (e.clientY - rect.top) / rect.height;

            var rx = (0.5 - py) * MAX * 2;      // 上下移动 → 绕 X 轴转
            var ry = (px - 0.5) * MAX * 2;      // 左右移动 → 绕 Y 轴转

            card.style.transform =
                'rotateX(' + rx.toFixed(2) + 'deg) rotateY(' + ry.toFixed(2) + 'deg) scale(1.02)';

            // 眩光跟着鼠标滑动
            card.style.setProperty('--gx', (px * 100).toFixed(1) + '%');
            card.style.setProperty('--gy', (py * 100).toFixed(1) + '%');
        });

        stage.addEventListener('mouseleave', function () {
            card.style.transform = 'rotateX(0deg) rotateY(0deg) scale(1)';
        });
    }

    /* ========================================================
       3. 小角色：眼球跟随 + 眨眼 + 聚焦密码框时捂眼
          （Peek-Free-Login 的"防偷看"交互）
       ======================================================== */
    var guard = document.getElementById('guard');
    var pupils = document.querySelectorAll('.guard .pupil');
    var passwordInputs = document.querySelectorAll('input[type=password]');
    var usernameInput = document.querySelector('input[name=username]');

    if (guard) {
        // 瞳孔跟着鼠标转
        window.addEventListener('mousemove', function (e) {
            var rect = guard.getBoundingClientRect();
            var cx = rect.left + rect.width / 2;
            var cy = rect.top + rect.height / 2;
            var dx = e.clientX - cx;
            var dy = e.clientY - cy;
            var len = Math.sqrt(dx * dx + dy * dy) || 1;
            var max = 3.5;          // 瞳孔最多偏移 3.5px
            var ox = dx / len * max;
            var oy = dy / len * max;
            for (var i = 0; i < pupils.length; i++) {
                pupils[i].style.transform = 'translate(' + ox.toFixed(2) + 'px,' + oy.toFixed(2) + 'px)';
            }
        });

        // 随机眨眼
        (function blink() {
            setTimeout(function () {
                guard.classList.add('blink');
                setTimeout(function () { guard.classList.remove('blink'); }, 150);
                blink();
            }, 2000 + Math.random() * 3000);
        })();

        // 聚焦密码框 → 捂眼；失焦 → 放下手
        for (var k = 0; k < passwordInputs.length; k++) {
            passwordInputs[k].addEventListener('focus', function () { guard.classList.add('peek'); });
            passwordInputs[k].addEventListener('blur',  function () { guard.classList.remove('peek'); });
        }

        // 输入账号时角色精神一下
        if (usernameInput) {
            usernameInput.addEventListener('input', function () {
                if (this.value) { guard.classList.add('up'); } else { guard.classList.remove('up'); }
            });
        }
    }

    /* ========================================================
       4. 登录成功页：彩带庆祝 + 自动返回倒计时
          （页面上没有对应元素时自动跳过，不影响其他页面）
       ======================================================== */
    var fx = document.getElementById('fx');

    if (fx && fx.getContext) {
        var fctx = fx.getContext('2d');
        var COLORS = ['#00e5ff', '#7c4dff', '#ff2d95', '#ffd166', '#8affc1', '#ffffff'];
        var pieces = [];
        var running = false;

        function sizeFx() {
            fx.width = window.innerWidth;
            fx.height = window.innerHeight;
        }
        sizeFx();
        window.addEventListener('resize', sizeFx);

        function burst(cx, cy) {
            for (var i = 0; i < 140; i++) {
                var ang = Math.random() * Math.PI * 2;
                var sp  = 4 + Math.random() * 8;
                pieces.push({
                    x: cx,
                    y: cy,
                    vx: Math.cos(ang) * sp,
                    vy: Math.sin(ang) * sp - 3,         // 稍微向上抛一点
                    w: 5 + Math.random() * 6,
                    h: 9 + Math.random() * 8,
                    rot: Math.random() * Math.PI,
                    vr: (Math.random() - 0.5) * 0.35,
                    color: COLORS[(Math.random() * COLORS.length) | 0],
                    life: 1
                });
            }
            if (!running) {
                running = true;
                requestAnimationFrame(step);
            }
        }

        function step() {
            fctx.clearRect(0, 0, fx.width, fx.height);

            for (var i = pieces.length - 1; i >= 0; i--) {
                var p = pieces[i];
                p.vy += 0.22;               // 重力
                p.vx *= 0.99;               // 空气阻力
                p.vy *= 0.99;
                p.x += p.vx;
                p.y += p.vy;
                p.rot += p.vr;
                p.life -= 0.006;

                if (p.life <= 0 || p.y > fx.height + 40) {
                    pieces.splice(i, 1);
                    continue;
                }

                fctx.save();
                fctx.translate(p.x, p.y);
                fctx.rotate(p.rot);
                fctx.globalAlpha = Math.max(p.life, 0);
                fctx.fillStyle = p.color;
                fctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
                fctx.restore();
            }

            if (pieces.length) {
                requestAnimationFrame(step);
            } else {
                running = false;
                fctx.clearRect(0, 0, fx.width, fx.height);
            }
        }

        // 页面加载完，从打勾图标的位置炸开
        window.addEventListener('load', function () {
            var tick = document.querySelector('.tick');
            if (tick) {
                var r = tick.getBoundingClientRect();
                burst(r.left + r.width / 2, r.top + r.height / 2);
            } else {
                burst(window.innerWidth / 2, window.innerHeight / 2);
            }
        });
    }

    // 倒计时自动返回登录页；用户一操作就取消
    var countEl = document.getElementById('count');
    if (countEl) {
        var left = 10;
        var timer = setInterval(function () {
            left--;
            if (left <= 0) {
                clearInterval(timer);
                window.location.href = 'index.jsp';
                return;
            }
            countEl.textContent = left + ' 秒后自动返回登录页…';
        }, 1000);

        function cancelCount() {
            clearInterval(timer);
            countEl.textContent = '已取消自动返回，可点下方链接';
        }
        document.addEventListener('click', cancelCount, { once: true });
        document.addEventListener('keydown', cancelCount, { once: true });
    }
})();
