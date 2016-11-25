$(function () {
    'use strict';
    isLogin(function (user) {
        classifyTag(user);
        gwcTrigger(user, function () {
            gwcShow(user)
        });
        gwcShow(user);
        $('#keepShopping').click(function () {
            location.href = '../html/index.html?user=' + user;
        });
        $('#delAll').click(function () {
            var makeSure=confirm("确定清空您的购物车?");
            if(makeSure){
                $('.gwc-item-del').trigger('click');
            }else{
               return false;
            }

        });
        $('#checkOut').click(function () {
            var str = "￥ " + $('#money>b').html().trim();
            $('#payMoney').html(str);
            $('#tel>b').html(user);
            $('#wrapOut').css({
                display: "block"
            }).stop().animate({
                width: 500,
                height: 500
            }, 600, function () {
                $('#wrapOut').css({
                    display: "none",
                    width: "100%",
                    height: "100%"
                });
                $('#wrapIn').fadeIn(function () {
                    $.cookie(user + 'gwc', '', {
                        expires: 0,
                        path: "/"
                    })
                })
            });
        });
    });
});
