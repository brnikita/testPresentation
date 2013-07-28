require.config({
    urlArgs: "bust=" + (new Date()).getTime(),
    paths: {
        "jquery": "libs/jquery",
        "underscore": "libs/underscore",
        "backbone": "libs/backbone",
        "bootstrap": "libs/bootstrap",
        "json2": "libs/json2"
    },

    shim: {
        "bootstrap": ["jquery"],
        "backbone": {
            "deps": ["underscore", "jquery", "json2"],
            "exports": "Backbone"

        }
    }
});

var App = {

    /**
     * Объект роутера
     *
     * @public
     * @name App.router
     * @type {Backbone.Router|null}
     */
    router: null,

    /**
     * Объект вида презентаций
     *
     * @public
     * @name App.presentationsView
     * @type {Backbone.View|null}
     */
    presentationsView: null,

    /**
     * Настройки для зуммирования iFrame
     *
     * @private
     * @name App.options
     * @type {Object|null}
     */
    options: null,

    /**
     * @public
     * @function
     * @name App.init
     * @param {Backbone.View} Views
     * @param {Backbone.Router} Router
     * @returns {undefined}
     */
    init: function (Views, Router) {
        this.presentationsView = new Views.Presentations();
        this.presentationsView.collection.bind('reset', function () {
            this.router = new Router(this.presentationsView);
        }, this);

        this.options = {
            topOffset: 200, //Верхний отступ для основного сдайда
            leftOffset: 285, //Левый отступ для основного сдайда
            frameContentWidth: 1024,
            frameContentHeight: 768
        };

        this.addListeners();
        this.windowResize();

    },

    /**
     * Добавляем обработчики событий
     *
     * @private
     * @function
     * @name App.addListeners
     * @returns {undefined}
     */
    addListeners: function () {
        $('#previous-slide').on('click', _.bind(this.previousOrNextSlide, this, false));
        $('#next-slide').on('click', _.bind(this.previousOrNextSlide, this, true));
        $(window).on('resize', _.bind(this.windowResize, this));
    },

    /**
     * Клик по кнопке 'Предыдущий' или 'Следующий'
     *
     * @private
     * @function
     * @name App.previousOrNextSlide
     * @param {boolean} next Если мы хотим получить следующий слайд
     * @returns {undefined}
     */
    previousOrNextSlide: function (next) {
        var currentPresentation = this.router.currentPresentation,
            currentSlide = this.router.currentSlide,
            slides = this.presentationsView.collection.where({'directory': currentPresentation})[0].get('slides'),
            currentSlideIndex = slides.indexOf(currentSlide),
            slide;

        if(next) {
           slide = currentSlideIndex === slides.length - 1 ? slides[0] : slides[currentSlideIndex + 1];
        } else {
            slide = currentSlideIndex === 0 ? _.last(slides) : slides[currentSlideIndex - 1];
        }

        this.router.navigate('/' + currentPresentation + '/' + slide, {trigger: true});
    },

    /**
     * @private
     * @function
     * @name App.frameZoom
     * @param {Number} zoom
     * @returns {undefined}
     */
    frameZoom: function (zoom) {
        var frame = $('iframe', "#presentation-main");

        frame.css({
            "-ms-transform": "scale(" + zoom + ")",
            "-moz-transform": "scale(" + zoom + ")",
            "-o-transform": "scale(" + zoom + ")",
            "-webkit-transform": "scale(" + zoom + ")"
        });

        $("#current-slide").css({"width": (1024 * zoom).toFixed(0), "height": (768 * zoom).toFixed(0)});
    },

    /**
     * Обработчик события window.resize
     *
     * @private
     * @function
     * @name App.windowResize
     * @returns {undefined}
     */
    windowResize: function () {
        var height = $(window).height() - this.options.topOffset,
            width = $(window).width() - this.options.leftOffset,
            zoomHeight = Math.floor((height / this.options.frameContentHeight) * 100) / 100,
            zoomWidth = Math.floor((width / this.options.frameContentWidth) * 100) / 100,
            zoom = (zoomHeight >= zoomWidth) ? zoomWidth : zoomHeight;

        if (zoom > 0.2) {
            this.frameZoom(zoom);
        }

        if (height > 170) {
            $("#presentations-list").css({"height": height});
        }
    }
};

require(
    ['app/views', 'app/router', 'bootstrap'],
    function (Views, Router) {
        App.init(Views, Router);
    }
);