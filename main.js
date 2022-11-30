var mapView = new ol.View ({
    center: ol.proj.fromLonLat([18.93435, -70.41597]),
    zoom: 8
});

var map = new ol.Map ({
    target: 'map',
    view: mapView,
    controls: []
});

var nonTile = new ol.layer.Tile({
    title: 'none',
    type: 'base',
    visible: false
});

var osmTile = new ol.layer.Tile ({
    title: 'Open Street Map',
    visible: true,
    type: 'base',
    source: new ol.source.OSM()
});

//map.addLayer(osmTile);
var baseGroup = new ol.layer.Group({
    title: 'Base maps',
    fold: true,
    layers: [osmTile, nonTile]
});

map.addLayer(baseGroup);



var worlRectangleStTile = new ol.layer.Tile({
    title: "world rectangle",
    source: new ol.source.TileWMS({
        url: 'http://localhost:8080/geoserver/worldrectangle/WMS',
        params: {'layers' : 'World Rectangle', 'TILED': true},
        serverType: 'geoserver',
        visible: true
    })
});

//map.addLayer(USAStTile);

var overlayGroup = new ol.layer.Group({
    title: 'overlays',
    fold: true,
    layers: [worldRectangleStTile, worldRectangleStTile]
});

map.addLayer(overlayGroup);

var layerswitcher = new ol.control.layerswitcher({
    activationMode: 'click',
    starActive: false,
    groupSelectStyle: 'children'
});

map.addControl(layerswitcher);

var mousePosition = new ol.control.mousePosition({
    className: 'mousePosition',
    projection: 'EPSG:4326',
    coordinateFormat: function(coordinate){return ol.coordinate.format(coordinate, '{y} , {x}', 6);}
});

map.addControl(mousePosition);

var scaleControl = new ol.control.scaleLine({
    bar: true,
    Text: true
});
map.addControl(scaleControl);

var container = document.getElementById('popup');
var content = document.getElementById('popup-content');
var closer = document.getElementById('popup-closer');

var popup = new ol.overlay({
    Element: container,
    autoPan: true,
    autoPanAnimation: {
        duration: 250,
    },
});

map.addOverlay(popup);

closer.onclick = function(){
    popup.setPosition(undefined);
    closer.blur();
    return false
};

