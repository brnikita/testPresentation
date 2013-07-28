define(
    ['backbone'],
    function (Backbone) {

        /**
         * Объект, содержащий модели
         *
         * @public
         * @name Models
         * @type {Object}
         */
        var Models =  {
            Presentation: Backbone.Model.extend({

                /**
                 * @public
                 * @name Models.Presentation#defaults
                 * @type {Object}
                 */
                defaults: {
                    title: 'Новая презентация',
                    directory: 'index',
                    slides: [
                        'index.html'
                    ]
                }
            })
        };

        return Models;
    });