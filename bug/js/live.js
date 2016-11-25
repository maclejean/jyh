$(function () {
    'use strict';
    isLogin(function (user) {
        classifyTag(user);
        gwcTrigger(user);
        liveShow(user);
    });
});
