/*
    require jQuery
    require bdMap API
    require http://api.map.baidu.com/library/DrawingManager/1.4/src/DrawingManager_min.js
    require http://api.map.baidu.com/library/DrawingManager/1.4/src/DrawingManager_min.css
    created by xuyunxiang 2017.05.23
 */
(function($) {
    $.fn.myMapArea = function(args) {
        var self = $(this);
        if (self.length == 0) {
            return;
        }
        var defaults = {
            minZoom: 4,
            maxZoom: 19,
            enableMapClick: false,
            locationArray: [],
            isSetMoreArea: false
        };

        var options = $.extend(defaults, args);
        var map;

        self.data('point', []);
        self.data('locationArray', '');
        if (options.isSetMoreArea) {
            self.data('locationArray', []);
        }
        initMap();
        if (options.locationArray.length != 0) {
            renderAreas();
        }

        function initMap() {
            var bdOptions = $.extend({
                minZoom: 4,
                maxZoom: 19,
                enableMapClick: false
            }, options);
            map = new BMap.Map("locationMap", bdOptions);
            var zoom = 16;
            if (self.data('locationArray').length == 0) {
                zoom = 11;
            }
            map.centerAndZoom(new BMap.Point(116.307852, 40.057031), zoom);
            map.enableScrollWheelZoom();
            map.addControl(new BMap.MapTypeControl());
            initDrawTool(map);
        }

        // 编辑时读取区域
        function renderAreas() {
            var pointArray = [];
            for (var i = options.locationArray.length - 1; i >= 0; i--) {
                var locationItem = options.locationArray[i];
                pointArray = pointArray.concat(drawPolygon(locationItem));
            }

            map.setViewport(pointArray, { zoomFactor: 0 });
        }

        function initDrawTool(map) {
            //实例化鼠标绘制工具
            var drawingModes = [
                BMAP_DRAWING_POLYGON
            ];
            if (!options.isSetMoreArea) {
                drawingModes.push(BMAP_DRAWING_MARKER);
            }
            var myDrawingManagerObject = new BMapLib.DrawingManager(map, {
                isOpen: true, //是否开启绘制模式
                drawingType: BMAP_DRAWING_POLYGON,
                enableDrawingTool: true, //是否显示工具栏
                drawingToolOptions: {
                    anchor: BMAP_ANCHOR_TOP_LEFT, //位置
                    offset: new BMap.Size(5, 5), //偏离值
                    drawingTypes: [
                        BMAP_DRAWING_MARKER,
                        BMAP_DRAWING_CIRCLE,
                        BMAP_DRAWING_POLYLINE,
                        BMAP_DRAWING_POLYGON,
                        BMAP_DRAWING_RECTANGLE
                    ],
                    drawingModes: drawingModes
                },
                polygonOptions: {
                    strokeColor: "red",
                    fillColor: "white",
                    strokeWeight: 3,
                    strokeOpacity: 0.8,
                    fillOpacity: 0.6,
                    strokeStyle: 'solid'
                },
            });
            myDrawingManagerObject.setDrawingMode(BMAP_DRAWING_POLYGON);
            myDrawingManagerObject.addEventListener("markercomplete", function(e, overlay) {
                var point = overlay.getPosition();
                var pointArray = self.data('point');
                // pointArray.push(point);
                pointArray = [point];
                self.data('point', pointArray);
            });
            myDrawingManagerObject.addEventListener("polygoncomplete", function(e, overlay) {
                var linePath = [];
                var locationArray = [];
                linePath = overlay.getPath();
                for (var i = 0; i < linePath.length; i++) {
                    locationArray.push(linePath[i].lng + "," + linePath[i].lat);
                }
                locationArray = locationArray.join(";");
                var locationsArray = self.data('locationArray');
                locationsArray.push ? locationsArray.push(locationArray) : locationsArray = locationArray;
                self.data('locationArray', locationsArray);
            });
        }

        function drawPolygon(locationArray) {
            if (!map) {
                return;
            }
            var pointArray = locationArray.split(";");
            var polygonArray = [];
            for (var i = 0; i < pointArray.length; i++) {
                var pointItem = pointArray[i];
                var pointItemArray = pointItem.split(",");
                var bdPoint = new BMap.Point(+pointItemArray[0], +pointItemArray[1]);
                polygonArray.push(bdPoint);
            }
            var polygon = new BMap.Polygon(polygonArray, { strokeColor: "#333", fillColor: "transparent", strokeStyle: 'dashed', strokeWeight: 2, fillOpacity: 0 });
            map.addOverlay(polygon);

            return polygonArray;
        }

        return {
            map: map,
            center: null,
            // 设置地图中心
            setCenter: function(point) {
                var type = 1;
                initMap();
                map.addEventListener('tilesloaded', function() {
                    if (type == 0) return;
                    type = 0;
                    map.removeEventListener('tilesloaded');
                    point = !!point.lat ? new BMap.Point(+point.lng, +point.lat) : new BMap.Point(116.307852, 40.057031);
                    map.centerAndZoom(point, 16);

                    // 设置片区
                    renderAreas();
                });
            },
            // 获取地图数据
            getData: function() {
                return {
                    point: self.data('point'),
                    locationArray: self.data('locationArray')
                };
            },
            // 设置地图数据
            setData: function(point, locationArray) {
                initMap();
                var returnObj = this;
                var type = 1;
                map.addEventListener('tilesloaded', function() {
                    if (type == 0) return;
                    type = 0;
                    map.removeEventListener('tilesloaded');
                    returnObj.clearMap();
                    point = !!point.lat ? new BMap.Point(+point.lng, +point.lat) : new BMap.Point(116.307852, 40.057031);

                    map.centerAndZoom(point, 16);
                    var marker = new BMap.Marker(point);
                    map.addOverlay(marker);

                    var pointArray = locationArray.split(";");
                    var polygonArray = [];
                    for (var i = 0; i < pointArray.length; i++) {
                        var pointItem = pointArray[i];
                        var pointItemArray = pointItem.split(",");
                        var bdPoint = new BMap.Point(+pointItemArray[0], +pointItemArray[1]);
                        polygonArray.push(bdPoint);
                    }
                    var polygon = new BMap.Polygon(polygonArray, { strokeColor: "blue", strokeWeight: 2, strokeOpacity: 0.5 });
                    map.addOverlay(polygon);

                    // 设置片区
                    renderAreas();

                    self.data('point', [point]);
                    self.data('locationArray', locationArray);
                });
            },

            setMoreArea: function(locationArray) {
                initMap();
                var type = 1;
                map.addEventListener('tilesloaded', function() {
                    if (type == 0) return;
                    type = 0;
                    map.removeEventListener('tilesloaded');

                    var pointArray = [];
                    for (var i = locationArray.length - 1; i >= 0; i--) {
                        var locationItem = locationArray[i];
                        pointArray = pointArray.concat(drawPolygon(locationItem));
                    }

                    map.setViewport(pointArray, { zoomFactor: 0 });
                });
            },
            renderAreas: function() {
                var type = 1;
                initMap();
                map.addEventListener('tilesloaded', function() {
                    if (type == 0) return;
                    type = 0;
                    map.removeEventListener('tilesloaded');
                    renderAreas();
                });
            },
            // 清楚地图数据
            clearMap: function() {
                map.clearOverlays();
                // 重置数据
                self.data('point', []);
                var clearData = options.isSetMoreArea ? [] : '';
                self.data('locationArray', clearData);

                initMap();
                // initDrawTool(map);
            }
        };
    }
})(jQuery)
