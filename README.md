ColorifcStepperMabob
-----------------------
Easily convert between HEX/HSL/RGB
Get any level of brightness / darkness
Get a list of all brightnes / darkness at any interval

```javascript
	var ColorStepper = new ColorStepLadder('#333');

	var hsl333 =  ColorStepper.color('hsl');
	var bright80 = ColorStepper.brightness(80, 'hex');

	//step: Use a step interval of 2 (default: 1)
	//format: What format to return the values in (default: 'hex')
	//include: Include the input color even if it doesn't fall with in the step interval (default: true)
	var allTheColors = ColorStepper.list({step: 2, format: 'hex', include: true});
```

Pretty straight forward, library created for Color Step Ladder project
TODO:
Cleaner code to come, more DRY needed so there is less checking of format, and which function to call. Just a library of functions, build a string, and it'll call the proper function
Also need to improve regular expressions, currently RGB accepts values above 255, HSL accepts any 3 digit values, and also does not accept decimals