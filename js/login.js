$(function () {
    if ($.cookie('autoLogin')) {
        if ($.cookie('autoLogin').length != 0) {
            var obj = JSON.parse($.cookie('autoLogin'));
            $('.username').find('input').val(obj["name"]);
            $('.pwd').find('input').val(obj["pwd"]);
        }

    }
//登录按钮
    $('#loginBtn').click(function () {
        var userId = $('.username').find('input').val().trim();
        var pwd = $('.pwd').find('input').val().trim();
        var isExist = false;
        var jsonHas = false;
        if (userId.length == 0 || pwd.length == 0) {
            confirm('任何信息录入不完全');
        }
        else {
            //先匹配检测,再跳转到首页
            //判断是否在json中
            $.ajax({
                url: '../json/register.json',
                async: false,
                success: function (res) {
                    $.each(res, function (index, data) {
                        if (data["id"] == userId) {
                            jsonHas = true;
                            if (pwd == data["pwd"]) {
                                if ($('.cookieSave :checkbox').prop('checked')) {
                                    var obj = {
                                        "name": userId,
                                        "pwd": pwd
                                    };
                                    $.cookie('autoLogin', JSON.stringify(obj), {
                                        expires: 30,
                                        path: '/'
                                    });
                                }
                                var nice = confirm('登陆成功');
                                if (nice) {
                                    location.href = "../html/index.html?user=" + userId;
                                } else {
                                    location.href = "../html/index.html?user=" + userId;
                                }

                            } else {
                                alert('密码错误');
                            }

                        }
                    })
                }
            });
            //判断是否存在
            if (!jsonHas) {
                var arr = $.cookie('users') ? JSON.parse($.cookie('users')) : [];
                for (var i = 0; i < arr.length; i++) {
                    if (arr[i]['id'] == userId) {
                        isExist = true;
                        if (arr[i]['pwd'] == pwd) {
                            if ($('.cookieSave :checkbox').prop('checked')) {
                                var obj = {
                                    "name": userId,
                                    "pwd": pwd
                                };
                                $.cookie('autoLogin', JSON.stringify(obj), {
                                    expires: 30,
                                    path: '/'
                                });
                            }
                            if (confirm("登录成功,点击跳转至首页")) {
                                location.href = "index.html?user=" + userId;
                            }
                        } else {
                            alert('密码错误');
                        }
                    }

                }
            }
            if (!isExist && !jsonHas) {
                if (confirm('您尚未注册!')) {
                    location.href = "../html/register.html";
                }

            }
        }
    });
});

