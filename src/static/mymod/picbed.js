layui.define(["layer", "util", "element"], function (exports) {
    'use strict';
    var $ = layui.jquery,
        layer = layui.layer,
        util = layui.util,
        device = layui.device(),
        element = layui.element;
    //禁止嵌套
    if (window != top) {
        top.location.href = location.href;
    }
    //阻止IE访问
    if (device.ie) {
        layer.alert('系统对IE浏览器的支持有限，推荐使用Firefox、Chrome等现代化浏览器访问！', {title:'温馨提示'});
    }
    //右下角工具
    util.fixbar({
        bgcolor: '#009688'
    });
    //复制接口
    var Clipboard = (function (window, document, navigator) {
        var textArea,
            copy;
        // 判断是不是ios端
        function isOS() {
            return navigator.userAgent.match(/ipad|iphone/i);
        }
        //创建文本元素
        function createTextArea(text) {
            textArea = document.createElement('textArea');
            textArea.value = text;
            document.body.appendChild(textArea);
        }
        //选择内容
        function selectText() {
            var range,
                selection;
            if (isOS()) {
                range = document.createRange();
                range.selectNodeContents(textArea);
                selection = window.getSelection();
                selection.removeAllRanges();
                selection.addRange(range);
                textArea.setSelectionRange(0, 999999);
            } else {
                textArea.select();
            }
        }
        //复制到剪贴板
        function copyToClipboard() {
            try {
                if (document.execCommand("Copy")) {
                    layer.msg("复制成功！", {
                        icon: 1
                    });
                } else {
                    layer.msg("复制失败！请手动复制！", {
                        icon: 0
                    });
                }
            } catch (err) {
                layer.msg("复制失败！请手动复制！", {
                    icon: 2
                });
            }
            document.body.removeChild(textArea);
        }
        copy = function (text) {
            createTextArea(text);
            selectText();
            copyToClipboard();
        };
        return {
            copy: copy
        };
    })(window, document, navigator);
    //公共接口
    var api = {
        ajax: function (url, success, options) {
            /*
                Ajax提交
                @param url string: 请求路径
                @param success function: success为成功后回调函数
                @param options object:
                    async是否异步;
                    post,put,delete等方法所需data;
                    error为发生异常时或success返回中code不为0时回调函数;
                    beforeSend为请求前回调函数;
                    complete为完成请求后回调;
                    msgprefix表示success返回code不为0时提示消息的前缀。
            */
            var that = this,
                urltype = typeof url === 'string',
                successtype = typeof success === "function",
                optionstype = typeof options === "object";
            if (!url || !urltype) {
                return false;
            }
            if (success) {
                if (!successtype) {
                    return false;
                }
            }
            if (options) {
                if (!optionstype) {
                    return false;
                }
            } else {
                options = {};
            }
            return $.ajax({
                url: url,
                async: options.async || true,
                method: options.method || 'post',
                dataType: options.dataType || 'json',
                contentType: options.contentType,
                data: options.data || {},
                beforeSend: options.beforeSend ? options.beforeSend : function () {},
                success: function (res) {
                    if (res.code === 0 || res.success === true) {
                        success && success(res);
                    } else {
                        if (options.msgprefix != false) {
                            layer.msg(options.msgprefix || '' + res.msg || res.code);
                        }
                        options.fail && options.fail(res);
                    }
                },
                error: function (xhr, textStatus, err) {
                    try {
                        var res = JSON.parse(xhr.responseText),
                            msg = "请求错误：" + xhr.status + "，" + res.msg;
                    } catch(e) {
                        console.error(e);
                        var msg = "请求错误：" + xhr.status + "，" + xhr.responseText;
                    }
                    layer.msg(msg, {icon: 2});
                },
                complete: options.complete ? options.complete : function () {}
            });
        },
        Clipboard: Clipboard,
        isURL: function (str_url, only_http) {
            var re_weburl = new RegExp(
                "^" +
                // protocol identifier
                "(?:(?:https?|ftp)://)" +
                // user:pass authentication
                "(?:\\S+(?::\\S*)?@)?" +
                "(?:" +
                // IP address dotted notation octets
                // excludes loopback network 0.0.0.0
                // excludes reserved space >= 224.0.0.0
                // excludes network & broacast addresses
                // (first & last IP address of each class)
                "(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])" +
                "(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}" +
                "(?:\\.(?:[1-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))" +
                "|" +
                // host name
                "(?:(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)" +
                // domain name
                "(?:\\.(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)*" +
                // TLD identifier
                "(?:\\.(?:[a-z\\u00a1-\\uffff]{2,}))" +
                ")" +
                // port number
                "(?::\\d{2,5})?" +
                // resource path
                "(?:/\\S*)?" +
                "$", "i"
            );
            if (str_url && re_weburl.test(str_url)) {
                if (only_http === true) {
                    if (str_url.startsWith("http://") || str_url.startsWith('https://')) {
                        return true;
                    } else {
                        return false;
                    }
                } else {
                    return true;
                }
            } else {
                return false;
            }
        },
        escape2Html: function (str) {
            return $("<div>").html(str).text();
        },
        isMobile: (navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone|Opera Mini)/i)) ? true : false,
        str2star: function (str, start, end) {
            if (!start) start = 4;
            if (!end) end = -4;
            return str.length > (start + Math.abs(end)) ? str.substr(0, start) + '****' + str.substr(end) : str;
        },
        getHash: function (str, caseSensitive) {
            /**
             * 获取字符串的哈希值
             * @param {String} str
             * @param {Boolean} caseSensitive
             * @return {Number} hashCode
             */
            if (!caseSensitive) {
                str = str.toLowerCase();
            }
            // 1315423911=b'1001110011001111100011010100111'
            var hash = 1315423911,
                i, ch;
            for (i = str.length - 1; i >= 0; i--) {
                ch = str.charCodeAt(i);
                hash ^= ((hash << 5) + ch + (hash >> 2));
            }
            return (hash & 0x7FFFFFFF);
        },
        arrayContains: function (arr, obj) {
            var i = arr.length;
            while (i--) {
                if (arr[i] === obj) {
                    return true;
                }
            }
            return false;
        },
        convertUTCTimeToLocalTime: function(UTCDateString) {
            if(!UTCDateString){
                return '-';
            }
            function formatFunc(str) {    //格式化显示
                return str > 9 ? str : '0' + str
            }
            var date2 = new Date(UTCDateString);     //这步是关键
            var year = date2.getFullYear();
            var mon = formatFunc(date2.getMonth() + 1);
            var day = formatFunc(date2.getDate());
            var hour = date2.getHours();
            //var noon = hour >= 12 ? 'PM' : 'AM';
            //hour = hour>=12?hour-12:hour;
            hour = formatFunc(hour);
            var min = formatFunc(date2.getMinutes());
            var dateStr = year + '-' + mon + '-' + day + ' ' + hour + ':' + min;
            return dateStr;
        },
        getUrlQuery: function(key, acq) {
            /*
                获取URL中?之后的查询参数，不包含锚部分，比如url为http://example.com/user/message/?status=1&Action=getCount
                若无查询的key，则返回整个查询参数对象，即返回{status: "1", Action: "getCount"}；
                若有查询的key，则返回对象值，返回值可以指定默认值acq：如key=status, 返回1；key=test返回acq
            */
            var str = location.search;
            var obj = {};
            if (str) {
                str = str.substring(1, str.length);
                // 以&分隔字符串，获得类似name=xiaoli这样的元素数组
                var arr = str.split("&");
                //var obj = new Object();
                // 将每一个数组元素以=分隔并赋给obj对象
                for (var i = 0; i < arr.length; i++) {
                    var tmp_arr = arr[i].split("=");
                    obj[decodeURIComponent(tmp_arr[0])] = decodeURIComponent(tmp_arr[1]);
                }
            }
            return key ? obj[key] || acq : obj;
        },
        ITChangeMapping: function(item, type) {
            //将操作系统、浏览器、设备转换为字体图标
            var im, browserMap = {
                edge: '<i class="saintic-icon saintic-icon-edge-browser"></i>',
                safari: '<i class="saintic-icon saintic-icon-safari-browser"></i>',
                chrome: '<i class="saintic-icon saintic-icon-chrome-browser"></i>',
                firefox: '<i class="saintic-icon saintic-icon-firefox"></i>',
                ie: '<i class="saintic-icon saintic-icon-ie-browser"></i>',
                opera: '<i class="saintic-icon saintic-icon-opera-browser"></i>',
                qq: '<i class="saintic-icon saintic-icon-qq-browser"></i>',
                sogou: '<i class="saintic-icon saintic-icon-sogou-browser"></i>',
                uc: '<i class="saintic-icon saintic-icon-uc-browser"></i>',
                baidu: '<i class="saintic-icon saintic-icon-baidu-browser"></i>',
                cli: '<i class="saintic-icon saintic-icon-cli"></i>'
            },
            systemMap = {
                windows: '<i class="saintic-icon saintic-icon-windows"></i>',
                linux: '<i class="saintic-icon saintic-icon-linux"></i>',
                apple: '<i class="saintic-icon saintic-icon-apple"></i>',
                darwin: '<i class="saintic-icon saintic-icon-apple"></i>',
                android: '<i class="saintic-icon saintic-icon-andriod"></i>'
            },
            deviceMap = {
                pc: '<i class="saintic-icon saintic-icon-pc"></i>',
                mobile: '<i class="saintic-icon saintic-icon-mobilephone"></i>',
                tablet: '<i class="saintic-icon saintic-icon-tablet"></i>'
            };
            if (type == "browser") {
                im = browserMap[item];
            } else if (type == "system") {
                im = systemMap[item];
            } else if (type == "device") {
                im = deviceMap[item]
            }
            return im || '<i class="saintic-icon saintic-icon-unknown"></i>'
        },
        isContains: function(str, substr) {
            /* 判断str中是否包含substr */
            return str.indexOf(substr) >= 0;
        },
        hasId: function(id) {
            //有此id返回true，否则返回false
            return document.getElementById(id) ? true : false;
        },
        checkUsername: function(value, item){
            if (!value) return '请输入用户名';
            if(!new RegExp("^[a-zA-Z0-9_\u4e00-\u9fa5\\s·]+$").test(value)){
                return '用户名不能有特殊字符';
            }
            if(/(^\_)|(\__)|(\_+$)/.test(value)){
                return '用户名首尾不能出现下划线\'_\'';
            }
            if(/^\d+\d+\d$/.test(value)){
                return '用户名不能全为数字';
            }
            if(value.length<4) {
                return '用户名长度最少4位';
            }
        },
        addCSS: function(href, id) {
            //加载css文件
            var link = document.createElement('link')
            link.type = 'text/css'
            link.rel = 'stylesheet'
            link.href = href
            if (id) link.id = id
            document.getElementsByTagName('head')[0].appendChild(link)
        },
        addJS: function(src, id, cb) {
            //加载js文件
            var script = document.createElement('script')
            script.type = 'text/javascript'
            script.src = src
            if (id) script.id = id
            document.getElementsByTagName('head')[0].appendChild(script)
            script.onload = typeof cb === 'function' ? cb : function () {}
        },
        initShare: function(cb) {
            let cssID = "shareCSSTag",
                cssURL = "/static/share.js/css/share.min.css",
                jsID = "shareJSTag",
                jsURL = "/static/share.js/js/social-share.min.js";
            if (!this.hasId(cssID)) {
                this.addCSS(cssURL, cssID)
            }
            if (!this.hasId(jsID)) {
                this.addJS(jsURL, jsID, cb)
            } else {
                cb && cb()
            }
        },
        resize_window: function() {
            if(document.createEvent) {
                var event = document.createEvent("HTMLEvents");
                event.initEvent("resize", true, true);
                window.dispatchEvent(event);
            } else if(document.createEventObject) {
                window.fireEvent("onresize");
            }
        },
    };
    //输出接口
    exports('picbed', api);
});
