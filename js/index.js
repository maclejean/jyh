$(function () {
    'use strict';
    isLogin(function (user) {
        indexShow(user);
        gwcTrigger(user);
    });
});

