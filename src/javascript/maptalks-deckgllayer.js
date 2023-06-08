/*!
 * maptalks-deckgllayer v0.0.1
 * LICENSE : MIT
 * (c) 2016-2019 maptalks.org
 */
/*!
 * requires maptalks@^0.25.1 
 */
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('maptalks'), require('deck.gl')) :
	typeof define === 'function' && define.amd ? define(['exports', 'maptalks', 'deck.gl'], factory) :
	(factory((global.maptalks = global.maptalks || {}),global.maptalks,global.deck));
}(this, (function (exports,maptalks,deck) { 'use strict';

function _defaults(obj, defaults) { var keys = Object.getOwnPropertyNames(defaults); for (var i = 0; i < keys.length; i++) { var key = keys[i]; var value = Object.getOwnPropertyDescriptor(defaults, key); if (value && value.configurable && obj[key] === undefined) { Object.defineProperty(obj, key, value); } } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : _defaults(subClass, superClass); }

var options = {
    'container': 'front',
    'renderer': 'dom',
    'zoomOffset': 0
};

var DeckGLLayer = function (_maptalks$Layer) {
    _inherits(DeckGLLayer, _maptalks$Layer);

    function DeckGLLayer() {
        _classCallCheck(this, DeckGLLayer);

        return _possibleConstructorReturn(this, _maptalks$Layer.apply(this, arguments));
    }
    DeckGLLayer.prototype.setProps = function setProps(props) {
        var render = this._getRenderer();
        this.props = maptalks.Util.extend({}, props);
        var options = this._initDeckOption(props);
        if (render) {
            render.deckgl.setProps(options);
        }
        return this;
    };

    DeckGLLayer.prototype.onRemove = function onRemove() {
        if (this.syncAnimation) cancelAnimationFrame(this.syncAnimation);
        var render = this._getRenderer();
        if (render) {
            render.deckgl.finalize();
        }
        _maptalks$Layer.prototype.onRemove.call(this);
    };

    DeckGLLayer.prototype.setOpacity = function setOpacity(opacity) {
        var render = this._getRenderer();
        if (render) {
            var container = render._container;
            container.style.opacity = opacity;
        }
        return this;
    };

    DeckGLLayer.prototype.getOpacity = function getOpacity() {
        var render = this._getRenderer();
        if (render) {
            var container = render._container;
            return Math.min(1, parseFloat(container.style.opacity));
        }
        return 0;
    };

    DeckGLLayer.prototype.setZIndex = function setZIndex(z) {
        var render = this._getRenderer();
        if (render) {
            var container = render._container;
            container.style.zIndex = z;
        }
        return this;
    };

    DeckGLLayer.prototype.getZIndex = function getZIndex() {
        var render = this._getRenderer();
        if (render) {
            var container = render._container;
            if (container) return container.style.zIndex;
        }
        return 0;
    };

    DeckGLLayer.prototype.show = function show() {
        var render = this._getRenderer();
        if (render) {
            render.show();
        }
        return this;
    };

    DeckGLLayer.prototype.hide = function hide() {
        var render = this._getRenderer();
        if (render) {
            render.hide();
        }
        return this;
    };

    DeckGLLayer.prototype._initDeckOption = function _initDeckOption() {
        var _this2 = this;

        var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        var layers = options.layers || [];
        var newLayers = [];
        layers.forEach(function (element) {
            newLayers.push(_this2._getDeckLayer(element));
        });
        options.layers = newLayers;
        return options;
    };

    DeckGLLayer.prototype._getDeckLayer = function _getDeckLayer() {
        var layer = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        var type = layer.layerType;
        var options = maptalks.Util.extend({}, layer);
        return new deck[type](options);
    };

    return DeckGLLayer;
}(maptalks.Layer);

DeckGLLayer.mergeOptions(options);

var DeckGLRenderer = function () {
    function DeckGLRenderer(layer) {
        _classCallCheck(this, DeckGLRenderer);

        this.layer = layer;
    }

    DeckGLRenderer.prototype.render = function render() {
        if (!this._container) {
            this._createLayerContainer();
        }
        this.sync();
        this.layer.fire('layerload');
    };

    DeckGLRenderer.prototype.drawOnInteracting = function drawOnInteracting() {
        this.sync();
    };

    DeckGLRenderer.prototype.sync = function sync() {
        var props = this.getView();
        if (this.deckgl) {
            if (this.deckgl.setProps) {
                this.deckgl.setProps({ viewState: maptalks.Util.extend({}, props) });
            }
        }
    };

    DeckGLRenderer.prototype.needToRedraw = function needToRedraw() {
        var map = this.getMap();
        var renderer = map._getRenderer();
        return map.isInteracting() || renderer && (renderer.isStateChanged && renderer.isStateChanged() || renderer.isViewChanged && renderer.isViewChanged());
    };

    DeckGLRenderer.prototype.getMap = function getMap() {
        return this.layer.getMap();
    };

    DeckGLRenderer.prototype._isVisible = function _isVisible() {
        return this._container && this._container.style.display === '';
    };

    DeckGLRenderer.prototype.show = function show() {
        if (this._container) {
            this._container.style.display = '';
        }
    };

    DeckGLRenderer.prototype.hide = function hide() {
        if (this._container) {
            this._container.style.display = 'none';
        }
    };

    DeckGLRenderer.prototype.setZIndex = function setZIndex(z) {
        this._zIndex = z;
        if (this._container) {
            this._container.style.zIndex = z;
        }
    };

    DeckGLRenderer.prototype.getZIndex = function getZIndex() {
        return this._zIndex || 0;
    };

    DeckGLRenderer.prototype.remove = function remove() {
        this._removeLayerContainer();
    };

    DeckGLRenderer.prototype.isCanvasRender = function isCanvasRender() {
        return false;
    };

    DeckGLRenderer.prototype.initDeckGL = function initDeckGL() {
        var deckOption = {
            canvas: this._container.firstChild
        };
        var options = maptalks.Util.extend({}, deckOption, { viewState: this.getView() });
        this.deckgl = new deck.Deck(options);
        var layer = this.layer;
        if (layer && layer.props) {
            layer.setProps(layer.props);
        }
    };

    DeckGLRenderer.prototype._createLayerContainer = function _createLayerContainer() {
        var container = this._container = maptalks.DomUtil.createEl('div');
        var canvas = document.createElement('canvas');
        canvas.getContext('webgl2', { preserveDrawingBuffer: true });
        container.appendChild(canvas);

        container.style.cssText = 'position:absolute;left:0px;top:0px;opacity:1;';
        if (this._zIndex) {
            container.style.zIndex = this._zIndex;
        }
        this._resetContainer();
        var parentContainer = this.layer.options['container'] === 'front' ? this.getMap()._panels['frontStatic'] : this.getMap()._panels['backStatic'];
        parentContainer.appendChild(container);
        if (!this.deckgl) this.initDeckGL();
    };

    DeckGLRenderer.prototype._removeLayerContainer = function _removeLayerContainer() {
        if (this._container) {
            maptalks.DomUtil.removeDomNode(this._container);
        }
        delete this._levelContainers;
    };

    DeckGLRenderer.prototype._resetContainer = function _resetContainer() {
        var size = this.getMap().getSize();
        this._container.style.width = size.width + 'px';
        this._container.style.height = size.height + 'px';
        var canvas = this._container.firstChild;
        canvas.width = '100%';
        canvas.height = '100%';
        this.sync();
    };

    DeckGLRenderer.prototype.getEvents = function getEvents() {
        return {
            // '_zoomstart': this.onZoomStart,
            // '_zoomend': this.onZoomEnd,
            // '_zooming': this.onZoomEnd,
            // '_dragrotatestart': this.onDragRotateStart,
            // '_dragrotateend': this.onDragRotateEnd,
            // '_movestart': this.onMoveStart,
            // '_moving': this.onMoveStart,
            // '_moveend': this.onMoveEnd,
            '_resize': this._resetContainer
        };
    };

    DeckGLRenderer.prototype.getView = function getView() {
        var map = this.getMap();
        var zoomOffset = this.layer.options.zoomOffset;
        // const res = map.getResolution();
        var center = map.getCenter(),
            zoom = map.getZoom(),
            bearing = map.getBearing(),
            pitch = map.getPitch(),
            maxZoom = map.getMaxZoom();
        // const size = map.getSize();
        return {
            longitude: center.x,
            latitude: center.y,
            zoom: getMapBoxZoom(map.getResolution()) - zoomOffset,
            maxZoom: maxZoom - 1,
            pitch: pitch,
            bearing: bearing,
            width: '100%',
            height: '100%'
        };
    };

    return DeckGLRenderer;
}();

var MAX_RES = 2 * 6378137 * Math.PI / (256 * Math.pow(2, 20));
function getMapBoxZoom(res) {
    return 19 - Math.log(res / MAX_RES) / Math.LN2;
}
DeckGLLayer.registerRenderer('dom', DeckGLRenderer);

exports.DeckGLLayer = DeckGLLayer;
exports.DeckGLRenderer = DeckGLRenderer;

Object.defineProperty(exports, '__esModule', { value: true });

typeof console !== 'undefined' && console.log('maptalks-deckgllayer v0.0.1, requires maptalks@^0.25.1.');

})));