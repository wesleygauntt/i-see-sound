var color1 = '#9dd53a';
var color2 = '#80c217';

var Sights = function(){
	var self = this;
	this.bars = [];

	this.render = function(height, frequencyData){
		var length = self.bars.length;

    for (var i = 0; i < length; i++) {
      var bar = self.bars[i];
      bar.height((frequencyData[i] / 250) * height + 'px');
      // bar.height((frequencyData[i] / 500) * height + 'px');
    }
	}

	this.prepare = function(height, width, count){
	  var barWidth = (width / count);
	  var background = `linear-gradient(to bottom, ${color1} 0%,${color1} 50%,${color2} 52%,${color2} 99%);`;

	  for (var i = 0; i < count; i++) {
      var left = barWidth * i;
      var $d = $("<div>", {class: "bar", style: `left: ${left}px; width: ${barWidth}px; background: ${background}`});
      self.bars.push($d);
      $('#visualization').append($d);
	  }
	}


	/*
		Reference for the math behind the circular rendering.
		https://www.patrick-wied.at/blog/how-to-create-audio-visualizations-with-javascript-html
	*/
	this.circle = function(height, width, count){
		var center = width / 1.5;
		var circleMaxWidth = (width * 0.5) >> 0;
		var radius = circleMaxWidth * 0.2;
		var twopi = 2 * Math.PI;
		var change = twopi / count;
		var circlesEl = $('#visualization');
    var transformOrigin = '0px 0px';

		for (var i = 0; i < twopi; i += change) {
				var left = (center + radius * Math.cos(i)) + 'px';
		    var top = (center + radius * Math.sin(i)) + 'px';
		    var transform = 'rotate(' + (i - (Math.PI / 2)) + 'rad)';
		    var style = `left: ${left}; top: ${top}; transform: ${transform}; transform-origin: ${transformOrigin};`;
				var $d = $("<div>", {class: "circular-bar", style: style});

		    self.bars.push($d);
		    circlesEl.append($d);
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

	this.loadTrackFromUrl = function(trackUrl){
		var url = 'https://api.soundcloud.com/resolve.json?url=' + trackUrl + '&client_id=' + self.client_id;
		console.log('url: ', url);
		$.ajax({
			method: 'GET',
			url: url
		}).done(function(response){
			self.loadTrack('/tracks/' + response.id);
		})
	}

	this.loadTrack = function(url){
		SC.get(url).then(function(sound, error) {
			var source = sound.stream_url + '?client_id=' + self.client_id;
  	  $('#player').attr('crossOrigin', 'anonymous');
  	  $('#player').attr('src', source);
		});
	}

	this.play = function(){
		var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
		var audioElement = document.getElementById('player');
		var audioSrc = audioCtx.createMediaElementSource(audioElement);
		var analyser = audioCtx.createAnalyser();

		// Bind our analyser to the media element source.
		audioSrc.connect(analyser);
		audioSrc.connect(audioCtx.destination);

		var frequencyData = new Uint8Array(analyser.frequencyBinCount);
		
		// sights.prepare(window.innerHeight, window.innerWidth, (analyser.frequencyBinCount / 2));
		sights.prepare(200, 200, (analyser.frequencyBinCount / 2));
		// sights.circle(200, 400, (analyser.frequencyBinCount / 6));

		function renderFrame() {
		   requestAnimationFrame(renderFrame);
		   analyser.getByteFrequencyData(frequencyData);
		   sights.render(400, frequencyData)
		}
		renderFrame();
	}
}


/*
	Reference for color picker:
	https://github.com/PitPik/tinyColorPicker
*/
$('.color').colorPicker({
	renderCallback: function(element, toggled) {
	  var colors = this.color.colors;
	  console.log('element: ', element);

    $(element).css({
      backgroundColor: '#' + colors.HEX,
      color: colors.RGBLuminance > 0.22 ? '#222' : '#ddd'
    });

    color1 = $('#color-picker-1 div')[0].style.backgroundColor;
    color2 = $('#color-picker-2 div')[0].style.backgroundColor;

	  var bg = `linear-gradient(to bottom, ${color1} 0%,${color1} 50%,${color2} 51%,${color2} 100%)`;
    $('.bar').css("background", bg)
  }
});

$('#song-link').on('change', function(){
	console.log($('#song-link').val());
	var val = $('#song-link').val();
	sound.loadTrackFromUrl(val);
})

var sights = new Sights();
var sound = new Sounds();
sound.initialize();
sound.loadTrack('/tracks/195549412');
sound.play();
