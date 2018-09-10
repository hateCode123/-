/*!
     * Lazy Load - jQuery plugin for lazy loading images
     *
     * Copyright (c) 2007-2015 Mika Tuupola
     *
     * Licensed under the MIT license:
     *   http://www.opensource.org/licenses/mit-license.php
     *
     * Project home:
     *   http://www.appelsiini.net/projects/lazyload
     *
     * Version:  1.9.7
     *
     */

(function ($, window, document, undefined) {
    var $window = $(window);
    // 为jQuery拓展功能lazyload
    $.fn.lazyload = function (options) {
        var elements = this; // 缓存当前元素
        var $container; // 缓存盒子变量
        var settings = {
            threshold: 0, //滚动到距离图片threshold的参数时，图片就开始加载
            failure_limit: 0, //除了视图外的区域需要加载的数量
            event: "scroll", //当触发定义的事件时，图片才开始加载
            effect: "show", //图片显示方式
            container: window, //设置滚动触发加载的容器盒子
            data_attribute: "original", //img的一个data属性，用来存放真实图片地址
            skip_invisible: false, //是否要加载隐藏图片，true为不加载
            appear: null, //img触发appear时的回调
            load: null, //img触发load时的回调
            // 占位图
            placeholder: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAANSURBVBhXYzh8+PB/AAffA0nNPuCLAAAAAElFTkSuQmCC"
        };

        //这个方法用来判断什么时候事件可以触发，什么时候事件停止
        function update() {
            var counter = 0;
            elements.each(function () {
                var $this = $(this);
                // 如果图片被设置隐藏，则中断循环
                if (settings.skip_invisible && !$this.is(":visible")) {
                    return;
                }
                // 如果在视口上方或者左方的时候，不操作
                if ($.abovethetop(this, settings) ||
                    $.leftofbegin(this, settings)) {
                    /* Nothing. */
                } 
                // 如果图片不在视口的下方或者右方(即图片在视口内)，就让图片显示，触发appear事件，重置counter为0
                else if (!$.belowthefold(this, settings) &&
                    !$.rightoffold(this, settings)) {
                    $this.trigger("appear");
                    /* if we found an image we'll load, reset the counter */
                    counter = 0;
                }
                // 其他情况，如果count大于视口外的元素预加载数量failure_limit时终止
                else {
                    if (++counter > settings.failure_limit) {
                        return false;
                    }
                }
            });

        }
        // 这里对两个特殊默认参数failure_limit和effect_speed进行设置
        if (options) {
            /* Maintain BC for a couple of versions. */
            // 设置特殊配置参数，如果这个参数存在就赋值给默认，并删除默认
            if (undefined !== options.failurelimit) {
                options.failure_limit = options.failurelimit;
                delete options.failurelimit;
            }
            if (undefined !== options.effectspeed) {
                options.effect_speed = options.effectspeed;
                delete options.effectspeed;
            }
            //jq用法，如果传入参数存在就用传入，不存在就用默认
            $.extend(settings, options);
        }

        /* Cache container as jQuery as object. */
        // 如果参数container为undefined或者是window就赋值给$window变量，否则就赋值给设置的参数container
        $container = (settings.container === undefined ||
            settings.container === window) ? $window : $(settings.container);

        /* Fire one scroll event per scroll. Not one scroll event per image. */
        // 如果参数event中不包含scroll，就绑定其它事件，并由update方法判断是否符合加载要求
        if (0 === settings.event.indexOf("scroll")) {
            $container.bind(settings.event, function () {
                return update();
            });
        }

        this.each(function () {
            var self = this;
            var $self = $(self);

            self.loaded = false;

            /* If no src attribute given use data:uri. */
            // 设置占位图
            if ($self.attr("src") === undefined || $self.attr("src") === false) {
                if ($self.is("img")) {
                    $self.attr("src", settings.placeholder);
                }
            }

            /* When appear is triggered load original image. */
            // 使用one绑定事件，触发执行后销毁
            $self.one("appear", function () {
                // 为true，说明图片为加载
                if (!this.loaded) {
                    if (settings.appear) {
                        var elements_left = elements.length;
                        settings.appear.call(self, elements_left, settings);
                    }
                    $("<img />")
                        .bind("load", function () {

                            var original = $self.attr("data-" + settings.data_attribute);
                            $self.hide();
                            // 如果是img标签，就设置src路径
                            if ($self.is("img")) {
                                $self.attr("src", original);
                            } else {
                                // 如果不是img标签，就设置背景图
                                $self.css("background-image", "url('" + original + "')");
                            }
                            $self[settings.effect](settings.effect_speed);
                            // 标记图片已加载
                            self.loaded = true;

                            /* Remove image from array so it is not looped next time. */
                            // 更新elements，过滤掉已经加载的img元素，避免下次在update中轮循
                            var temp = $.grep(elements, function (element) {
                                return !element.loaded;
                            });
                            elements = $(temp);

                            if (settings.load) {
                                var elements_left = elements.length;
                                settings.load.call(self, elements_left, settings);
                            }
                        })
                        .attr("src", $self.attr("data-" + settings.data_attribute));
                }
            });

            /* When wanted event is triggered load original image */
            /* by triggering appear.                              */
            if (0 !== settings.event.indexOf("scroll")) {
                $self.bind(settings.event, function () {
                    if (!self.loaded) {
                        $self.trigger("appear");
                    }
                });
            }
        });

        /* Check if something appears when window is resized. */
        // 若窗口大小变化，重新执行
        $window.bind("resize", function () {
            update();
        });

        /* With IOS5 force loading images when navigating with back button. */
        /* Non optimal workaround. */
        if ((/(?:iphone|ipod|ipad).*os 5/gi).test(navigator.appVersion)) {
            $window.bind("pageshow", function (event) {
                if (event.originalEvent && event.originalEvent.persisted) {
                    elements.each(function () {
                        $(this).trigger("appear");
                    });
                }
            });
        }

        /* Force initial check if images should appear. */
        $(document).ready(function () {
            update();
        });

        return this;
    };

    /* Convenience methods in jQuery namespace.           */
    /* Use as  $.belowthefold(element, {threshold : 100, container : window}) */
    // 判断是否在视口下方
    $.belowthefold = function (element, settings) {
        var fold;

        if (settings.container === undefined || settings.container === window) {
            // container大小默认为视口，fold为当前视口高度
            fold = (window.innerHeight ? window.innerHeight : $window.height()) + $window.scrollTop();
        } else {
            // 若设置了container，则取fold当前元素到屏幕上边缘的距离+元素高度
            fold = $(settings.container).offset().top + $(settings.container).height();
        }
        // 若为true，说明图片在视口下边缘的下方，说明不在视口内
        return fold <= $(element).offset().top - settings.threshold;
    };
    // 判断是否在视口右侧
    $.rightoffold = function (element, settings) {
        var fold;

        if (settings.container === undefined || settings.container === window) {
            fold = $window.width() + $window.scrollLeft();
        } else {
            fold = $(settings.container).offset().left + $(settings.container).width();
        }
        // 若为true，说明图片在视口右边缘的右方，说明不在视口内
        return fold <= $(element).offset().left - settings.threshold;
    };
    // 判断是否在视口上方
    $.abovethetop = function (element, settings) {
        var fold;

        if (settings.container === undefined || settings.container === window) {
            // 此时fold
            fold = $window.scrollTop();
        } else {
            fold = $(settings.container).offset().top;
        }
        // 若为true，说明图片在视口上边缘的上方
        return fold >= $(element).offset().top + settings.threshold + $(element).height();
    };
    // 判断是否在视口左方
    $.leftofbegin = function (element, settings) {
        var fold;

        if (settings.container === undefined || settings.container === window) {
            fold = $window.scrollLeft();
        } else {
            fold = $(settings.container).offset().left;
        }
        // 若为true，说明图片在视口左边缘的左方
        return fold >= $(element).offset().left + settings.threshold + $(element).width();
    };
    // 若为true， 说明图片在视口的中央
    $.inviewport = function (element, settings) {
        return !$.rightoffold(element, settings) && !$.leftofbegin(element, settings) &&
            !$.belowthefold(element, settings) && !$.abovethetop(element, settings);
    };

    /* Custom selectors for your convenience.   */
    /* Use as $("img:below-the-fold").something() or */
    /* $("img").filter(":below-the-fold").something() which is faster */

    $.extend($.expr[":"], {
        "below-the-fold": function (a) { return $.belowthefold(a, { threshold: 0 }); },
        "above-the-top": function (a) { return !$.belowthefold(a, { threshold: 0 }); },
        "right-of-screen": function (a) { return $.rightoffold(a, { threshold: 0 }); },
        "left-of-screen": function (a) { return !$.rightoffold(a, { threshold: 0 }); },
        "in-viewport": function (a) { return $.inviewport(a, { threshold: 0 }); },
        /* Maintain BC for couple of versions. */
        "above-the-fold": function (a) { return !$.belowthefold(a, { threshold: 0 }); },
        "right-of-fold": function (a) { return $.rightoffold(a, { threshold: 0 }); },
        "left-of-fold": function (a) { return !$.rightoffold(a, { threshold: 0 }); }
    });

})(jQuery, window, document);