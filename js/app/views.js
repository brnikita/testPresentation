define(
    ['backbone', './collections'],
    function (Backbone, Collections) {

        /**
         * Возарвщает шаблон по id
         *
         * @private
         * @function
         * @name template
         * @param {String} id Указываем id шаблона для рендеринга
         * @returns {Object}
         */
        var template = function (id) {
            return _.template($('#' + id).html());
        };

        /**
         * Объект содержащий классы видов
         *
         * @private
         * @name Views
         * @type {Object}
         */
        var Views = {

            /**
             * Класс создания вида таба
             *
             * @class
             */
            Tab: Backbone.View.extend({

                /**
                 * @private
                 * @name Views.Tab#tagName
                 * @type {String}
                 */
                tagName: 'li',

                /**
                 * Шаблон таба
                 *
                 * @private
                 * @name Views.Tab#template
                 * @type {String}
                 */
                template: template('tabTemplate'),

                /**
                 * Отрисовываем таб
                 *
                 * @public
                 * @function
                 * @name Views.Tab#render
                 * @returns {Presentation}
                 */
                render: function () {
                    this.$el.html(this.template(this.model.toJSON(null))).attr('data-tab', this.model.get('directory'));
                    return this;
                }
            }),

            /**
             * Класс создания вида отдельной презентации
             *
             * @class
             */
            Presentation: Backbone.View.extend({

                /**
                 * @private
                 * @name Views.Presentation#tagName
                 * @type {String}
                 */
                tagName: 'li',

                /**
                 * @private
                 * @name Views.Presentation#className
                 * @type {String}
                 */
                className: 'tab-pane',

                /**
                 * Шаблон презентации
                 *
                 * @private
                 * @name Views.Presentation#template
                 * @type {String}
                 */
                template: template('presentationTemplate'),

                /**
                 * Отрисовываем презентацию
                 *
                 * @public
                 * @function
                 * @name Views.Presentation#render
                 * @returns {Presentation}
                 */
                render: function () {
                    this.$el.html(this.template(this.model.toJSON(null))).attr('data-presentation', this.model.get('directory'));
                    return this;
                }
            }),

            /**
             * Класс создания вида нескольких презентаций
             *
             * @class
             */
            Presentations: Backbone.View.extend({

                /**
                 * Коневой элемент для табов
                 *
                 * @private
                 * @name Views.Presentation#$tabsWrapper
                 * @type {jQuery}
                 */
                $tabsWrapper: $('#tabs-panel'),

                /**
                 * DOM элемент большого слайда
                 *
                 * @private
                 * @name Views.Presentation#$currentSlide
                 * @type {jQuery}
                 */
                $currentSlide: $('iframe', '#current-slide'),

                /**
                 * Id корневого элемента
                 *
                 * @private
                 * @name Views.Presentations#el
                 * @type {String}
                 */
                el: '#presentations-list',

                /**
                 * Отрисовываем список презентаций
                 *
                 * @public
                 * @function
                 * @name Views.Presentations#render
                 * @returns {Backbone.View}
                 */
                render: function () {
                    this.collection.each(this.addOne, this);
                    return this;
                },

                /**
                 * Добавляем презентацию
                 *
                 * @private
                 * @function
                 * @name Views.Presentations#addOne
                 * @param {Backbone.Model} presentation
                 * @returns {undefined}
                 */
                addOne: function (presentation) {
                    var presentationView = new Views.Presentation({model: presentation}),
                        tabView = new Views.Tab({model: presentation});

                    this.$tabsWrapper.append(tabView.render().el);
                    this.$el.append(presentationView.render().el);
                },

                /**
                 * @constructor
                 * @name Views.Presentations#initialize
                 * @returns {undefined}
                 */
                initialize: function () {
                    this.collection = new Collections.Presentations();
                    this.collection.bind('reset', this.render, this);
                    this.collection.fetch({reset: true});
                },

                /**
                 * Метод изменения текущего слайда, нужен для роутера
                 *
                 * @public
                 * @function
                 * @name Views.Presentations#changeSlide
                 * @param {String} presentation
                 * @param {String} slide
                 * @returns {undefined}
                 */
                changeSlide: function (presentation, slide) {
                    this.$currentSlide.attr('src', '/presentations/' + presentation + '/' + slide);
                },

                /**
                 * Метод изменения текущего таба, нужен для роутера
                 *
                 * @public
                 * @function
                 * @name Views.Presentations#changeTab
                 * @param {String} presentation
                 * @returns {undefined}
                 */
                changeTab: function (presentation) {
                    $('.active', this.$tabsWrapper).removeClass('active');
                    $('li[data-tab="' + presentation + '"]', this.$tabsWrapper).addClass('active');

                    $('.active', this.$el).removeClass('active');
                    $('li[data-presentation="' + presentation + '"]', this.$el).addClass('active');
                }
            })
        };

        return Views;
    });