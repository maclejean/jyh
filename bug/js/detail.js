$(function () {
    'use strict';
    isLogin(function (user) {
        classifyTag(user);
        gwcTrigger(user);
        detailShow(user);
        //弹出框内按钮功能实现
        $('#wrap-on').click(function () {
            $('#wrapIn').fadeOut();
        });
        $('#wrap-go').click(function () {
            $('#wrapIn').fadeOut(function () {
                location.href = '../html/gwc.html?user=' + user;
            });

        });
        $('#prev').click(function () {
            ($('.img-little li.active').prev().trigger('click'));
        });
        $('#next').click(function () {
            ($('.img-little li.active').next().trigger('click'));
        })
    });

});
