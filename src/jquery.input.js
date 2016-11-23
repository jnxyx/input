;
(function($) {
    var myInput = {
        init: function() {
            $(document).on({
                input: function() {
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
                        case 'percenti':
                            myInput.percentiValue(this);
                    }

                }
            }, 'input[myInput="myInput"],input[myInput]');
        },
        intValue: function(el) {
            var val = $(el).val();
            val = val.replace(/\D/gm, '');
            if (val !== '') {
                val = +val;
            }
            $(el).val(val);
        },
        floatValue: function(el) {
            var val = $(el).val();
            var i = 0;
            val = val.replace(/\D/gm, function(g) {
                return g == '.' && !i ? (++i, g) : '';
            });
            var ext = $(el).attr('myExt');
            if (ext) {
                ext = +ext;
                if (!isNaN(ext) && val.length > (val.indexOf('.') + ext + 1) && val.indexOf('.') > -1) {
                    val = val.substr(0, val.indexOf('.') + ext + 1);
                }
            }

            if (val == '00') {
                val = '0'
            }

            if (val !== '' && val !== '0') {
                val = val.replace(/^(0)+/gm, '');
                val = val.replace(/^\./, '0.');
            }

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
            parts[0] = parts[0].replace(/\d/gm, function(g, i, a) {
                return a[0] == 1 && a[1] == 0 && a[2] == 0 && i == 2 ? g : (i < 2 ? g : '');
            });
            if (parts.length > 1 && parts[0] != 100) {
                parts[1] = parts[1].replace(/\d/gm, function(g, i) {
                    return i < 2 ? g : '';
                });
                parts[0] = parts[0] + '.' + parts[1];
            }
            $(el).val(parts[0]);
        },
        percentiValue: function(el) {
            var val = $(el).val();
            val = val.replace(/\D/gm, '');

            if (+val > 100) {
                val = 100;
            }

            if (val == '00') {
                val = '0'
            }

            if (val !== '' && val !== '0') {
                val = val.replace(/^(0)+/gm, '');
                val = val.replace(/^\./, '0.');
            }

            $(el).val(val);
        }
    }
    try {
        myInput.init();
    } catch (e) { alert('Please update you jQuery!') }
}).call(this, jQuery)
