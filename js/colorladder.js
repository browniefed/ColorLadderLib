var ColorLadder = ColorLadder || {};

(function() {
	
	ColorLadder._colorReg = {
			'hex': /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i,
			'rgb': /^rgb\((\s*\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})\)$/, //make it better
			'hsl': /^hsl\((\s*\d{1,3}),\s*(\d{1,3}%),\s*(\d{1,3}%)\)$/,//make better,just quick to finish errything else
	};
	ColorLadder._colors = {
		hex: [],
		rgb: [],
		hsl: []
	};

	ColorLadder._convert = {
		hex: {
			rgb: _hextorgb,
			hsl: _hextohsl
		},
		rgb: {
			hex: _rgbtohex,
			hsl: _rgbtohsl
		},
		hsl: {
			hex: _hsltohex,
			rgb: _hsltorgb
		}
	};
	

	ColorLadder.Convert = function(color, to) {
		var self = this;
		if (typeof(color) === 'undefined' && typeof(to) === 'undefined') {
			return self.Convert;
		}
		if (typeof(to) === 'undefined') {
			to = 'HEX';
		}

		var _colors = validate(color);
		if (_colors !== false) {
			ColorLadder._colors = parseColors(_colors);
			ColorLadder._isValid = true;
			return self.Convert;
		} else {
			ColorLadder._isValid = false;
			return false;
		}
	};

	ColorLadder.Convert.toRGB = function() {
		if (ColorLadder._colors.length === 0) {
			return false;
		}
		return _output(ColorLadder._colors['rgb'], 'rgb');
	}

	ColorLadder.Convert.toHEX = function() {
		if (ColorLadder._colors.length === 0) {
			return false;
		}

		return _output(ColorLadder._colors['hex'], 'hex');
	}

	ColorLadder.Convert.toHSL = function() {
		if (ColorLadder._colors.length === 0) {
			return false;
		}

		return _output(ColorLadder._colors['hsl'], 'hsl');
	}

	ColorLadder.Convert.List = function(opts) {
		var list = [],
		opts = opts || {},
		defs = {step: 1, format: 'hex', include: true},
		included = false;
		for (var o in opts) {
			if (opts.hasOwnProperty(o)) {
				if (defs[o]) {
					defs[o] = opts[o];
				}
			}
		}

		for (var i = 0; i < 101; i+= defs.step) {
			var color = brightness(i, defs.format);
			if (_output(ColorLadder._colors[defs.format], defs.format) === color) {
				included = true;
			}
			list.push( {value: brightness(i, defs.format), step: (i/100)} );
		}
		
		if (defs.include && !included) {
			if (defs.format === 'hex') {
				list.push({value: _output(_hsltohex(ColorLadder._colors['hsl']),defs.format), step:ColorLadder._colors['hsl'][2]});
			} else if (defs.format === 'rgb') {
				list.push({value: _output(_hsltorgb(ColorLadder._colors['hsl']),defs.format), step:ColorLadder._colors['hsl'][2]});
			} else if (defs.format === 'hsl') {
				list.push({value: _output(ColorLadder._colors['hsl'],defs.format), step: ColorLadder._colors['hsl'][2]});
			}
		}
		list.sort(function(a, b){
		 return a.step-b.step;
		});
		return list;
	}

	ColorLadder.Convert.Brightness = function(brightness, format) {
		if (!format) {
			format = 'hex';
		}
		var newColor = [ColorLadder._colors['hsl'][0], ColorLadder._colors['hsl'][1], brightness / 100];
		
	    if (format === 'hex') {
	    	return _output(_hsltohex(newColor),'hex');
	    } else if (format === 'rgb') {
	    	return _output(_hsltorgb(newColor),'rgb');
	    } else if (format === 'hsl') {
	    	return _output(newColor,'hsl');
	    }
	}

	ColorLadder.Convert.Validate = function(color) {
		if (typeof color === 'undefined') {
			return false;
		}
		return validate(color);
	}

	function validate(color) {
		var _valid = false,
				colors = {};
		//Loop through regular expressions, return parsed colors
		for(var colReg in ColorLadder._colorReg) {
			if (ColorLadder._colorReg.hasOwnProperty(colReg)) {
				var comColor = ColorLadder._colorReg[colReg].exec(color);
				if (comColor) {
					colors[colReg] = [comColor[1],comColor[2],comColor[3]];
					_valid = true;
				} else {
					colors[colReg] = [];
				}
			}
		}

		if (_valid) {
			return colors;
		} else {
			return false;
		}
	}

	function parseColors(colors) {
		//Takes an object from validate, determines what color was passed in
		//Calls functions to convert to all other formats
		//Returns complete object with colors
		var cols = {}
		for (var color in colors) {
			if (colors[color].length !== 0) {
				cols[color] = colors[color];
				for (var colConv in ColorLadder._convert[color]) {
					cols[colConv] = ColorLadder._convert[color][colConv](colors[color]);
				}
			}
		}
		return cols;
	}

	function brightness(brightness, format) {
		if (!format) {
			format = 'hex';
		}
		var newColor = [ColorLadder._colors['hsl'][0], ColorLadder._colors['hsl'][1], brightness / 100];
		
	    if (format === 'hex') {
	    	return _output(_hsltohex(newColor),'hex');
	    } else if (format === 'rgb') {
	    	return _output(_hsltorgb(newColor),'rgb');
	    } else if (format === 'hsl') {
	    	return _output(newColor,'hsl');
	    }
	}

	function _hextorgb(hex) {
		return [parseInt(hex[0], 16), parseInt(hex[1],16), parseInt(hex[2],16)];
	}

	function _hextohsl(hex) {
		var rgb = _hextorgb(hex);
		return _rgbtohsl(rgb);
	}

	function _hsltohex(hsl) {
		var rgb = _hsltorgb(hsl);
		return _rgbtohex(rgb);
	}

	function _hsltorgb(hsl) {
		var h = hsl[0],
			s = hsl[1],
			l = hsl[2];
	    var r, g, b;

	    if(s == 0){
	        r = g = b = l; // achromatic
	    }else{
	        function hue2rgb(p, q, t){
	            if(t < 0) t += 1;
	            if(t > 1) t -= 1;
	            if(t < 1/6) return p + (q - p) * 6 * t;
	            if(t < 1/2) return q;
	            if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
	            return p;
	        }

	        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
	        var p = 2 * l - q;
	        r = hue2rgb(p, q, h + 1/3);
	        g = hue2rgb(p, q, h);
	        b = hue2rgb(p, q, h - 1/3);
	    }

	    return [r * 255, g * 255, b * 255];
	}

	function _rgbtohex(rgb) {
		var hex = []

		for (var val in rgb) {
			var dig = (parseInt(rgb[val]).toString(16));
			hex.push((dig.length === 1 ? '0' + dig : dig));
		}
		return hex;
	}

	function _rgbtohsl(rgb) {
		var r = rgb[0],
			g = rgb[1],
			b = rgb[2];

	    r /= 255, g /= 255, b /= 255;
	    var max = Math.max(r, g, b), min = Math.min(r, g, b);
	    var h, s, l = (max + min) / 2;

	    if(max == min) {
	        h = s = 0; // achromatic
	    } else {
	        var d = max - min;
	        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
	        switch(max){
	            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
	            case g: h = (b - r) / d + 2; break;
	            case b: h = (r - g) / d + 4; break;
	        }
	        h /= 6;
	    }
	    return [h, s, l];
	}

	function _output(color, format) {
			var output = '';
			switch (format) {
				case 'hex':
					output = '#' + color[0] + color[1] + color[2];
				break;

				case 'rgb':
					output = 'rgb(' + color[0] + ',' + color[1] + ',' + color[2] + ')';
				break;

				case 'hsl':
					output = 'hsl(' + color[0] + ',' + color[1] + ',' + color[2] + ')';
				break;
			}

			return output;
		}
}());