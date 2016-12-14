/**
 * [帮助提示插件，鼠标挪上显示提示信息]
 *
 * Created by xyx , On Dec 12.2016
 */

var myTooltip = {
    tooltipTimeout: null,
    initialize: function() {
        $(document).on({
            mouseenter: function() {
                myTooltip.displayTooltip($(this), true);
            },
            mouseleave: function() {
                myTooltip.displayTooltip($(this), false);
            }
        }, '[my-tooltip]');
        $(document).on({
            mouseenter: function() {
                myTooltip.displayTooltip($(this).prev(), true);
            },
            mouseleave: function() {
                myTooltip.displayTooltip($(this).prev(), false);
            }
        }, '.my-tooltip');
    },

    displayTooltip: function(ele, flag) {
        // ele.data('flag', flag);
        clearTimeout(ele.data('timeout'));
        ele.data('timeout', setTimeout(function() {
            // var flag = $(ele).data('flag');
            if (flag) {
                myTooltip.show(ele);
            } else {
                myTooltip.hide(ele);
            }
        }, 100));
    },

    getOptions: function(ele) {

        var options = {
            tooltip: ele.attr('my-tooltip') || '',
            position: ele.attr('my-position') || 'top', // 'top' ,'bottom'
            offsetX: +ele.attr('my-offset-x') || 0,
            offsetY: +ele.attr('my-offset-y') || 0,
            class: ele.attr('my-class') || ''
        };

        return options;
    },

    show: function(ele) {
        if (ele.data('hasTooltip')) {
            ele.next().show();
            // myTooltip.setPosition(ele);
            return;
        }

        var options = myTooltip.getOptions(ele);

        var tooltip = $('<span class="my-tooltip"></span>').html('' + options.tooltip);
        if (options.class) {
            tooltip.addClass(options.class);
        }

        if (options.position == 'top') {
            tooltip.addClass('my-tooltip-top');
        }

        if (options.position == 'bottom') {
            tooltip.addClass('my-tooltip-bottom');
        }

        ele.after(tooltip);

        myTooltip.setPosition(ele);

        ele.data('hasTooltip', true);
    },

    hide: function(ele) {
        ele.next().hide();
    },

    setPosition: function(ele) {

        var tooltip = ele.next(),
            offset = ele.offset(),
            options = myTooltip.getOptions(ele),
            width = tooltip.outerWidth(),
            height = tooltip.outerHeight(),
            _width = ele.outerWidth(),
            _height = ele.outerHeight(),
            offsetTop = offset.top,
            offsetLeft = offset.left;

        var positionObj = {};
        switch (options.position) {
            case 'top':
                positionObj = {
                    top: offsetTop - height - 10,
                    left: offsetLeft + _width / 2 - width / 2
                }
                break;
            case 'bottom':
                positionObj = {
                    top: offsetTop + _height + 10,
                    left: offsetLeft + _width / 2 - width / 2
                }
                break;
            default:
                positionObj = {
                    top: offset.top - height,
                    left: offset.left - width
                }
                break;
        }

        positionObj.top += options.offsetY;
        positionObj.left += options.offsetX;

        tooltip.css(positionObj);
    }
}

$(myTooltip.initialize);
