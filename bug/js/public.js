// 登录状态判断
function isLogin(fn) {
    //申明一个空的用户
    var user = '';
    var msg = (decodeURIComponent(location.search)).replace("?", '');
    var arr = msg.split("&");
    for (var u = 0; u < arr.length; u++) {
        var arr2 = arr[u].split("=");
        if (arr2[0] == "user" && arr2[1]) {
            user = arr2[1];
            $('.status').append("<a href=" + "../html/gwc.html?user=" + user + ">" + user + "</a><a href='../html/index.html'>退出</a>");
            $('#logoIndex').prop('href', 'index.html?user=' + user);
            $('#logoIndex2').prop('href', 'index.html?user=' + user);
            $('.live').prop('href', 'live.html?user=' + user);
            $('#logoIndex3').prop('href', 'index.html?user=' + user);
        }
    }
    if (!user) {
        $('.status').append("<a href=" + "../html/login.html" + ">【登录】</a><a href=" + "../html/register.html" + ">【注册】</a>");
    }
    if (fn) {
        fn(user);
    }
}
//分类标签生成
function classifyTag(user) {
    $.ajax({
        "url": "../json/index.json",
        "success": function (res) {
            if (res["classify"]) {
                var tags = res["classify"];
                var n = tags.length;
                var liWidth = Math.floor(100 / n) + '%';
                $.each(tags, function (index, data) {
                    $('<li/>').append($('<a/>').prop('href', 'list.html?user=' + user + "&type=" + data['type']).text(data['text'])).width(liWidth).appendTo($('.nav-shopping>.center').find('ul'))
                })
            }
        }
    });
}
//小购物车添加
function gwc(user, fn) {
    var gwcStr = $.cookie(user + 'gwc');
    if (gwcStr) {
        var arr = JSON.parse(gwcStr);
        if (arr.length >= 1) {
            $('#cart-btn').css('display', 'block');
            $('#cart>ul').html('');
            $.each(arr, function (index, data) {
                var str = $('<li><i class="proNum" style="display: none">' + data["productNum"] + '</i><img src=' + data["img"] + '><p class="clearFix"><span class="list-title">' + data["title"] + '</span><span class="list-num-price"><span class="list-price">￥' + data["discount"] + '</span><span class="list-num">X' + data["num"] + '</span></span></p><p class="list-style-color"><span class="list-style">' + data["style"] + '</span><span class="list-color">' + data["color"] + '</p></li>');
                //删除按钮的功能
                var delSpan = $('</span><span class="list-del">删除</span>').click(function () {
                    arr.splice(index, 1);
                    $.cookie(user + 'gwc', JSON.stringify(arr), {
                        expires: 30,
                        path: '/'
                    });
                    $(this).parent().parent().remove();
                    $('.gwc-all-num').html($('#cart li').length);
                    sumMoney2($('.list-price'), $('.list-num'));
                    if ($('.gwc-all-num').html() == 0) {
                        $('#cart-btn').css('display', 'none');
                        $('#cart>ul').html('<h1 style="text-align: center;margin-top: 40px">购物车为空</h1>');
                    }
                    $('#cart-trigger').trigger('mouseenter');
                    if (fn) {
                        fn();
                    }
                });
                delSpan.appendTo(str.find('.list-style-color'));
                $('#cart>ul').append(str);
                $('.gwc-all-num').html($('#cart li').length);

            });
        } else {
            $('#cart-btn').css('display', 'none');
            $('#cart>ul').html('<h1 style="text-align: center;margin-top: 40px">购物车为空</h1>');
        }
        sumMoney2($('.list-price'), $('.list-num'))
    } else {
        $('#cart-btn').css('display', 'none');
        $('#cart>ul').html('<h1 style="text-align: center;margin-top: 40px">购物车为空</h1>');
    }
}
//trigger
function gwcTrigger(user, fn) {
    if ($.cookie(user + 'gwc')) {
        var l = JSON.parse($.cookie(user + 'gwc')).length;
        $('.gwc-all-num').html(l);
    }
    //设置 购物车触发事件
    $('#cart-trigger').hover(function () {
        $('#cart').stop().show();
        gwc(user, fn);
    }, function () {
        $('#cart').stop().hide();
    });
    $('#cart').hover(function () {
        $('#cart').stop().show();
    }, function () {
        $('#cart').stop().hide();
    });
//点击结算或者购物车文字跳转至购物车页面
    $('#cart-trigger').click(function () {
        location.href = "../html/gwc.html?user=" + user;
    });
    $('#gwc-btn').click(function () {
        location.href = "../html/gwc.html?user=" + user;
    });

//设置右侧appcode和微信code的移入移出事件
    $('#appCode').hover(function () {
        $(this).find('.trigger-appCode').stop().fadeIn('fast')
    }, function () {
        $(this).find('.trigger-appCode').stop().fadeOut('fast')
    });
    $('#msgCode').hover(function () {
        $(this).find('.trigger-msgCode').stop().fadeIn('fast')
    }, function () {
        $(this).find('.trigger-msgCode').stop().fadeOut('fast')
    });
}
//轮播
function carousel() {
    var num = 0;
    var timer = setInterval(function () {
        num += 1;
        move();
    }, 2500);

    $('.banner').hover(function () {
        clearInterval(timer);
    }, function () {
        timer = setInterval(function () {
            num += 1;
            move();
        }, 2500);
    });

    function move() {
        if (num > $('.carousel>li').length - 1) {
            num = 0;
        }
        $('.carousel-btn>span').removeClass('active').eq(num).addClass('active');
        $('.carousel li').each(function () {
            if (num == $(this).index()) {
                $('.carousel').find('li').eq(num).stop().animate({'opacity': 1});
            }
            else {
                $('.carousel').find('li').eq($(this).index()).stop().animate({'opacity': 0});

            }
        });
    }

    $('.carousel-btn>span').click(function () {
        num = $(this).index();
        move();
    })
}
//列表页面加载
function listShow(user, count) {
    var msg = (decodeURIComponent(location.search)).replace('?', '');
    var arr = msg.split("&");
    var type = "";
    var no = "";
    for (var n = 0; n < arr.length; n++) {
        var arr2 = arr[n].split('=');
        if (arr2[0] == "type") {
            type = arr2[1];
        }
        if (arr2[0] == "No") {
            no = arr2[1]
        }
        if (arr2[0] == "user") {
            user = arr2[1];
        }
    }
    $.get('../json/products.json', function (res) {
        $.each(res, function (index, data) {
            if (type == data["type"]) {
                $('title').html(data['classify'] + '-商品列表');
                var classify = data['list'];
                if (data["tags"]) {
                    $('.tags ul').html('');
                    for (var t = 0; t < data["tags"].length; t++) {
                        var tagBtn = $('<li>' + data["tags"][t] + '</li>').click(function () {
                            $('.tags>span').removeClass('active');
                            $('.tags li').removeClass('active').eq($(this).index()).addClass('active');
                            $('.pageBtn ul>li').eq(0).trigger('click');
                        });
                        $('.tags ul').append(tagBtn)
                    }
                }
                changePage(0, (count < classify.length) ? count : classify.length, '全部');
                //上一页下一页功能
                $('#prev').click(function () {
                    $('.pageBtn ul li.active').prev().trigger('click');
                });
                $('#next').click(function () {
                    $('.pageBtn ul li.active').next().trigger('click');
                });
                //翻页
                function changePage(n, m, tag) {
                    $('.product-list>ul').html('');
                    if (tag != '全部') {
                        var arrTag = [];
                        //拿到这些标签的元素
                        $.each(classify, function (index, data) {
                            if (data['tag'] == tag) {
                                arrTag.push(data)
                            }
                        });
                        pageBtn(arrTag);
                        $('.pageBtn ul>li').removeClass('active').eq(n).addClass('active');
                        for (var j = n * count; j < m; j++) {
                            if (m >= arrTag.length) {
                                m = arrTag.length;
                            }
                            var strTag = "<li><a title=" + arrTag[j]["title"] + " href=../html/detail.html?user=" + user + "&type=" + type + "&No=" + arrTag[j]["productNum"] + ">";
                            strTag += "<img src=" + arrTag[j]["img"][0] + "/>";
                            strTag += '<div class="name-price"><span class="product-name">' + arrTag[j]["title"] + '</span><p class="product-price">';
                            strTag += "￥" + arrTag[j]['discount'] + "</p></div></a></li>";
                            $('.product-list>ul').append(strTag);
                        }
                    } else {
                        pageBtn(classify);
                        $('.pageBtn ul>li').removeClass('active').eq(n).addClass('active');
                        for (var i = n * count; i < m; i++) {
                            if (m >= classify.length) {
                                m = classify.length;
                            }
                            var str = "<li><a title=" + classify[i]["title"] + " href=../html/detail.html?user=" + user + "&type=" + type + "&No=" + classify[i]["productNum"] + ">";
                            str += "<img src=" + classify[i]["img"][0] + "/>";
                            str += '<div class="name-price"><span class="product-name">' + classify[i]["title"] + '</span><p class="product-price">';
                            str += "￥" + classify[i]['discount'] + "</p></div></a></li>";
                            $('.product-list>ul').append(str);
                        }
                    }
                }

                //添加翻页功能每页20张
                function pageBtn(obj) {
                    var page = Math.ceil(obj.length / count);
                    $('.pageBtn ul').html('');
                    for (var n = 0; n < page; n++) {
                        var btn = $('<li/>').click(function () {
                            var tag = $('.tags').find('.active').html().trim();
                            var m = count * ($(this).index() + 1);
                            changePage($(this).index(), m, tag)
                        }).text(n + 1);
                        $('.pageBtn ul').append(btn);
                    }
                }

            }
        })

    })


}
//详情页加载
function detailShow(user) {
    // 根据location.search找到数字编码及分类信息
    var msg = (decodeURIComponent(location.search)).replace('?', '');
    var arr = msg.split("&");
    var type = "";
    var no = "";
    for (var n = 0; n < arr.length; n++) {
        var arr2 = arr[n].split('=');
        if (arr2[0] == "type") {
            type = arr2[1];
        }
        if (arr2[0] == "No") {
            no = arr2[1]
        }
        if (arr2[0] == "user") {
            user = arr2[1];
        }
    }
    $.get('../json/products.json', function (res) {
        $.each(res, function (index, data) {
            if (data["type"] == type) {
                $('.location-indicate').append('<a href=' + 'list.html?user=' + user + '&type=' + type + '> ' + data["classify"] + '</a>');
                $('.txtArea-others').css('display', 'block');
                var getNews = data["list"];
                for (var i = 0; i < getNews.length; i++) {
                    if (getNews[i]["productNum"] == no) {
                        var _this = getNews[i];
                        $('title').html(_this['title']);
                        if (_this["tag"]) {
                            $('.location-indicate').append('<span> /' + _this["tag"] + '</span>');
                        }
                        $('.location-indicate').append('<span> /' + _this["title"] + '</span>');
                        //便利出需要的信息
                        for (var j = 0; j < _this['img'].length; j++) {
                            var str = '<li><img src=' + _this["img"][j] + ' title=' + _this["title"] + '></li>';
                            $('.img-little>ul').append(str);
                        }
                        //添加小图点击切换大图的功能
                        $('.img-little>ul>li').click(function () {
                            $('.img-little>ul>li').removeClass('active').eq($(this).index()).addClass('active');
                            var src = $('.img-little li.active').find('img').attr('src');
                            $('.img-big').find('img').prop('src', src);
                            $("#zoom-big").find('img').prop('src', src);
                        }).first().addClass('active');
                        var src = $('.img-little li.active').find('img').prop('src');
                        $("#zoom-big").find('img').prop('src', src);
                        //让小图片与大图片对应
                        $('.img-big').mousemove(function (e) {
                            //产生放大镜功能
                            var width = $(".img-big").width() * $("#zoom-big").width() / $("#zoom-big").find('img').width();
                            var height = $(".img-big").height() * $("#zoom-big").height() / $("#zoom-big").find('img').height();
                            $('#zoom-little').width(width);
                            $('#zoom-little').height(height);
                            var scale = $("#zoom-big").width() / $('#zoom-little').width();

                            var left = e.pageX - $(".img-big").offset().left - $('#zoom-little').width() / 2;
                            var top = e.pageY - $(".img-big").offset().top - $('#zoom-little').height() / 2;
                            if (left < 0) {
                                left = 0
                            } else if (left >= $(".img-big").width() - $('#zoom-little').width()) {
                                left = $(".img-big").width() - $('#zoom-little').width();
                            }
                            if (top < 0) {
                                top = 0;
                            } else if (top >= $(".img-big").height() - $('#zoom-little').height()) {
                                top = $(".img-big").height() - $('#zoom-little').height();
                            }

                            $('#zoom-little').stop().show().css({
                                left: left,
                                top: top
                            });
                            $('#zoom-big').stop().show().find('img').css({
                                left: -scale * left,
                                top: -scale * top
                            })

                        }).mouseleave(function () {
                            $('#zoom-little').stop().hide();
                            $('#zoom-big').stop().hide();

                        }).append("<img src=" + src + "/>");
                        var tlt = '<h2 class="txtArea-title">' + _this["title"] + '<span>' + _this["subhead"] + "</span></h2>";
                        $('.txtArea').prepend(tlt);
                        var priceMsg = "<h2>￥" + _this["discount"] + "<span>￥" + _this["price"] +
                            "</span></h2><p><span>赠送积分</span>" + _this["credits"] + "积分</p><p>" +
                            "<span>商品编号</span>" + _this["productNum"] + "</p><p><span>累计售出</span>" + _this["sales"] + "件</p><p><span class='gift'>赠品</span>" + (_this["present"] ? _this["present"] : "无") + "</p>";
                        $('.txtArea-price').append(priceMsg);
                        if (_this["color"]) {
                            $.each(_this["color"], function (index, data) {
                                $('#color').append("<span>" + data + "</span>").find('span').click(function () {
                                    $('#color').find('span').removeClass('active').eq($(this).index()).addClass('active');
                                }).eq(0).addClass('active');

                            })
                        } else {
                            $('#color').append("<span class='active'>共同</span>")
                        }
                        if (_this["style"]) {
                            $.each(_this["style"], function (index, data) {
                                $('#style').append("<span>" + data + "</span>").find('span').click(function () {
                                    $('#style').find('span').removeClass('active').eq($(this).index()).addClass('active');
                                }).eq(0).addClass('active');

                            })
                        } else {
                            $('#style').append("<span class='active'>共同</span>")
                        }
                        var xqMsg = _this["specification"];
                        for (var n = 0; n < xqMsg.length; n++) {
                            var str1 = "<li><span>" + xqMsg[n][0] + ":</span><span>" + xqMsg[n][1] + "</span></li>";
                            $('.detail-up>ul').append(str1);
                            var str2 = "<tr><td class='tlt'>" + xqMsg[n][0] + "</td><td>" + xqMsg[n][1] + "</td></tr>";
                            $('.cs tbody').append(str2);
                        }
                        //详情大组图
                        for (var m = 0; m < _this["xqImg"].length; m++) {
                            var str3 = "<dd><img src=" + _this["xqImg"][m] + "></dd>";
                            $('.detail-down>dl').append(str3);
                        }
                        for (var k = 0; k < _this["afterSale"].length; k++) {
                            var str4 = "<li>" + (k + 1) + ")" + _this["afterSale"][k] + "</li>";
                            $('.sh').find('ul').append(str4);
                        }
                        $('.btns').append("<button id='buyNow'>立即购买</button><button id='pushGwc'>加入购物车</button>").find('button').eq(1).click(function () {
                            $('#wrapOut').css({
                                display: "block"
                            }).stop().animate({
                                width: 420,
                                height: 220
                            }, 600, function () {
                                $('#wrapOut').css({
                                    display: "none",
                                    width: "100%",
                                    height: "100%"
                                });
                                $('#wrapIn').fadeIn()
                            });
                            //点击加入购物车功能实现
                            var arr = $.cookie(user + 'gwc') ? JSON.parse($.cookie(user + 'gwc')) : [];
                            var num = parseInt($('#num').val());
                            var isExist = false;
                            for (var i = 0; i < arr.length; i++) {
                                if (arr[i]["productNum"] == _this["productNum"]) {
                                    //如果产品编号相同,判断样式与颜色是否完全相同
                                    if (arr[i]["color"] == $('#color>span.active').html().trim() && arr[i]["style"] == $('#style>span.active').html().trim()) {
                                        arr[i]["num"] += num;
                                        isExist = true;
                                    }


                                }
                            }
                            if (!isExist) {
                                var obj = {
                                    "productNum": _this["productNum"],
                                    "title": _this['title'],
                                    "type": _this["type"],
                                    "discount": _this["discount"],
                                    "num": num,
                                    "img": _this["img"][0],
                                    "style": $('#style').find('.active').text().trim(),
                                    "color": $('#color').find('.active').text().trim()
                                };
                                arr.push(obj);
                                $('.gwc-all-num').html(arr.length);

                            }
                            $.cookie(user + 'gwc', JSON.stringify(arr), {
                                expires: 30,
                                path: '/'
                            });
                        });
                        $('#buyNow').click(function () {
                            $('#pushGwc').trigger('click');
                            location.href = '../html/gwc.html?user=' + user;
                        })

                    }
                }
            }
        })
    });
    // 商品详情及售后tab切换
    $('.detail>h2 span:eq(1)').click(function () {
        $('.detail-content').find('.cs').show();
        $('.detail-content').find('.xq').hide();
        $('.detail-content').find('.sh').hide();
        $('.detail>h2 span').removeClass('active').eq($(this).index()).addClass('active');
    });
    $('.detail>h2 span:eq(0)').click(function () {
        $('.detail-content').find('.xq').show();
        $('.detail-content').find('.cs').hide();
        $('.detail-content').find('.sh').hide();
        $('.detail>h2 span').removeClass('active').eq($(this).index()).addClass('active');

    });
    $('.detail>h2 span:eq(2)').click(function () {
        $('.detail-content').find('.sh').show();
        $('.detail-content').find('.xq').hide();
        $('.detail-content').find('.cs').hide();
        $('.detail>h2 span').removeClass('active').eq($(this).index()).addClass('active');

    });
    $('.more-info').click(function () {
        $('.detail>h2 span:eq(1)').trigger('click');
    });
    //加减数量按钮
    $('#minus').click(function () {
        if (parseInt($('#num').val()) <= 1) {
            $('#num').val(1);
        } else {
            ($('#num').val((parseInt($('#num').val()) - 1)));
        }
    });
    $('#plus').click(function () {
        ($('#num').val((parseInt($('#num').val()) + 1)));
    });
}
//主页主内容加载
function indexShow(user) {
    $.ajax({
        "url": "../json/index.json",
        "success": function (res) {
            //首页标签导航加载
            if (res["classify"]) {
                var tags = res["classify"];
                var n = tags.length;
                var liWidth = Math.floor(100 / n) + '%';
                $.each(tags, function (index, data) {
                    $('<li/>').append($('<a/>').prop('href', '../html/list.html?user=' + user + "&type=" + data['type']).text(data['text'])).width(liWidth).appendTo($('.nav-shopping>.center').find('ul'))
                })
            }
            //首页轮播banner加载
            if (res['banner']) {
                var banners = res['banner'];
                for (var i = 0; i < banners.length; i++) {
                    var aNode = $('<a></a>').prop('href', '#').append('<img src=' + banners[i]['url'] + '/>');
                    var liNode = $('<li/>').append(aNode).appendTo($('.banner>.carousel'));
                    var btnNode = $('<span/>').appendTo($('.banner>.carousel-btn'));
                }
                $('.carousel-btn>span').first().addClass('active');
                $('.carousel>li').first().css('opacity', 1);
            }
            //轮播函数
            carousel();
            //公告加载
            if (res["notice"]) {
                $.each(res["notice"], function (index, data) {
                    $('.announcement').append('<p>' + data + '</p>')
                })
            }
            //主内容第一行
            if (res["row1"]) {
                var pic = res["row1"];
                $.each(pic, function (index, data) {
                    if (data["position"]) {
                        var str = "<li><a href=" + '../html/list.html?user=' + user + "&type=" + data['type'] + "><img src=" + data["src"] + " title=" + data["title"] + "></a></li>";
                        $('.pic-list-row-1>ul').prepend(str)
                    } else {
                        str = "<li><a href=" + '../html/list.html?user=' + user + "&type=" + data['type'] + "><img src=" + data["src"] + " title=" + data["title"] + "></a></li>";
                        $('.pic-list-row-1>ul').append(str);
                    }
                })
            }
            //主内容第二行
            if (res["row2"]) {
                var pic1 = res["row2"];
                $.each(pic1, function (index, data) {
                    var str = "<li><a href=" + '../html/list.html?user=' + user + "&type=" + data['type'] + "><img src=" + data["src"] + " title=" + data["title"] + "></a></li>";
                    $('.pic-list-row-2>ul').append(str);
                })
            }
            //主内容第三行
            if (res["row3"]) {
                var pic2 = res["row3"];
                $.each(pic2, function (index, data) {
                    if (data["position"]) {
                        var str = "<li><a href=" + '../html/list.html?user=' + user + "&type=" + data['type'] + "><img src=" + data["src"] + " title=" + data["title"] + "></a></li>";
                        $('.pic-list-row-3>ul').prepend(str)
                    } else {
                        str = "<li><a href=" + '../html/list.html?user=' + user + "&type=" + data['type'] + "><img src=" + data["src"] + " title=" + data["title"] + "></a></li>";
                        $('.pic-list-row-3>ul').append(str);
                    }
                })
            }
            //今日特卖
            if (res["today"]) {
                var todayForsale = res["today"];
                for (var j = 0; j < todayForsale.length; j++) {
                    $('.today-forsale ul').append("<li><a href=" + '../html/detail.html?user=' + user + "&type=" + todayForsale[j]['type'] + "&No=" + todayForsale[j]["productNum"] + ">" + todayForsale[j]["title"] + "</a></li>")
                }
                upCarousel($('.today-forsale ul'));

            }
            //直播栏
            if (res["live"]) {
                var liveMsg = res["live"];
                $('.live-ctnLft>h3 .left-time').html(liveMsg[0]["time"]);
                $('.live-ctnLft>h3 .left-title').html(liveMsg[0]["title"]);
                $('.live-ctnLft>h3 .left-discount').html(liveMsg[0]["discount"]);
                $('.live-ctnLft>h3 .left-price').html(liveMsg[0]["price"]);
                $('.live-ctnLft').append("<a href=" + "../html/detail.html?user=" + user + "&type=" + liveMsg[0]['type'] + "&No=" + liveMsg[0]["productNum"] + "><img src=" + liveMsg[0]["img"][0] + " title=" + liveMsg[0]["title"] + "></a>");
                for (var num = 1; num < 4; num++) {
                    var str = "<li><a title=" + liveMsg[num]["title"] + " href=" + "../html/detail.html?user=" + user + "&type=" + liveMsg[num]["type"] + "&No=" + liveMsg[num]["productNum"] + ">";
                    str += "<img src=" + liveMsg[num]["img"][0] + "><div class='name-price'><span class='name'>" + liveMsg[num]["title"] + "</span><p class='price'>￥" + liveMsg[num]["discount"] + "</p><span class='time'>" + liveMsg[num]["time"] + "</span></div></a></li>";
                    $('.live-ctnRgt').append(str);
                }
            }

        }
    });
//设置主页轮播图今日特价位置
    $('.today-forsale').css('right', $('.center:first').offset().left);
}
//直播页加载
function liveShow(user) {
    //加载需要直播的对象
    $.ajax({
        url: "../json/index.json",
        "success": function (res) {
            var liveList = res['live'];
            $.each(liveList, function (index, data) {
                var str = "<li><a title=" + data["title"] + " href=" + "../html/detail.html?user=" + user + "&type=" + data["type"] + "&No=" + data["productNum"] + ">";
                str += "<img src=" + data["img"][0] + "><div class='name-price'><span class='name'>" + data["title"] + "</span><p class='price'>￥" + data["discount"] + "</p><span class='time'>" + data["time"] + "</span></div></a></li>";
                $(".tv-list>ul").append(str);
                var str2 = '<li><a  title=' + data["title"] + ' href=' + "../html/detail.html?user=" + user + "&type=" + data["type"] + "&No=" + data["productNum"] + '><img src=' + data["img"][0] + '><p class="tlt">' + data["title"] + '</p><p>￥' + data["discount"] + '</p></a></li>';
                $('.tv-right ul').append(str2);

            });
            upCarousel($('.tv-right ul'));
            if ($('.tv-list>ul li').length > 5) {
                tvShow();
            }
        }
    });
    //设置 购物车触发时改变内容事件
    $('.cartWrap').hover(function () {
        $('#cart').stop().show();
        gwc(user);
    }, function () {
        $('#cart').stop().hide();
    });

    function tvShow() {
        var n = 0;
        var timer = setInterval(function () {
            n++;
            move();
        }, 2500);

        function move() {
            if (n >= $('.tv-list>ul li').length - 4) {
                n = 0;
                $('.tv-list>ul').stop().animate({
                    left: 0
                })
            }
            $('.tv-list>ul').stop().animate({
                left: -n * 242
            })
        }

        $('.prev').click(function () {
            if (n < 1) {
                n = $('.tv-list>ul li').length - 5;
                $('.tv-list>ul').stop().animate({
                    left: -($('.tv-list>ul li').length - 4) * 242
                })
            } else {
                n -= 1;
            }
            move();
        });
        $('.next').click(function () {
            n += 1;
            move();
        });
        $('.tv-list').hover(function () {
            clearInterval(timer);
        }, function () {
            clearInterval(timer);
            timer = setInterval(function () {
                n++;
                move();
            }, 2500);
        })
    }
}
//购物车页面加载
function gwcShow(user) {
    var arr = $.cookie(user + "gwc") ? JSON.parse($.cookie(user + "gwc")) : '';
    if (!arr || arr.length < 1) {
        $('.gwc').find('tbody').html('<h1>哎哟喂!您的购物车为空</h1>');
        $('.gwc-step').css('display', 'none');
        $('.gwc-tlt').css('display', 'none');
        $('.gwc-btn').css('display', 'none');
    } else {
        $('.gwc').find('tbody').html('');
        $('.gwc-step').css('display', 'block');
        $('.gwc-tlt').css('display', 'table-row');
        $('.gwc-btn').css('display', 'block');
        $.each(arr, function (index, data) {
            //遍出处购物车信息
            var str = '<tr><td class="pdId">' + data["productNum"] + '</td><td><img src=' + data["img"] + '><p><a href=' + '../html/detail.html?user=' + user + '&type=' + data["type"] + '&No=' + data["productNum"] + '>' + data["title"] + '</a></p><p><span class="style">' + data["style"] + '</span><span class="color">' + data["color"] + '</span></p></td><td class="gwc-list-price">￥' + data["discount"] + '</td><td><div class="btn-group"><a class="minus">-</a><input type="text" value=' + data["num"] + ' class="num" disabled><a class="plus">+</a></div></td><td class="gwc-item-del">删除</td></tr>';
            $('.gwc tbody').append(str);
        });
        sumMoney($('.gwc-list-price'), $('.num'));
        //加减按钮的功能
        $('.minus').click(function () {
            var num = parseInt($(this).next().val().trim());
            if (num <= 1) {
            } else {
                var proNum = $(this).parent().parent().siblings().eq(0).text().trim();
                var style = $(this).parent().parent().parent().find('.style').text().trim();
                var color = $(this).parent().parent().parent().find('.color').text().trim();
                $(this).next().val(num - 1);
                btnGwc({
                    productNum: proNum,
                    num: parseInt($(this).next().val().trim()),
                    style: style,
                    color: color
                });
            }
        });
        $('.plus').click(function () {
            var num = parseInt($(this).prev().val().trim());
            $(this).prev().val(num + 1);
            var proNum = $(this).parent().parent().siblings().eq(0).text().trim();
            var style = $(this).parent().parent().parent().find('.style').text().trim();
            var color = $(this).parent().parent().parent().find('.color').text().trim();
            btnGwc({
                productNum: proNum,
                num: parseInt($(this).prev().val().trim()),
                style: style,
                color: color
            });
        });
        function btnGwc(obj) {
            var arr = $.cookie(user + "gwc") ? JSON.parse($.cookie(user + "gwc")) : '';
            $.each(arr, function (index, data) {
                if (data['productNum'] == obj["productNum"] && data["style"] == obj["style"] && data["color"] == obj["color"]) {
                    data["num"] = obj["num"];
                    $.cookie(user + 'gwc', JSON.stringify(arr), {
                        expires: 30,
                        path: '/'
                    })
                }
            });
            sumMoney($('.gwc-list-price'), $('tbody .num'));
        }
        //删除按钮功能
        $('.gwc-item-del').click(function () {
            var arr = $.cookie(user + "gwc") ? JSON.parse($.cookie(user + "gwc")) : '';
            var proNum = $(this).siblings().eq(0).text().trim();
            var style = $(this).parent().find('.style').text().trim();
            var color = $(this).parent().find('.color').text().trim();
            for (var i = 0; i < arr.length; i++) {
                if (arr[i]['productNum'] == proNum && arr[i]["style"] == style && arr[i]["color"] == color) {
                    arr.splice(i, 1);
                    $.cookie(user + 'gwc', JSON.stringify(arr), {
                        expires: 30,
                        path: '/'
                    });
                    $(this).parent().remove();
                }
            }
            sumMoney($('.gwc-list-price'), $('.num'));

            //改变购物车数量指引
            if ($.cookie(user + 'gwc')) {
                var l = JSON.parse($.cookie(user + 'gwc')).length;
                $('.gwc-all-num').html(l);

            }
            if ($('.gwc tbody tr').length == 0) {
                $('.gwc').find('tbody').html('<h1>哎哟喂!您的购物车为空</h1>');
                $('.gwc-step').css('display', 'none');
                $('.gwc-tlt').css('display', 'none');
                $('.gwc-btn').css('display', 'none');

            }
        });
    }

}
//购物车页面计算总价
function sumMoney(iTargetPrice, iTargetNum) {
    var sum = 0;
    for (var i = 0; i < iTargetPrice.length; i++) {
        var price = parseFloat((iTargetPrice.eq(i).html().trim()).substring(1));
        var num = parseFloat(iTargetNum.eq(i).val() ? iTargetNum.eq(i).val() : iTargetNum.eq(i).html().trim().substring(1));
        sum += price * num;
    }
    var str = sum + '元';
    $('#money b').html(str);
}
//小购物车总价计算
function sumMoney2(iTargetPrice, iTargetNum) {
    var sum = 0;
    for (var i = 0; i < iTargetPrice.length; i++) {
        var price = parseFloat((iTargetPrice.eq(i).html().trim()).substring(1));
        var num = parseFloat(iTargetNum.eq(i).val() ? iTargetNum.eq(i).val() : iTargetNum.eq(i).html().trim().substring(1));
        sum += price * num;
    }
    var str = sum + '元';
    $('#gwc-all-price .sum-price').html(str);
}
//回到顶部
$(function () {
    //设置回到顶部功能
    $('#backTop').click(function () {
        $('body').animate({scrollTop: 0}, 'slow');
    });
});
//上下滚动
function upCarousel(obj) {
    var n = 0;
    var moveLength = obj.find('li:first').height();
    console.log(moveLength);
    obj.html(obj.html() + obj.html());
    obj.height(moveLength * (obj.find('li').length));
    var timer = setInterval(function () {
        n += 1;
        up(obj);
    }, 2000);
    obj.hover(function () {
        clearInterval(timer);
    }, function () {
        clearInterval(timer);
        timer = setInterval(function () {
            n += 1;
            up(obj);
        }, 2000);
    });
    function up(obj) {
        obj.stop().animate({
            top: -n * moveLength
        }, 1000, function () {
            if (n >= obj.find('li').length / 2) {
                n = 0;
                obj.css({
                    top: 0
                })
            }
        })
    }

}








