(function($) {
    var myInput = {
        init: function() {
            $(document).on({
                keyup: function() {
                    var type = $(this).attr('myType');
                    switch (type) {
                        case 'int':
                            myInput.intValue(this);
                            break;
                        case 'float':
                            myInput.floatValue(this);
                            break;
                        case 'percent':
                            myInput.percentValue(this);
                            break;
                    }

                }
            }, 'input[myInput="myInput"],input[myInput]');
        },
        intValue: function(el) {
            var val = $(el).val();
            $(el).val(val.replace(/\D/gm, ''));
        },
        floatValue: function(el) {
            var val = $(el).val();
            var i = 0;
            val = val.replace(/\D/gm, function(g) {
                return g == '.' && !i ? (g, ++i) : '';
            });
            $(el).val(val);
        },
        percentValue: function(el) {
            var val = $(el).val();
            var i = 0;
            val = val.replace(/\D/gm, function(g) {
                if (!(g == '.' && !i)) {
                    g = '';
                    i++;
                }
                return g;
            });
            var parts = val.split('.');
            parts[0] = parts[0].replace(/\d/gm, function(g, i) {
                return i < 2 ? g : '';
            });
            if (parts[1]) {
                parts[1] = parts[1].replace(/\d/gm, function(g, i) {
                    return i < 2 ? g : '';
                });
                parts[0] = parts[0] + '.' + parts[1];
            }
            $(el).val(parts[0]);
        }
    }
    try {
        myInput.init();
    } catch (e) { alert('Please update you jQuery,any question contact with Xiang ge!') }
})(jQuery)
