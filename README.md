ColorifcStepperMabob
-----------------------
Easily convert between HEX/HSL/RGB
Get any level of brightness / darkness
Get a list of all brightnes / darkness at any interval

```javascript
	var ColorStepper = ColorLadder.Convert('#333333');

	var hsl333 =  ColorStepper.toHSL();
	var rgb = ColorStepper.toRGB();
	var hex = ColorStepper.toHEX();
	var bright80 = ColorStepper.Brightness(80, 'hex');

	//step: Use a step interval of 2 (default: 1)
	//format: What format to return the values in (default: 'hex')
	//include: Include the input color even if it doesn't fall with in the step interval (default: true)
	var allTheColors = ColorStepper.List({step: 2, format: 'hex', include: true});

	//Validating a color
	//returns false, or the matched color in an object w/ array
	var valid = ColorStepper.Convert().Validate('#333333');
	//returns {
		hex: ['33','33','33'],
		rgb: [],
		hsl: []
	}
```

Pretty straight forward, library created for Color Step Ladder project

###TODO:
*Cleaner code to come
*More DRY needed so there is less checking of format, and which function to call. Just a library of functions, build a string, and it'll call the proper function
*Also need to improve regular expressions, currently RGB accepts values above 255, HSL accepts any 3 digit values, and also does not accept decimals
*WRITE SOME FREAKING TESTS
*More colors