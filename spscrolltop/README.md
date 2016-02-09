# SPScrollTop
### Simple js tool to add scroll top bar on SharePoint pages

* No external dependencies.

#### Usage sample:

	SPScrollTop(settings);
	
	//settings sample with default values
	{
        showOn: 200, //height in **px** from top of window, indicates when to start showing scroll
        speed: 800, //scroll speed
        bgColor: 'gray', //color of link rectangle
        textColor: 'white', //text color
        useThemColor: true, //overrides **bgColor** with theme color
        text: "Top ^", //scroll to top text
        opacity: 0.5 //scroll rectangle opacity
    };


#### Browser support
Tested under:
* IE8+
* Chrome
