/**
 * [帮助提示插件，鼠标挪上显示提示信息]
 *
 * Created by xyx , On Nov 29.2016
 */

(function($) {

    $.fn.myNote = function() {

        if (this.length == 0) {
            return;
        }

        var noteElement, self = this;

        renderNoteElement();

        init();

        // 初始化
        function init() {
        	
            self.text('?');

            self.css({
                width: '20px',
                height: '20px',
                background: '#000',
                display: 'inline-block',
                cursor: 'pointer',
                color: '#fff',
                lineHeight: '20px',
                textAlign: 'center',
                borderRadius: '20px',
                fontWeight: 'bold',
                fontSize: '16px'
            });

            self.each(function(index, el) {
                var note = $(el).attr("note");

                initNote($(el), note);

            });
        }

        // 加载提示框
        function renderNoteElement() {
            noteElement = $('<div id="noteElement"></div>');
            noteElement.css({
                position: 'absolute',
                border: '1px solid #eee',
                backgroundColor: '#fff',
                padding: '10px 16px',
                width: '270px'
            });
            $('body').append(noteElement);
        }

        // 初始化鼠标覆盖提示事件
        function initNote(el, note) {

            el.hover(function(e) {
                noteElement.html(note);

                noteElement.css({
                    top: e.pageY + 'px',
                    left: e.pageX + 'px'
                });

                noteElement.show();
            }, function() {

                noteElement.hide();
            });
        }
    }

}(jQuery));

$(function() {

    $('.myNote').myNote();

});
