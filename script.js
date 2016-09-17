var Sounds = function(){
	var self = this;
	this.client_id = 'CLIENT_ID';

	this.initialize = function(){
		SC.initialize({
		  client_id: self.client_id
		});
	}

	this.play = function(url){
		SC.get(url).then(function(sound, error) {
			var source = sound.stream_url + '?client_id=' + self.client_id;
  	  $('#player').attr('src', source);
		});
	}
}

var Sights = function(){
	this.render = function(){
		console.log("Hello, world!");
	}
}

var sight = new Sights();
var sound = new Sounds();

sound.initialize();
sound.play('/tracks/293');
