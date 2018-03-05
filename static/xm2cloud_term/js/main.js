(function(factory) {
    if (typeof define === "function" && (define.amd || define.cmd)) {
        define(["jquery"], factory);
    } else {
        factory((typeof(jQuery) != "undefined") ? jQuery : window.Zepto);
    }
}
(function($) {
    $.fn.open_terminal = function (options) {
        if (options === undefined) {
            options = {};
        }
        var $console = this
            ,instance = options.instance
            ,protocol = options.protocol
            ,wsserver = options.wsserver;


        var set_term_size = function (t, c, r) {
            var head_container_height = $(".web-head").height()
                ,windows_height = $(window).height()
                ,windows_width = $(window).width() - 20
                ,foot_container_height = $(".web-foot").height();
            var main_container_height = windows_height - head_container_height - foot_container_height - 20;
            $(".terminal").width(windows_width);
            $(".terminal").height(main_container_height);
            $(".xterm-viewport").width(windows_width);
            $(".xterm-viewport").height(main_container_height);
            t.resize(c, r);
        };

        var get_term_size = function () {
            function get_char_size() {
                // Todo: calculating a char rows and cols
                var size = {width: 7.2, height: 15};
                return size;
            }

            function get_wind_size() {
                var head_container_height = $(".web-head").height()
                    ,windows_height = $(window).height()
                    ,windows_width = $(window).width()
                    ,foot_container_height = $(".web-foot").height();
                var main_container_height = windows_height - head_container_height - foot_container_height - 20;
                return {
                    width: windows_width,
                    height: main_container_height
                };
            }

            var char_size = get_char_size();
            var wind_size = get_wind_size();

            return {
                cols: Math.floor(wind_size.width / char_size.width),
                rows: Math.floor(wind_size.height / char_size.height)
            };
        };

        window.WebSocket = window.WebSocket || window.MozWebSocket;
        var cols = get_term_size().cols;
        var rows = get_term_size().rows;
        var term = null;
        var socket = new WebSocket(wsserver + "?protocol=" + protocol + "&instance=" + instance + "&width=" + cols + "&height=" + rows);

        socket.onopen = function () {
            term = new Terminal({
                termName: "xterm",
                cols: cols,
                rows: rows,
                useStyle: true,
                convertEol: true,
                screenKeys: true,
                cursorBlink: false,
                visualBell: true,
                colors: Terminal.xtermColors
            });

            term.attach(socket);
            term._initialized = true;

            term.open($console.get(0));

            set_term_size(term, cols, rows);

            $(window).resize(function () {
                cols = get_term_size().cols;
                rows = get_term_size().rows;
                set_term_size(term, cols, rows);
            });

            term.on("title", function (title) {
                // $(document).prop("title", title);
                $('.refresh').html('刷新');
                $('.shtitle').html(title);
            });

            term.on('paste', function (data, ev) {
                term.write(data);
            });

            window.term = term;
            window.socket = socket;
        };

        var span = $("<span></span>");
        span.css({
            "display": "inline-block",
            "position": "absolute",
            "z-index": 1500,
            "top": "40%",
            "width": "99%",
            "text-align": "center",
            "color": "#FFFFFF"
        });
        socket.onclose = function (e) {
            term.destroy();
            span.text("网络连接断开（与服务器端连接已断开，请重新连接或联系管理员）。");
            span.appendTo($console);
        };
        socket.onerror = function (e) {
            span.text("SSH中转异常（与服务器端连接已断开，请重新连接或联系管理员）。");
            span.appendTo($console);
        };
    };
}));
