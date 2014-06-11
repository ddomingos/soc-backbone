$(function() { 
    var movieList = new MovieList();
    var movieListView = new MovieListView({ collection: movieList });

    var ratingList = new MovieList();
    var ratingListView = new MovieListView({ collection: ratingList });
    
    $('#all-movies').append(movieListView.el);
    movieList.fetch({
        success: function () {
            $('.movie').draggable();
        }
    }); 
    
    $('#epic').append(ratingListView.el);
    ratingList.fetch();
});