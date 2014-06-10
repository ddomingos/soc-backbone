$(function() { 
    $('#all-movies').append(movieListView.el);
    movieList.fetch(); 
    
    $('.movie').draggable();
});