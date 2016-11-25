$(function () {
    'use strict';
    var telResult = false;
    $('#tel').blur(function () {
        var txt = $(this).val().trim();
        var isExist = false;
        //与注册帐号json内已经存在的id查重
        $.get('../json/register.json', function (res) {
            $.each(res, function (index, data) {
                if (data["id"] == txt) {
                    if (confirm('手机号已经注册过')) {
                        location.href = "../html/login.html";
                        isExist = true;
                    }
                }
            })
        });
        //与本地cookie判断是否存在

        if (!isExist) {
            var reg = /^1[3578]\d{9}$/g;
            if (reg.test(txt)) {
                telResult = true;
                $(this).val(txt);
                $(this).parent().find(".msg").html('');
            } else {
                $(this).parent().find(".msg").html('手机号有误');
            }
        }
    });
    //密码验证
    var pwdResult = false;
    $('#pwd').blur(function () {
        var txt = $(this).val().trim();
        var reg = /^\w{6,30}$/g;
        if (reg.test(txt)) {
            $(this).val(txt);
            $(this).parent().find(".msg").html('');
        } else {
            $(this).parent().find(".msg").html("密码有误");
        }
    });
    ////密码确认
    $('#pwd2').blur(function () {
        var txt = $(this).val().trim();
        if (txt == $("#pwd").val()) {
            pwdResult = true;
            $(this).parent().find(".msg").html('');
        } else {
            $(this).parent().find(".msg").html("两次密码不一致");
        }
    });
    //验证码生成
    $("#regCode").html(Math.random().toString().slice(2, 6));
    $("#changeCode").click(function () {
        $("#regCode").html(Math.random().toString().slice(2, 6));
    });
    //验证码验证
    var codeResult = false;
    $('#code').blur(function () {
        var txt = $(this).val().trim();
        if (txt == $("#regCode").html().trim()) {
            codeResult = true;
        }
        else {
            $(this).parent().find(".msg").html("验证码不正确");
        }
    });
    //注册功能
    $('#regBtn').click(function () {
        //是否同意条款
        var isAgree = $('#isAgree').prop("checked");
        if (!isAgree) {
            $('#isAgree').parent().find('.msg').html('同意条款方可注册');
        }else if (isAgree && codeResult && pwdResult && telResult) {
            var isExist = false;
            var arr = $.cookie('users') ? JSON.parse($.cookie('users')) : [];
            for (var i = 0; i < arr.length; i++) {
                if (arr[i]["id"] == $('#tel').val()) {
                    isExist = true;
                    if(confirm('手机号已经注册过,请直接登录')){
                        location.href='../html/login.html';
                    }else{
                        location.href='../html/login.html';
                    }

                }
            }
            if (!isExist) {
                var obj = {
                    "id": $('#tel').val(),
                    "pwd": $('#pwd').val()
                };
                arr.push(obj);
                $.cookie('users', JSON.stringify(arr), {
                    expires: 30,
                    path: '/'
                });
                if(confirm('注册成功,请直接登录')){
                    location.href='../html/login.html';
                }else{
                    location.href='../html/login.html';
                }
            }

        }
    })
});