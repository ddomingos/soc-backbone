var MovieModel = Backbone.Model.extend({
    urlRoot: 'http://localhost:3000/movies',
    parse: function(response) {
        if (response.length) response = response[0];
        response.id = response._id;
        delete response._id;
        return response;
    },
    toJSON: function() {
        var attrs = _.clone(this.attributes);
        attrs = _.omit(attrs, 'id');
        return attrs;
    }
});

var MovieView = Backbone.View.extend({
    tagName: 'li',
    className: 'movie',
    template: _.template('<p><strong><%= title %></strong> (<%= year %>)</span></p><p><%= role %></p>'),
    initialize: function() {
        this.model.on('change', this.render, this);  
    },
    render: function () {
        var attributes = this.model.attributes;
        this.$el.html(this.template(attributes));
        return this;
    }
});

var MovieList = Backbone.Collection.extend({
    url: 'http://localhost:3000/movies',
    model: MovieModel,  
});


var MovieListView = Backbone.View.extend({
    tagName: 'ul',
    className: 'movie-list',
    initialize: function() {
        this.collection.on('add', this.addOne, this);
        this.collection.on('reset', this.addAll, this);
    },
    render: function() {
        this.addAll();
    },
    addOne: function(movieItem) {
        var movieView = new MovieView({ model: movieItem });
        this.$el.append(movieView.render().el);
    },
    addAll: function() {
        this.collection.forEach(this.addOne, this);
    },
});