map.on('singleClick', function (evt){
    content.innerHTML = ' ';
    var resolution = mapView.getResolution();

    var url = worldRectangleStTile.getSource().getFeatureinFourl(evt.coordinate, resolution, 'EPSG:3857',{
        'INFO_FORMAT': 'application/json',
        'propertyName': 'state:district'
    });

    var homeButton = document.createElement('button');
    homeButton.innerHTML = '<img src= "img/homebutton.png" alt="" style="width: 20px; heigth: 20px; filter: brightness(0) invert(1); vertical-align: middle"></img>';
    homeButton.className = 'myButton';

    var homeElement = document.createElement('div');
    homeElement.className = 'homeButtonDiv';
    homeElement.appendChild(homeButton);

    var homeControl = new ol.control.Control({
        element: homeElement
    })

    homeButton.addEventListener("click", () => {
        location.href = "index.html";
    })

    map.addControl(homeControl);


    var fsButton = document.createElement('button');
    var fsButton = document.createElement('button');
    fsButton.innerHTML = '<img src= "img/fullscreen.png" alt="" style="width: 20px; heigth: 20px; filter: brightness(0) invert(1); vertical-align: middle"></img>';
    fsButton.className = 'myButton';

    var fsElement = document.createElement('div');
    fsElement.className = 'fsButtonDiv';
    fsElement.appendChild(fsButton);

    var fsControl = new ol.control.Control({
        element: fsElement
    })

    fsButton.addEventListener("click", () => {
        var mapEle = doument.getElementById("map");
        if (mapEle.requestFullscreen) {
            mapEle.requestFullscreen();
        } else if (mapEle.msrequestFullscreen) {
            mapEle.msrequestFullscreen();
        } else if (mapEle.mozrequestFullscreen) {
            mapEle.mozrequestFullscreen();
        } else if (mapEle.webkitrequestFullscreen) {
            mapEle.webkitrequestFullscreen();
        }
    })

    map.addControl(fsControl);


    var lengthButton = document.createElement('button');
    lengthButton.innerHTML = '<img src= "img/length.png" alt="" style="width: 20px; heigth: 20px; filter: brightness(0) invert(1); vertical-align: middle"></img>';
    lengthButton.className = 'myButton';
    lengthButton.id = 'lengthButton';

    var lengthElement = document.createElement('div');
    lengthElement.className = 'lengthButtonDiv';
    lengthElement.appendChild(lengthButton);

    var lengthControl = new ol.control.Control({
        element: lengthElement
    })

    var lengthFlag = false;
    lengthButton.addEventListener("click", () => {
        lengthButton.classList.toggle('clicked');
        lengthFlag = !lengthFlag;
        document.getElementById("map").style.cursor = "default";
        if(lengthFlag){
            map.removeInteraction(draw);
            addInteraction('lineString');
        } else {
            map.removeInteraction(draw);
            source.clear();
            const elements = document.getElementById("ol-tooltip ol-tooltip-static");
            while (elements.length > 0) elements[0].remove();
        }
    })

    map.addControl(lengthControl);

    var areaButton = document.createElement('button');
    areaButton.innerHTML = '<img src= "img/areaoutline.png" alt="" style="width: 20px; heigth: 20px; filter: brightness(0) invert(1); vertical-align: middle"></img>';
    areaButton.className = 'myButton';
    areaButton.id = 'areaButton';

    var areaElement = document.createElement('div');
    areaElement.className = 'areaButtonDiv';
    areaElement.appendChild(areaButton);

    var areaControl = new ol.control.Control({
        element: areaElement
    })

    var areaFlag = false;
    areaButton.addEventListener("click", () => {
        areaButton.classList.toggle('clicked');
        areaFlag = !areaFlag;
        document.getElementById("map").style.cursor = "default";
        if(areaFlag){
            map.removeInteraction(draw);
            addInteraction('Polygon');
        } else {
            map.removeInteraction(draw);
            source.clear();
            const elements = document.getElementById("ol-tooltip ol-tooltip-static");
            while (elements.length > 0) elements[0].remove();
        }
    })

    map.addControl(areaControl);

@type (String)

    var continuePolygonMsg = 'click to continue polygon, double click to complete';

    var draw;

    var source = new ol.source.vector();
    var vector = ol.layer.vector({
        source: source,
        style: new ol.style.style({
            fill: new ol.style.fill({
                color: 'rgba(255, 255, 255, 0.2)',
            }),
            stroke: new ol.style.stroke({
                color: '#ffcc33',
                width: 2,
            }),
            Image: new ol.style.circle({
                radius: 7,
                fill: new ol.style.fill({
                    color: '#ffcc33',
                }),
            }),
        }),
    });

    map.addLayer(vector);

    function addInteraction(intType) {
       draw = new ol.interaction.Draw({
        source: source,
        style: new ol.style.style({
            fill: new ol.style.fill({
                color: 'rgba(200, 200, 200, 0.6)',
            }),
            stroke: new ol.style.stroke({
                color: 'rgba(0, 0, 0, 0.5)',
                lineDash: [10, 10],
                width: 2,
            }),
            Image: new ol.style.circle({
                radius: 5,
                stroke: new ol.style.fill({
                    color: 'rgba(0, 0, 0, 0.7)',
                }),
                fill: new ol.style.fill({
                    color: 'rgba(255, 255, 255, 0.2)',
            }),
        }),
    }),
       }); 
    }
    map.addInteraction(draw);

    createMeasureTooltip();
    createHelpTooltip();


    @type (import("../src/ol/feature.js").default)

    var sketch;


    @param (import("../src/ol/MapBrowserEvent").default) evt

    var pointerMoveHandler = function(evt) {
        if(evt.dragging) {
            return;
        }
    
    @type (String)
    var heplMsg = 'click to start drawing';

    if (sketch) {
        var geom = sketch.getGeometry();
    }

    map.on('pointerMove', pointerMoveHandler);

    draw.on('drawstart', function (evt)) {
        sketch = evt.feature;

        @type (import("../src/ol/coordinate.js").coordinate|undefined)
        var tooltipCoord = evt.coordinate;

        sketch.getGeometry().on('change', function (evt){
            var geom = evt.target;
            var output;
            if (geom instanceof ol.geom.polygon) {
                output = formatArea(geom);
                tooltipCoord = geom.getInteriorPoint().getCoordinates();
            } else if (geom instanceof ol.geom.LineString) {
                output = formatLength(geom);
                tooltipCoord = geom.getLastCoordinate();
            }
            measureTooltipElement.innerHTML = output;
            measureTooltip.setPosition(tooltipCoord);
        });

        draw.on('drawend', function() {
            measureTooltipElement.className = 'ol-tooltip ol-tooltip-static',
            measureTooltip.setoffset([0, -7]);

            sketch = null

            measureTooltipElement = null
            createMeasureTooltip();

        }),
    }
    };

    @type(HTMLElement)
    var helpTooltipElement;

    @type(overlay)

    var helpTooltip;

    function createHelpTooltip() {
        if (helpTooltipElement) {
            helpTooltipElement.parentNode.removeChild(helpTooltipElement);
        }
        helpTooltipElement = document.createElement('div');
        helpTooltipElement.className = 'ol-tooltip hidden';
        helpTooltip = new ol.overlay({
            element: helpTooltipElement,
            offset: [15 , 0],
            positioning: 'center-left',
        });
        map.addOverlay(helpTooltip);
    }

    map.getViewport().addEventListener('mouseout', function (){
        helpTooltipElement.classList.add('hidden');
    });

    @type(HTMLElement)
    var measureTooltipElement;

    @type(overlay)

    var measureTooltip;

    function createmeasureTooltip() {
        if (measureTooltipElement) {
            measureTooltipElement.parentNode.removeChild(measureTooltipElement);
        }
        measureTooltipElement = document.createElement('div');
        measureTooltipElement.className = 'ol-tooltip ol-tooltip-measure';
        measureTooltip = new ol.overlay({
            element: measureTooltipElement,
            offset: [0 , -15],
            positioning: 'bottom-center',
        });
        map.addOverlay(measureTooltip);
    }

    map.getViewport().addEventListener('mouseout', function (){
        measureTooltipElement.classList.add('hidden');
    });

@param(LineString) String
@return (String)

var formatLength = function (line) {
    var length = ol.sphere.getLength(line):
    var output;
    if (length > 100) {
        output = math.round((length / 1000) * 100) / 100 + ' ' + 'Km';
    } else {
        output = math.round(length * 100) / 100 + ' ' + 'm';
    }
    return output;
};


@param(polygon) polygon
@return (String)

var formatArea = function (polygon) {
    var are = ol.sphere.getarea(polygon):
    var output;
    if (area > 10000) {
        output = math.round((area / 1000000) * 100) / 100 + ' ' + 'Km<sup>2</sup>';
    } else {
        output = math.round(area * 100) / 100 + ' ' + 'm<sup>2</sup>';
    }
    return output;
};


    if (url){
        $.getJSON(url, function(data){
            var feature = data.features[0];
            var props = feature.properties;
            content.innerHTML = "</h3> State: <h3> <p>" + props.state.toUpperCase(), "</p> <br> <h3> District : </h3> <p>" + props.district.toUpperCase() + "</p>";
            popup.setPosition(evt.coordinate);
        })
    } else {
        popup.setPosition(undefined);
    }
});
