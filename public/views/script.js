$(function() {

	// Constructor

	function HashList(image, text){
		this.image = image;
		this.text = text;
	}
	HashList.all = [];

	HashList.prototype.save = function(){
		HashList.all.push(this);
		console.log(HashList.all);
	};

	HashList.prototype.render = function(){
		var $hashTemp = _.template($('#hash-template').html());
		var $hashT = ($hashTemp(this));
		var index = HashList.all.indexOf(this);
		// $hashT.attr('data-index', index);
		$results.append($hashT);
  }

	var $hashSearch = $('#hash-search');
	var $text = $('#hashtag');
	var $results = $('#results');
	var $hashTemp = _.template($('#hash-template').html());

  $hashSearch.on('submit', function(event){
  	event.preventDefault();
  	console.log('submitform')
  	var searchHash = $text.val(); //strip spacing from search
  	console.log('this is searchhash')
  	console.log(searchHash);

  	$.ajax({
  		type: 'GET',
  		url:'https://api.instagram.com/v1/tags/' + searchHash + '/media/recent?client_id=37b1b2aa5abe47afb6643e32fc8f236a', 
  		dataType: 'jsonp',
  		crossDomain: true,
  		success: function(data){
  			var getImageArray = (data.data[0].images.low_resolution.url)
  			var getCapArray = (data.data[0].tags.text)
  			_.each(data.data, function(obj){
  				var image = (obj.images.low_resolution.url);
  				var text = (obj.caption.text);
  				var list = new HashList( image, text);
  				console.log(image, text);
  				
  				list.save();

  				list.render();

  			});
			});
		});
	});
});



// standard_resolution
// low_resolution
// thumbnail




