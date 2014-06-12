var MovieModel = Backbone.Model.extend({
    urlRoot: '/movies',
    parse: function(response) {
        if (response.length) {
            response = response[0];
            console.log(response);
        }
        if (typeof(response._id)  != 'undefined' && response._id != null) {
            response.id = String(response._id);
            delete response._id;
        }
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
    attributes: function() {
        return { 'data-id': this.model.get('id') };
    },
    template: _.template('<p><strong><%= title %></strong> (<%= year %>)</span></p><p><%= role %></p>'),
    initialize: function() {
        this.model.on('change', this.render, this);
    },
    render: function () {
        var attributes = this.model.attributes;
        this.$el.html(this.template(attributes));
        return this;
    },
    getID: function() {
        return this.model.get('id');
    }
});

var MovieList = Backbone.Collection.extend({
    url: '/movies',
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