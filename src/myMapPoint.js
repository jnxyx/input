(function($) {
    $.fn.myMapPoint = function(args) {
        if (this.length == 0) {
            return;
        }
        var sortArray = 'ABCDEFGHIJK';
        var self = this;
        var width = self.width();
        var height = self.height();
        var map, targetId = 'kjjmap' + parseInt(1e3 * Math.random());
        self.append('<div id="' + targetId + '" class="build-map" style="width:' + width + 'px; height:' + height + 'px"></div>');
        map = new BMap.Map(targetId);
        var center = new BMap.Point(116.331398, 39.897445);
        map.centerAndZoom(center, 11);
        map.enableScrollWheelZoom();
        map.enableContinuousZoom();

        function renderPoint(pointArgs, sortText) {
            var text = pointArgs.lable;
            var pointHtml = '<div class="point kjjmapId_' + pointArgs.id + '"><i>' + sortText + '</i><p><span></span>' + text + '</p></div>';
            var mapLabel = new BMap.Label(pointHtml, { position: pointArgs.point, offset: new BMap.Size(-22, -30) });
            mapLabel.addEventListener("click", function() {
                if (window.is_projectList) {
                    window.location.href = window.APP + _url + '/' + pointArgs.id;
                } else {
                    window.location.href = window.APP + _url + '/kongjian/' + pointArgs.id;
                }
            });
            mapLabel.addEventListener("mouseover", function(e) {
                var target = e.target.V;
                $(target).find('p').show();
            });
            mapLabel.addEventListener("mouseout", function(e) {
                var target = e.target.V;
                $(target).find('p').hide();
            });
            map.addOverlay(mapLabel);
        }
        return {
            target: self,
            renderMap: function(center, pointArray, texts) {
                map.clearOverlays();
                if (!center) return;
                var points = [];
                if (pointArray.length) {
                    for (var i = 0; i < pointArray.length; i++) {
                        var item = pointArray[i];
                        var point = new BMap.Point(item.point.lng, item.point.lat);
                        renderPoint(item, texts[i]);
                        points.push(point);
                    }
                }
                map.setViewport(points, { zoomFactor: -1 });
            },
            focus: function(current) {
                var id = current.id;
                $('.kjjmapId_' + id).find('i').addClass('focus');
            },
            blur: function(current) {
                var id = current.id;
                $('.kjjmapId_' + id).find('i').removeClass('focus');
            }
        }
    };
})(jQuery);
