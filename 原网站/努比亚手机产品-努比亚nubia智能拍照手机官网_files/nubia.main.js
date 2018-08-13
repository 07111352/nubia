// nubia official website
// date: 2014-12-30


var UIMIX_NUBIA = {
    init: function (c) {
        var c = c ? c : UIMIX_NUBIA;
        for (var i in c) {
            if (c[i] && c[i].init) {
                c[i].init();
            }
        }
    },
    platform: function () {
        var u = navigator.userAgent,
            app = navigator.appVersion;
        return {
            trident: u.indexOf('Trident') > -1,
            presto: u.indexOf('Presto') > -1,
            webKit: u.indexOf('AppleWebKit') > -1,
            gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1,
            mobile: !!u.match(/AppleWebKit.*Mobile.*/) || !!u.match(/AppleWebKit/),
            ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/),
            android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1,
            iPhone: u.indexOf('iPhone') > -1 || u.indexOf('Mac') > -1,
            iPad: u.indexOf('iPad') > -1,
            webApp: u.indexOf('Safari') == -1
        };
    }(),
    pf : function(){
        var ra='(-webkit-min-device-pixel-ratio: 1.5), (min--moz-device-pixel-ratio: 1.5), (-o-min-device-pixel-ratio: 3/2), (min-resolution: 1.5dppx)';
        return {
            retina : window.devicePixelRatio > 1 ? true : window.matchMedia && window.matchMedia(ra).matches ? true : false
        }
    }(),
    cRetina : function(){
        var a=this;
        $('img[data-x2]').each(function(){
            if(a.pf.retina){
                $(this).attr({'src':$(this).attr('data-x2')});
            }
        });
    },

    showLayer: function () {
        if ($('#nb-show-layer').size() <= 0) {
            $('body').prepend('<div id="nb-show-layer"><a href="#" class="nb-sl-close" style="display:none;"></a></div>');
        }
        $(window).on({
            resize: function () {
                $('#nb-show-layer').children('div').css({
                    height: $(this).height()
                });
            }
        }).resize();

    },
    closeLayer: function () {
        $('#nb-show-layer a.nb-sl-close').off('click')
            .css({
                opacity: 0,
                display: 'block'
            }).clearQueue().animate({
                opacity: 1
            }, 500)
            .on('click', function () {
                $(this).animate({
                        opacity: 0
                    }, 500, function () {
                        $(this).css({
                            display: 'none'
                        });
                    })
                    .siblings('div').clearQueue().animate({
                        opacity: 0
                    }, 500, function () {
                        $(this).css({
                            display: 'none',
                            zIndex: 1
                        });
                    });
                return false;
            });

    },

    playVideoInner: function (aaa) {
        this.showLayer();
        if ($('#nb-show-layer .nb-video-layer').size() <= 0) $('#nb-show-layer').append('<div class="nb-video-layer" style="display:none;"><div class="bn-vl-box"></div></div>');

        var def = {
                url: '',
                w: 720,
                h: 480
            },
            newVal = $.extend({}, def),
            ab = $(aaa).attr('href'),
            abArr = [],
            delay = 0;

        if (ab.indexOf("#") != -1) {
            abArr = ab.split('#');
            newVal.url = abArr[0];
            newVal.w = parseInt(abArr[1]);
            newVal.h = parseInt(abArr[2]);
        } else {
            newVal.url = ab;
        }
        if (ab == '' || ab == '#') return false;
        if ((newVal.url).indexOf('.flv') != -1 || (newVal.url).indexOf('.mp4') != -1) {
            if (typeof SWFObject == 'undefined') {
                $('body').append('<script src="https://web.archive.org/web/20171026112914/http://static.nubia.cn/js_new/swfobject.js"></script>');
                delay = 1000;
            }
            var createVi = function () {
                    $('.nb-video-layer .bn-vl-box').html('').append('<span id="CuPlayer"/>');
                    var so = new SWFObject("https://web.archive.org/web/20171026112914/http://static.nubia.cn/js_new/CuPlayerMiniV3_Black_S.swf", "CuPlayer", newVal.w, newVal.h, "9", "#000000");
                    so.addParam("allowfullscreen", "true");
                    so.addParam("allowscriptaccess", "always");
                    so.addParam("wmode", "opaque");
                    so.addParam("quality", "high");
                    so.addParam("salign", "lt");
                    so.addVariable("CuPlayerFile", newVal.url);
                    so.addVariable("CuPlayerShowImage", "true");
                    so.addVariable("CuPlayerWidth", newVal.w);
                    so.addVariable("CuPlayerHeight", newVal.h);
                    so.addVariable("CuPlayerAutoPlay", "true");
                    so.addVariable("CuPlayerAutoRepeat", "false");
                    so.addVariable("CuPlayerImage", "https://web.archive.org/web/20171026112914/http://static.nubia.cn/new_images/vedio_preview.jpg");
                    so.addVariable("CuPlayerShowControl", "true");
                    so.addVariable("CuPlayerAutoHideControl", "false");
                    so.addVariable("CuPlayerAutoHideTime", "6");
                    so.addVariable("CuPlayerVolume", "80");
                    so.addVariable("CuPlayerGetNext", "false");
                    so.write("CuPlayer");
                },
                isloading = function () {
                    if (typeof SWFObject != 'undefined') {
                        createVi();
                        clearTimeout(tt);
                    } else {
                        tt = setTimeout(isloading, delay);
                    }
                };
            var tt = setTimeout(isloading, delay);

        } else {
            $('.nb-video-layer .bn-vl-box').html('').append('<iframe frameborder="0" width="' + newVal.w + '" height="' + newVal.h + '" src="' + newVal.url + '"></iframe>');
        }


        $('.nb-video-layer').css({
            display: 'block',
            opacity: 0,
            zIndex: 2
        }).clearQueue().animate({
            opacity: 1
        }, 500, function () {
            $(this).siblings('div').css({
                display: 'none'
            });
        }).siblings('div').css({
            zIndex: 1
        });
        this.closeLayer();

        $(window).resize(function () {
            $('.nb-video-layer .bn-vl-box').css({
                width: newVal.w,
                height: newVal.h,
                marginTop: -(newVal.h / 2),
                marginLeft: -(newVal.w / 2)
            });
        }).resize();


        return false;

    }
};
$(document).ready(function () {
    UIMIX_NUBIA.init();
});

