$(function() {
    var movieList = new MovieList();
    var movieListView = new MovieListView({ collection: movieList });

    var ratingList = new MovieList();
    var ratingListView = new MovieListView({ collection: ratingList });

    $('#all-movies').append(movieListView.el);
    movieList.fetch({
        data: { rating: 0 },
        success: function () {
            movieListView.$el.find('.movie').draggable({
                revert: 'invalid',
            });
        }
    });

    $('#epic').append(ratingListView.el);
    ratingList.fetch({
        data: { rating: 7 },
        success: function() {
            ratingListView.$el.find('.movie').draggable({
                revert: 'invalid',
            });
        }
    });

    // Droppable Actions
    $('.movie-column').droppable({
        accept: '.movie',
        hoverClass: 'hovered',
        drop: function(event, ui) {
            var movieID = ui.draggable.data('id');
            ui.draggable.remove();
            var rating = $(this).data('rating');

            var movieItem = new MovieModel({ id: movieID });
            movieItem.fetch({
                success: function(model, response) {
                    model.set({'rating': rating });
                    model.save();
                    ratingList.add(model);
                }
            });
        }
    });
});