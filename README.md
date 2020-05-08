
# Chip's Challenge Level Design by Valerie Wang

## Game Overview
[Chip's Challenge](https://en.wikipedia.org/wiki/Chip%27s_Challenge) is an 8-bit old-school tile-based puzzle video game. ([see complete wiki](https://bitbusters.club/wiki/Chip%27s_Challenge_Wiki)) 


### Brief Game History
This game was originally published in 1989 by Epyx as a launch title for the Atari Lynx. In 2000, Brain Raiter ported this game to Microsoft Windows and Linux. Now the emulated version is called [Tileworld](https://chipschallenge.fandom.com/wiki/Tile_World).

### Game Synopsis
Tile World is a reimplementation of the game "Chip's Challenge". The player controls the main character Chip, navigating him through his challenges. The object of each level of the game is to find and reach the exit tile, which takes you to the next level. The levels contain many different kinds of obstacles, creatures (both hostile and indifferent), tools, protective gear -- and, of course, chips.

👉🏼An example level of Chip's Challenge: ([source](https://vignette.wikia.nocookie.net/chipschallenge/images/5/5f/Lucky_timing_example.png/revision/latest?cb=20170802112501))
<p align="center">
    <img src= "https://static.wixstatic.com/media/5a3935_36bd2d8eda044ee880125911f2811df7~mv2.png/v1/fill/w_449,h_260,al_c,lg_1,q_85/Lucky_timing_example.webp" width = "449" height = "260">
<p>

👉🏼An partial spritesheet of Chip's Challenge: ([source](https://chipschallenge.fandom.com/wiki/Tile))
<p align="center">
    <img src= "https://static.wixstatic.com/media/5a3935_b7812103b5a6432cbb21a1365a0b2a05~mv2.gif" width = "416" height = "512">
<p>

### Project Overview
👉🏼This project is forked from [David Culyba](http://www.etc.cmu.edu/blog/author/dculyba/) who was my instructor of the course *Programming for Game Designers* at Carnegie Mellon University. In the old times, level designers would have to code in binary values to layout the level. Thus, my objective was to create a level editor pipeline that allows multiple level designers to work together on a cloud base, and to easily export the level data directly to the game without extra compilers. 

To create this cloud level editor, I mainly have:

 - Developed a level design editor plugin in JavaScript that enables direct sprite arrangement in Google Sheet instead  of binary file modification
 - Implemented a level data parser in Python that converts editor input into binary level layouts

## Pipeline Breakdown

### 1. Google sheet for level design:

First, every tile/icon in Chip's Challenge has a corresponding code in the 8 byte capacity. For example, 0 stands for empty floor; 1 stands for wall; 21 stands for exit; 108, 109, 110, 111 correspond to the four directional sprites for the main character Chip, etc. (For the complete lookup, go to the [Icon Values tab of the sheet](https://github.com/ValerieWang628/Chips-Challenge-Level-Design/blob/master/Chip's%20Challenge%20Final%20Level%20Editor.xlsx) or the [wiki tile directory](https://wiki.bitbusters.club/Category:Tiles).

Thus, it would be rather inconvenient for designers to code in mere numbers. Before, level designers will need to hard code -- change the old indexes by typing new indexes one by one by hand. However, nowadyas, Google sheet can be a light-weighted good platform to map the index to sprotes -- we can link the sprite index, to the tile name, and to the tile image. When inputting tile image into the cells, we can use the lookup function to link to the icon value. As a result, directly editing a level in google sheet is pretty easy.

👉🏼See how the level looks like in a spreadsheet:
📍In this editor, level designers will only need to set up the ready-to-use sprite palette, and use the built-in tools to quickly copy, paste and smartfill. This could save 80% of the effort. 
<p align="center">
    <img src= "https://static.wixstatic.com/media/5a3935_bf257a16b51d4bcab7bddd61b187af31~mv2.png/v1/fill/w_569,h_390,al_c,q_85,usm_0.66_1.00_0.01/spreadsheetLevelDesign.webp" width = "569" height = "390">
<p>

After the level design is done, how is it possible to export the design layout to a usable form?

### 2. JSON file exported from the Google sheet: 

I wrote a Google Sheet plugin in [Google App Script](https://developers.google.com/apps-script/) (a JavaScript-based scripting language) to extract and export the spreadsheet level to JSON files. For different mechanics, I worte slightly different functions to make sure those special sprites are correctly exported.

👇🏻 An example of the JSON extracter particularly for traps:
```javascript
    function  getTrapJSONData(mapData){
	    var trapStr = ICON_SHEET.getRange("C45").getFormula();
		var buttStr = ICON_SHEET.getRange("C42").getFormula();
		var trapCoordi = "[";
		var trap = [-1,-1,-1,-1];
		
		for (var i = 0; i < mapData.length; i++){
			for (var j = 0; j < mapData[i].length; j++){
				if (mapData[i][j] == buttStr){
					trap[0] = i;
					trap[1] = j;
				}
				if (mapData[i][j] == trapStr){
				trap[2] = i;
				trap[3] = j;
				}
			}
		}
		if (trap[0] == -1 || trap[2] == -1){
			return null
		}
		trap = "[" + trap + "]";
		trapCoordi += trap;
		trapCoordi += "]";
		return trapCoordi;
    }
```    
I have also written JSON extracter for cloning machines, monsters, etc. And I added a password converter to match the old Chip's Challenge fashion. (👉🏻Refer to [the complete script](https://github.com/ValerieWang628/Chips-Challenge-Level-Design/blob/master/Google-sheet-script.gs))



### 3. Parsing JSON in Python: 

Python and [JSON](https://www.json.org) has a mapping system. JSON objects are easily converted into Python dictionaries. ([see how](https://pythonspot.com/json-encoding-and-decoding-with-python/))
I then created a [python file](https://github.com/ValerieWang628/Chips-Challenge-Level-Design/blob/master/part_3_convert_json.py) , mainly a function called *load_json_to_CCDataFile(json_data)* to read the info stored in JSON through the nested list/dict hierachies. It reads the JSON and parsed the main chunks to Python dictionaries.

👇🏻 An example code snippet of the main chunk of the function:
```python
    for item in json_data:
		ccLevel = cc_data.CCLevel()
		ccLevel.level_number = item["level"]["level_number"]
		ccLevel.time = item["level"]["time_limit"]
		ccLevel.num_chips = item["level"]["chip_count"]
		ccLevel.upper_layer = item["level"]["upper_layer"]
		ccLevel.lower_layer = item["level"]["lower_layer"]
```

### 4. .dat file generated by Python: 

After Python has read through the JSON, Python also works as a converter where info will be re-organized and dumped out as a well-formatted dat file.

👇🏻An example code snippet of the write_cc_data_to_dat function:
```python
    def write_cc_data_to_dat(cc_dat, dat_file):
		with open(dat_file, 'wb') as writer: # Note: DAT files are opened in binary mode
		writer.write(CC_DAT_HEADER_CODE)
		writer.write(cc_dat.level_count.to_bytes(2, cc_data.BYTE_ORDER))
		for level in cc_dat.levels:
			write_level_to_dat(level, writer)
```
Note: A .dat file is used to tell Tile World where the level data is and what ruleset to use. The ruleset can be either ms (Microsoft version of Chip’s Challenge) or lynx (Lynx version of Chip’s Challenge). ([More info about the file type](http://www.muppetlabs.com/~breadbox/software/tworld/tworld.html#8))

### 5. .dat to .dac file: 

Copy the .dat file, change it to a .dac file.

### 6. import .dac and .dat to TileWorld

Import the two files into the TileWorld directory. And the levels are ready.

👉🏼A simple partial screenshot of how successful import looks like:

<p align="center">
<img src="https://raw.githubusercontent.com/ValerieWang628/Chips-Challenge-Level-Editor/master/cc_suppplement/levelInTileWorld.png" width ="644" height="465"/>
</p>

🤩You can be as creative as you want to make all kinds of levels for Chip to navigate in this Tileworld!

<!---## Level Elements: 

There are classic elements of puzzle video games. 

In this game, combination and dependency is very important --

Key of certain colors match doors of certain colors (except the green key which is a master key);
there are certain buttons to trigger the trap;
there are other buttons to trigger the cloning machine;
only dirt blocks will help build a path above the water;
walk through fire with fire boots on;
skate the ice with ice skater boots on;
slide through slip tiles with suction boots, etc.

The difficulty of the levels depends on the process of the player collecting items and connecting their functions. Optimization is key. --->
