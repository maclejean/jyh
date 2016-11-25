$(function () {
    'use strict';
    isLogin(function (user) {
        classifyTag(user);
        gwcTrigger(user);
        listShow(user, 10);
        $('.tags>span').click(function () {
            $(this).addClass('active');
            $('.tags li').removeClass('active');
            $('.pageBtn ul>li').eq(0).trigger('click');
        });
        $('.tags>b').click(function () {
            $('.tags>span').trigger('click');
        })
    });
});