UIMIX_NUBIA.nav = {
    init: function () {
        $(window).resize(UIMIX_NUBIA.nav.fit);
        UIMIX_NUBIA.nav.fit();
        UIMIX_NUBIA.cRetina();
    },
    fit: function () {
        var w = $(window).width();
        var left = $('.nubia-navigator.left li').css('padding-left');
        var newl = '';
        var maxw = 990;
        var minw = 800;
        var maxl = 35;
        var minl = 23;
        if (w > maxw) {
            newl = '40px';
        } else if (w <= minw) {
            newl = minl + 'px';
        } else {
            newl = parseInt(minl + (w - minw) / (maxw - minw) * (maxl - minl)) + 'px';
        }
        if (newl != left) {
            $('.nubia-navigator.left li').css({
                'padding-left': newl
            });
        }
    }
};


UIMIX_NUBIA.pf_switch = {
    is_mobile: function() {
        return $('body').hasClass('nb-adapt-mobile') &&(UIMIX_NUBIA.platform.ios || UIMIX_NUBIA.platform.android);
    },
    init: function () {
        if (UIMIX_NUBIA.pf_switch.is_mobile()) {
            this.fixLayout();
        }
    },
    fixLayout: function () {
        var headMeta = '',
            mobileCssLink = '<link href="css/nb.mobile.layout.css" rel="stylesheet" type="text/css" />';

        $('meta').last().after(headMeta);
        $('link').last().after(mobileCssLink);
        $('link.nb-m-css').remove();


        //        menu
        $('#nb-header a.nubia-menu-btn').click(function () {
            if ($('body').hasClass('open-menu')) {
                $('body').removeClass('open-menu');
            } else {
                $('body').addClass('open-menu');
            }
            return false;
        });
        
        
//        $(window).on({
//            load : function(){
//                $('.nubia-copyright').children().css({fontSize:'.5em'});
//                $('.nubia-copyright').find('p.nb-footer-info a').css({fontSize:'1.2em'});
//            },
//            orientationchange : function(){
//                $('.nubia-copyright').children().css({fontSize:'.5em'});
//                $('.nubia-copyright').find('p.nb-footer-info a').css({fontSize:'1.2em'});
//            }
//        });


    }
};

