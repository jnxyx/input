/**
 * [帮助提示插件，鼠标挪上显示提示信息]
 *
 * Created by xyx , On Dec 12.2016
 */

var myBuble = {

    initialize: function() {
        $(document).on({
            mouseenter: function() {

                myBuble.show(this);
            },
            mouseleave: function() {

                myBuble.hide(this);
            }
        }, '[my_buble]');
    },

    getOptions: function(ele) {

        ele = $(ele);

        var options = {
            tooltip: ele.attr('my-tooltip') || '',
            position: ele.attr('my-position') || 'top-left',
            offset: +ele.attr('my-offset') || 0,
            class: ele.attr('my-class') || ''
        };

        return options;
    },

    show: function(ele) {
        var self = $(ele);
        if (self.data('hasBuble')) {
            $(ele).next().show();
            myBuble.setPosition(self);
            return;
        }

        // self.wrap('<div class="buble"></div>');

        var options = myBuble.getOptions(self);

        var buble = $('<span class="my-tooltip"></span>').html('' + options.tooltip);
        if (options.class) {
            buble.addClass(options.class);
        }

        self.after(buble);

        myBuble.setPosition(self);
        
        self.data('hasBuble', true);
    },

    hide: function(ele) {
        $(ele).next().hide();
    },

    setPosition: function(ele) {

        var buble = ele.next(),
            offset = ele.offset(),
            position = myBuble.getOptions(ele).position;

        buble.css({
            top: offset.top,
            left: offset.left
        });
    }
}

$(myBuble.initialize);
