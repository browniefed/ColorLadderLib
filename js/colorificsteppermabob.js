function ColorStepLadder(c) {

		var _reg = {
			'hex': /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i,
			'rgb': /^rgb\((\s*\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})\)$/, //make it better
			'hsl': /^hsl\((\s*\d{1,3}),\s*(\d{1,3}%),\s*(\d{1,3}%)\)$/,//make better,just quick to finish errything else
		},
		_colors = {
			hex: false,
			rgb: false,
			hsl: false
		},
		_convert = {
			hex: { rgb: toRGB, hsl: toHSL},
			rgb: { hex: toHEX, hsl: toHSL},
			hsl: { hex: toHEX, rgb: toRGB}
		};
		function color(format) {
			if (!format) {
				format = 'hex';
			}
			return _output(_colors[format],format);
		}

		function list(opts) {
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

			for (var i = 0; i <= 101; i+= defs.step) {
				var color = brightness(i, defs.format);
				if (_output(_colors[defs.format], defs.format) === color) {
					included = true;
				}
				list.push( {value: brightness(i, defs.format), step: (i/100)} );
			}
			
			if (defs.include && !included) {
				if (defs.format === 'hex') {
					list.push({value: _output(_hsltohex(_colors['hsl']),defs.format), step:_colors['hsl'][2]});
				} else if (defs.format === 'rgb') {
					list.push({value: _output(_hsltorgb(_colors['hsl']),defs.format), step:_colors['hsl'][2]});
				} else if (defs.format === 'hsl') {
					list.push({value: _output(_colors['hsl'],defs.format), step: _colors['hsl'][2]});
				}
			}
			list.sort(function(a, b){
			 return a.step-b.step;
			});
			return list;
		}

		function toHSL(color, type) {
			if (type === 'hex') {
				color = _hextohsl(color);
			} else if (type === 'rgb') {
				color = _rgbtohsl([color[0], color[1], color[2]]);
			}
			return color;
		}

		function toRGB(color, type) {
			if (type === 'hsl') {
				color = _hsltorgb(color);
			} else if (type === 'hex') {
				color = _hextorgb(color);
			}
			return color;
		}

		function toHEX(color, type) {
			if (type === 'hsl') {
				color = _hsltohex(color);
			} else if (type === 'rgb') {
				color = _rgbtohex(color);
			}
			return color;
		}

		function validate(c) {
			var _valid = false;
			for (var t in _colors) {
				if (_colors.hasOwnProperty(t)) {
					var color = _reg[t].exec(c);
					if(color) {
						_colors[t] = [color[1],color[2],color[3]];
						if (_colors[t]) {
							_valid = true;
						}
					}
				}
			}
			
			if (_valid) {
				var colors = parseColors();

				return true;
			} else {
				return false;
			}
		}

		function parseColors() {
			for (var c in _colors) {
				if (_colors[c]) {
					for (var choice in _convert[c]) {
						_colors[choice] = _convert[c][choice](_colors[c], c);
					}
					break;
				}
			}
			console.log(_colors);
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

		function brightness(brightness, format) {
				if (!format) {
					format = 'hex';
				}
				var newColor = [_colors['hsl'][0], _colors['hsl'][1], brightness / 100];
				
			    if (format === 'hex') {
			    	return _output(_hsltohex(newColor),'hex');
			    } else if (format === 'rgb') {
			    	return _output(_hsltorgb(newColor),'rgb');
			    } else if (format === 'hsl') {
			    	return _output(newColor,'hsl');
			    }
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

		var valid = validate(c);

		return {
			color: color,
			brightness: brightness,
			list: list
		};
}