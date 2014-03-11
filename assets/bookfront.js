(function($){
	"use strict";

	var booklink = $('.bookmarklet'),
		bookmarks = $('.bookmarks'),
		recipe = window.location.pathname.split('/')[2],
		origin = window.location.origin,
		code = origin + '/bags/bookmarker/tiddlers/bookmarker-loader.js',
		html = origin + '/bags/bookmarker/tiddlers/bookmarker.html';

	function tagLink(bag, tag) {
		return '/search?q=bag:' + encodeURIComponent(bag) + '%20tag:'
			+ encodeURIComponent(tag);
	}

	function tankLink(tiddler) {
		var tank = tiddler.bag,
			title = tiddler.title;

		return '/tanks/' + encodeURIComponent(tank) + '/'
			+ encodeURIComponent(title);
	}

	function addTags(tiddler) {
		var ul = $('<ul>').addClass('tags');
		$.each(tiddler.tags, function(index, tag) {
			if (tag !== 'bookmark') {
				var tagItem = $('<li>'),
					searchLink = $('<a>');
				searchLink.attr('href', tagLink(tiddler.bag, tag)).text(tag);
				tagItem.append(searchLink);
				ul.append(tagItem);
			}
		});
		return ul;
	}

	function addBookmark(tiddler) {
		var li = $('<li>'),
			tiddlerLink = $('<a>'),
			originalLink = $('<a>');
		tiddlerLink.attr('href', tankLink(tiddler)).text(tiddler.title);
		originalLink.attr('href', tiddler.fields['url']).text('original');
		var tags = addTags(tiddler);
		li.append(tiddlerLink).append(originalLink).append(tags);
		bookmarks.append(li);
	}

	function retrieveBookmarks() {
		$.ajax({
			url: '/recipes/' + recipe
				+ '/tiddlers?select=tag:bookmark;sort=-modified',
			type: 'GET',
			dataType: 'json',
			success: function(tiddlers) {
				$.each(tiddlers, function(index, tiddler) {
					addBookmark(tiddler);
				});
			}
		});
	}

	// messy but meh
	var href = ["javascript:(function(a,b)%7Ba=b.createElement('script');",
		"a.setAttribute('src','", code , "');",
		"b.body.appendChild(a);",
		"a.addEventListener('load',function()%7BloadBookmarker('", html,
		"','", recipe, "');%7D,false);%7D(null,document))"].join('');
	booklink.attr('href', href);

	retrieveBookmarks();

})(jQuery);
