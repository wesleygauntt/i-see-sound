var Sights = function(){
	var self = this;
	this.bars = [];

	this.render = function(height, frequencyData){
		var length = self.bars.length;

    for (var i = 0; i < length; i++) {
      var bar = self.bars[i];
      bar.height((frequencyData[i] / 250) * height + 'px');
    }
	}

	this.prepare = function(height, width, count){
	  var barWidth = (width / count);

	  for (var i = 0; i < count; i++) {
      var left = barWidth * i;
      var $d = $("<div>", {class: "bar", style: `left: ${left}px; width: ${barWidth}px`});
      self.bars.push($d);
      $('#visualization').append($d);
	  }
	}
}

var Sounds = function(){
	var self = this;
	this.client_id = 'CLIENT_ID';

	this.initialize = function(){
		SC.initialize({
		  client_id: self.client_id
		});
	}

	this.loadTrack = function(url){
		SC.get(url).then(function(sound, error) {
			var source = sound.stream_url + '?client_id=' + self.client_id;
  	  $('#player').attr('crossOrigin', 'anonymous');
  	  $('#player').attr('src', source);
		});
	}

	/*
		https://www.patrick-wied.at/blog/how-to-create-audio-visualizations-with-javascript-html
	*/
	this.play = function(){
		var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
		var audioElement = document.getElementById('player');
		var audioSrc = audioCtx.createMediaElementSource(audioElement);
		var analyser = audioCtx.createAnalyser();

		// Bind our analyser to the media element source.
		audioSrc.connect(analyser);
		audioSrc.connect(audioCtx.destination);

		var frequencyData = new Uint8Array(analyser.frequencyBinCount);
		
		sights.prepare(200, 400, (analyser.frequencyBinCount / 2));
		// we're ready to receive some data!
		function renderFrame() {
		   requestAnimationFrame(renderFrame);
		   // update data in frequencyData
		   analyser.getByteFrequencyData(frequencyData);
		   // render frame based on values in frequencyData
		   sights.render(400, frequencyData)
		}
		renderFrame();
	}
}


var sights = new Sights();
var sound = new Sounds();
sound.initialize();
sound.loadTrack('/tracks/195549412');
sound.play();
