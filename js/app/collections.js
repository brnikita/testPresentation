define(
    ['backbone', './models'],
    function (Backbone, Models) {
        var Collections = {
            /**
             * Класс создания коллекции презентаций
             *
             * @class
             */
            Presentations: Backbone.Collection.extend({

                /**
                 * Отсюда мы будем брать данные по нашим презентациям
                 *
                 * @private
                 * @name Collections.Presentations#url
                 * @type {String}
                 */
                url: 'presentations/index.json',

                /**
                 * Используемая модель
                 *
                 *  @private
                 *  @name Collections.Presentations#model
                 *  @type {Backbone.Model}
                 */
                model: Models.Presentation
            })
        };

        return Collections;
    });
