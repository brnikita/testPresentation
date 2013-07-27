define(
    ['backbone'],
    function (Backbone) {
        var Router = Backbone.Router.extend({

            /**
             * Объект вида презентаций
             *
             * @private
             * @name Router#presentationsView
             * @type {Backbone.View|null}
             */
            presentationsView: null,

            /**
             * @private
             * @name Router#currentPresentation
             * @type {String|null}
             */
            currentPresentation: null,

            /**
             * @private
             * @name Router#currentSlide
             * @type {String|null}
             */
            currentSlide: null,

            /**
             * Роуты
             *
             * @private
             * @name Router#routes
             * @type {Object}
             */
            routes: {
                '': 'index',
                ':presentation': 'changeTab',
                ':presentation/:slide': 'changeSlide'
            },

            /**
             * Обработчик индексного роута
             *
             * @private
             * @function
             * @name Router#index
             * @returns {undefined}
             */
            index: function () {
                var indexPresentation = this.presentationsView.collection.models[0].get('directory'),
                    indexSlide = this.presentationsView.collection.models[0].get('slides')[0];

                this.changeSlide(indexPresentation, indexSlide);
            },

            /**
             * @constructor
             * @name Router#initialize
             * @param {Backbone.View} presentationsView
             * @returns {undefined}
             */
            initialize: function(presentationsView){
                this.presentationsView = presentationsView;
                Backbone.history.start();
            },

            /**
             * Метод изменения текущего слайда
             *
             * @private
             * @function
             * @name Router#changeSlide
             * @param {String} presentation
             * @param {String} slide
             * @returns {undefined}
             */
            changeSlide: function (presentation, slide) {
                if (this.currentPresentation !== presentation) {
                    this.presentationsView.changeTab(presentation);
                }

                if(this.currentPresentation !== presentation || this.currentSlide !== slide){
                    this.presentationsView.changeSlide(presentation, slide);
                }

                this.currentPresentation = presentation;
                this.currentSlide = slide;
            },

            /**
             * Метод изменения текущего таба
             *
             * @private
             * @function
             * @name Router#changeTab
             * @param {String} presentation
             * @returns {undefined}
             */
            changeTab: function (presentation) {
                if (this.currentPresentation === presentation) {
                    return;
                }

                this.presentationsView.changeTab(presentation);
                this.currentSlide = this.presentationsView.collection.where({directory: presentation})[0].get('slides')[0];
                this.presentationsView.changeSlide(presentation, this.currentSlide);
                this.currentPresentation = presentation;
            }
        });

        return Router;
    });