UIMIX_NUBIA.main = {
    init: function () {
        var high = new this.high();
        this.head();
        this.foot();
    },

    head: function () {
        var _h_box = $('#nb-h-wrap'),
            _h_searchBox = _h_box.find('.nubia-navigator li.nb-search-bar'),
            _h_navBox = _h_box.find('.nubia-navigator'),
            _h_searchBtn = _h_searchBox.find('button'),
            _h_searchInp = _h_searchBox.find('input'),
            _h_tipsBox = _h_box.find('.nubia-navigator li.nb-tips-bar'),
            _h_tipsBox_layer = _h_box.find('.nubia-navigator li.nb-tips-bar .nb-tips-menu'),
            _h_user = _h_box.find('.nubia-navigator li.nb-users-bar'),
            _h_user_menu = _h_box.find('.nubia-navigator li.nb-users-bar .nb-user-menu'),
            _h_tipsCon = _h_box.find('.nb-tips-con'),
            _h_tipsBtn = _h_tipsBox.find('button'),
            _h_tipsShow = _h_tipsBox.find('p');

        //        搜索
        _h_searchBtn.click(function () {
            if (_h_searchBox.hasClass('show-search-bar')) {
                _h_searchBox.removeClass('show-search-bar');
                setTimeout(function () {
                    //                    _h_searchInp.val('');
                    _h_searchInp.css({
                        display: 'none'
                    });
                }, 300);
            } else {
                _h_searchBox.addClass('show-search-bar');
                setTimeout(function () {
                    _h_searchInp.css({
                        display: 'block'
                    });
                    _h_searchInp.focus();
                }, 200);
            }
            return false;
        });
        
        var currentChoose=_h_navBox.find('li.current').index();
        _h_navBox.find('li').on({
            mouseenter : function(){
                if(_h_navBox.find('li.current').size()<=0) return;
                $(this).addClass('current').siblings().removeClass('current');
            },
            mouseleave : function(){
                if(_h_navBox.find('li.current').size()<=0) return;
                _h_navBox.find('li').eq(currentChoose).addClass('current').siblings().removeClass('current');
            }
        });
        
//        个人信息菜单
        _h_user.on({
            mouseenter : function(){
                if($(this).hasClass('logged')){
                    _h_user_menu.css({display:'block',opacity:0}).clearQueue().animate({opacity:1},300);
                }
            },
            mouseleave : function(){
                _h_user_menu.clearQueue().animate({opacity:0},300,function(){
                    $(this).css({display:'none'});
                });
            }
        });
        
//        消息提示
        _h_tipsBox.on({
            mouseenter : function(){
                _h_tipsBox_layer.css({display:'block',opacity:0}).clearQueue().animate({opacity:1},300);
            },
            mouseleave : function(){
                _h_tipsBox_layer.clearQueue().animate({opacity:0},300,function(){
                    $(this).css({display:'none'});
                });
            }
        });
        

        //        提醒
        _h_tipsCon.on({
            mouseleave: function () {
                _h_tipsBox.removeClass('show-tips-bar');
                setTimeout(function () {
                    //                    _h_searchInp.val('');
                    _h_tipsShow.css({
                        display: 'none'
                    });
                }, 300);
            },
            mouseenter: function () {
                if ($(window).width() <= 1080) return;
                _h_tipsBox.addClass('show-tips-bar');
                setTimeout(function () {
                    _h_tipsShow.css({
                        display: 'block'
                    });
                }, 200);
            }
        });

        $(document).on({
            click: function (e) {
                if (!$(e.target).parents('.nb-search-bar').size() > 0 && _h_searchBox.hasClass('show-search-bar')) {
                    _h_searchBtn.click();
                }
                if (!$(e.target).parents('.nb-tips-bar').size() > 0 && _h_tipsBox.hasClass('show-tips-bar')) {
                    //                  _h_tipsBtn.mouseenter(); 
                }
            }
        });

        //        二级菜单控制
        if (_h_box.find('.nb-sub-navbar').size() > 0) this.headSubNav();

    },

    headSubNav: function () {
        var _h_box = $('#nb-h-wrap'),
            _h_sub_nav = _h_box.find('.nb-sub-navbar'),
            _h_sub_navmenuBtn = _h_sub_nav.find('a.nb-sub-menubtn');

        _h_sub_navmenuBtn.click(function () {
            if (!$('body').hasClass('hide-main-nav')) return false;
            $('body').removeClass('hide-main-nav');
            _h_box.clearQueue().animate({
                top: 0
            }, 300, 'easeInOutQuad');
            _h_sub_navmenuBtn.clearQueue().animate({
                right: -40
            }, 500, 'easeInOutQuad');

            return false;
        });

        var nPos = oPos = 0;
        $(window).on({
            scroll: function () {
                if(UIMIX_NUBIA.pf_switch.is_mobile()) return;
                nPos = $(this).scrollTop() < 0 ? 0 : $(this).scrollTop();
                if (nPos >= $('body').height() - $(this).height()) return false;
                if (nPos > $(this).height()) {
                    oPos = nPos;
                    if ($('body').hasClass('hide-main-nav')) return false;
                    $('body').addClass('hide-main-nav');
                    _h_box.clearQueue().animate({
                        top: -60
                    }, 500, 'easeInOutQuad');
                    //                    _h_sub_navmenuBtn.clearQueue().animate({right:20},500,'easeInOutQuad');
                } else {
                    oPos = nPos;
                    if (!$('body').hasClass('hide-main-nav')) return false;
                    $('body').removeClass('hide-main-nav');
                    _h_box.clearQueue().animate({
                        top: 0
                    }, 300, 'easeInOutQuad');
                    //                    _h_sub_navmenuBtn.clearQueue().animate({right:-40},500,'easeInOutQuad');
                }

            },
            resize: function () {
                if(UIMIX_NUBIA.pf_switch.is_mobile()) return;
                if ($(this).scrollTop() > $(this).height()) {
                    _h_box.css({
                        top: -60
                    });
                } else {
                    _h_box.css({
                        top: 0
                    });
                }
            }
        }).resize();
    },

    high: function () {
        var H = UIMIX_NUBIA.main.high.prototype,
            TH = this;

        var _hwrap = $('#nb-h-wrap'),
            _highBox = $('#nb-high,.nb-highlight-act'),
            _highSlide = _highBox.find('ul li'),
            _highSwitch = _highBox.find('.nb-h-switch'),
            hwCode = '',
            curItem = 0,
            ht = false,
            delay = 8000;

        for (var s = 0; s < _highSlide.size(); ++s) {
            hwCode += '<a href="#" ><b></b></a>';
        }


        H.run = function () {
            curItem = curItem < _highSlide.size() - 1 ? ++curItem : 0;
            _highSwitch.children('a').eq(curItem).click();
        };
        H.checkInit = function () {
            return _highSlide.eq(curItem).attr('init') === 'inited' ? true : false;
        };
        H.func = {
            h1: function () {
            }
        };
        H.play = function () {
            TH.close();
            ht = setTimeout(TH.run, delay);
        };
        H.close = function () {
            clearTimeout(ht);

            // _highBox.find('.high-t1 .ele').html('');
        };


        _highSwitch.html(hwCode);
        _highSlide.eq(0).css({
            display: 'block',
            zIndex: 2,
            opacity: 1
        }).siblings().css({
            display: 'none',
            zIndex: 1,
            opacity: 0
        });
        var oInd = del = 0,
            played = true;
        _highSwitch.children('a').on({
            click: function () {
                if ($(this).hasClass('current') || !played) return false;
                played = false;
                $(this).addClass('current').siblings().removeClass('current');
                var ind = $(this).index();
                cla = 'color-' + _highSlide.eq(ind).attr('cg');

//                if ($(this).index() !== oInd) {
//                    _highSlide.eq(ind).siblings().clearQueue().animate({
//                        opacity: 0
//                    }, 1000, 'easeInOutQuad');
//                    $('#nubia-wrap').removeAttr('class');
//                    del = 1000;
//                }

                _highSlide.eq(ind).css({
                    display: 'block',
                    zIndex: 2
                }).clearQueue().delay(del).animate({
                    opacity: 1
                }, 1000, 'easeInOutQuad', function () {
                    if (typeof TH.func['h' + ind] === 'function') TH.func['h' + ind]();
                    $(this).attr({
                        'init': 'inited'
                    }).addClass('play').siblings().css({
                        display: 'none',
                        opacity: 0
                    }).removeClass('play');
                    played = true;
                }).siblings().css({
                    zIndex: 1
                });
                
                var t = setTimeout(function () {
//                    $('#nubia-wrap').addClass(cla);
                    $('#nubia-wrap').removeAttr('class').addClass(cla);
                }, (del));
                oInd = curItem = ind;
                TH.play();
                return false;
            }
        }).first().click();

        var fixheight = 0;
        if (!UIMIX_NUBIA.pf_switch.is_mobile()) {
            $(window).resize(function () {
                if ($(this).height() <= 820 || $(this).width() <= 1024) {
                    _highBox.removeClass('big').addClass('small');
                    $('.nb-m-promos').removeClass('big').addClass('small');
                } else if ($(this).height() >= 1050 && $(this).width() >= 1100) {
                    _highBox.addClass('big').removeClass('small');
                     $('.nb-m-promos').addClass('big').removeClass('small');
                } else {
                    _highBox.removeClass('big').removeClass('small');
                    $('.nb-m-promos').removeClass('big').removeClass('small');
                }
            }).resize();
        } else {
            _highBox.addClass('mobile');
        }
    },
    
    foot : function(){
        var _f=$('#nb-footer .nb-footer-func'),
            _f_wx_btn=_f.find('a.nb-weixin-ico'),
            _f_wx_code=_f.find('.nb-footer-wx-layer');
        
        _f_wx_btn.click(function(){
            if($(this).hasClass('current')){
                $(this).removeClass('current');
                _f_wx_code.clearQueue().animate({opacity:0},300,'easeInOutQuad',function(){
                    $(this).css({display:'none'});
                });
            }else{
                $(this).addClass('current');
               _f_wx_code.css({opacity:0,display:'block'}).clearQueue().animate({opacity:1},300,'easeInOutQuad'); 
            }
            return false;
        });
        
        $(document).on({
            click: function (e) {
                if (!$(e.target).parents('a.nb-weixin-ico').size() > 0 && _f_wx_btn.hasClass('current')) {
                    _f_wx_btn.click();
                }
            }
        });

    }
};
/*
     FILE ARCHIVED ON 11:29:14 Oct 26, 2017 AND RETRIEVED FROM THE
     INTERNET ARCHIVE ON 01:43:21 Aug 09, 2018.
     JAVASCRIPT APPENDED BY WAYBACK MACHINE, COPYRIGHT INTERNET ARCHIVE.

     ALL OTHER CONTENT MAY ALSO BE PROTECTED BY COPYRIGHT (17 U.S.C.
     SECTION 108(a)(3)).
*/
/*
playback timings (ms):
  LoadShardBlock: 2179.811 (3)
  esindex: 0.005
  captures_list: 2251.259
  CDXLines.iter: 8.986 (3)
  PetaboxLoader3.datanode: 1901.207 (4)
  exclusion.robots: 0.186
  exclusion.robots.policy: 0.177
  RedisCDXSource: 60.117
  PetaboxLoader3.resolve: 1223.751 (2)
  load_resource: 1013.36
*/