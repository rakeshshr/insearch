$(function() {


	  // `mainController` holds shared site functionality
	  var mainController = {

	    // compile underscore template for nav links
	    navTemplate: _.template($('#nav-template').html()),

	    // get current (logged-in) user
	    showCurrentUser: function() {
	      // AJAX call to server to GET /api/users/current
	      $.get('/api/users/current', function(user) {
	        console.log(user);

	        // pass current user through template for nav links
	        $navHtml = $(mainController.navTemplate({currentUser: user}));

	        // append nav links HTML to page
	        $('#nav-links').append($navHtml);
	      });
	    }
	  };

	  mainController.showCurrentUser();

	  $('#login-form').on("submit", function(event){
	    var userData = {
	      email: $("#login-user-email").val(),
	      password: $("#login-user-password").val()
	    };
	    $.post('/login', userData, function(response){
	      console.log(response);
	    });
	  });
	// });

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
  	//removes spaces from search input
  	var searchHash = $text.val().replace(/\s/g, '');
  	console.log('this is searchhash')
  	console.log(searchHash);

  	$.ajax({
  		type: 'GET',
  		url:'https://api.instagram.com/v1/tags/' + searchHash + '/media/recent?client_id=37b1b2aa5abe47afb6643e32fc8f236a', 
  		dataType: 'jsonp',
  		crossDomain: true,
  		success: function(data){
  			_.each(data.data, function(obj){
  				var image = (obj.images.low_resolution.url);
  				var text = (obj.caption.text);
  				var list = new HashList( image, text);
  				console.log(image, text);
  				
  				list.save();

  				list.render();
  			});
			}
		});

  	//results is where I'm pulling data from
  	$("#results").on("click", "img", function(e){
  	     console.log("image was clicked...",$(this))
  	     var $favImg = $(this);
  	     console.log("the fav pic", $favImg.html());
  	     var $image = $favImg.prev("img").find("favorites");
  	     console.log("the selected img", $image.attr(data) );
  	     // var favorite = checkedInputs.map(function(){
  	     	// {image: $(this).attr("src")}
  	     // });
  	     $.ajax({
  	       url: "/favorites",
  	       type: "POST",
  	       data: $favImg,
  	       success: function(data){
  	     	 var favorite = checkedInputs.map(function(){
  	       	{image: $(this).attr("src")
  	       	}
  	         // console.log("this post was added", data);
  	         // _.each($favImg, function(img) {
  	         //     $favImg.val(); 
  	         // });


  	     		});
					 }
  				});
				});
	});
});






