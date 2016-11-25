$(function () {
    'use strict';
    isLogin(function (user) {
        classifyTag(user);
        gwcTrigger(user);
        detailShow(user);
        $('#wrap-go').click(function () {
            $('#wrapIn').stop().fadeOut(function () {
                location.href = '../html/gwc.html?user=' + user;
            });
        });
    });
    //弹出框内按钮功能实现
    $('#wrap-on').click(function () {
        $('#wrapIn').stop().fadeOut('fast');
        $('#wrap').stop().fadeOut('fast')
    });
    $('#wrap').click(function () {
        $('#wrap-on').trigger('click');
    });
    $('#prev').click(function () {
        ($('.img-little li.active').prev().trigger('click'));
    });
    $('#next').click(function () {
        ($('.img-little li.active').next().trigger('click'));
    })

});
