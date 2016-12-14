/**
 * [帮助提示插件，鼠标挪上显示提示信息]
 *
 * Created by xyx , On Dec 12.2016
 */

/**
    <span myBuble> 
    </span>

    <div>
        <span myBuble> 
        </span>
        <span>
            提示
        </span>
    </div>

    <span myBuble> 
    </span>
    <span>
        提示
    </span>
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
        var self = $(this);
        if (self.data('hasBuble')) {
            $(ele).next().show();
            return;
        }

        var options = myBuble.getOptions(self);

        var buble = $('<div></div>').html('' + options.tooltip);
        if (options.class) {
            buble.addClass(options.class);
        }

        self.after(buble);
        self.data('hasBuble', true);
    },

    hide: function(ele) {
        $(ele).next().hide();
    }
}

$(myBuble.initialize);
