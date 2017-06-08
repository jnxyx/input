(function() {
    function myMapLocal(args) {
        if (this instanceof myMapLocal) {
            var self = this;
            self.options = {
                lng: args.lng || 116.331398,
                lat: args.lat || 39.897445,
                radius: args.radius
            };
            self.center = new BMap.Point(self.options.lng, self.options.lat);
            self.local = new BMap.LocalSearch(self.center, {
                renderOptions: {},
                onSearchComplete: function(localResult) {
                    var service = localResult.keyword;
                    localResult = localResult.ur;
                    var text = '',
                        resultArray = [];
                    if (!localResult || localResult.length == 0) {
                        self.serviceElement[service].parent().remove();
                        return;
                    }
                    for (var i = 0; i < (localResult.length > 5 ? 5 : localResult.length); i++) {
                        var item = localResult[i];
                        if (service == '地铁' || service == '公交') {
                            if (item['address'] != 'null') {
                                resultArray = resultArray.concat(item['address'].split(/[; ]/));
                                // text += item['address'] + ' ';
                            }
                        } else {
                            resultArray.push(item['title'].replace(/(\(.*?\))/, ''));
                            // text += item['title'] + ' ';
                        }
                    }
                    resultArray = duplicateArray(resultArray);
                    resultArray = resultArray.slice(0, 10);
                    text = resultArray.join('、');
                    self.serviceElement[service] && self.serviceElement[service].text(text);
                }
            });
            self.serviceElement = {};
            return self;
        } else {
            return new myMapLocal(args);
        }
    };

    function duplicateArray(array) {
        for (var i = 0; i < array.length; i++) {
            var item = array[i];
            if (array.slice(i + 1).indexOf(item) != -1) {
                array.splice(i, 1);
                i--;
            }
        }
        return array;
    };
    myMapLocal.prototype.search = function(service) {
        this.local.searchNearby(service, this.center, this.options.radius);
    };
    myMapLocal.prototype.getService = function(service, ele) {
        this.service = service;
        this.serviceElement[service] = ele;
        // this.serviceElement = ele;
        this.search(service);
    }
    window.myMapLocal = myMapLocal;
})();
