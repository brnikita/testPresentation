define(
    ['backbone'],
    function (Backbone) {
        var Models =  {
            Presentation: Backbone.Model.extend({

                /**
                 * @protected
                 * @name Presentation#defaults
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