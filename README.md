# Chip's Challenge Level Design

## Game Overview
[Chip's Challenge](https://en.wikipedia.org/wiki/Chip%27s_Challenge) is an old-school tile-based puzzle video game. ([see complete wiki](https://bitbusters.club/wiki/Chip%27s_Challenge_Wiki)) 

This game was originally published in 1989 by Epyx as a launch title for the Atari Lynx.
And the game platform is called [Tileworld](http://www.muppetlabs.com/~breadbox/software/tworld/tworld.html#8).
In this game, the player will need the [TileWorld installation](http://www.muppetlabs.com/~breadbox/software/tworld/download.html), and enter it, be the hero Chip who aims to conquer the monsters, pass the traps, and solve the puzzles to open the level door and enter the next level. 
Classic elements of puzzle video game are prevalent here, such as moving monsters, key & door combinations, limited time countdown, etc.

>Game Synopsis:
>Tile World is a reimplementation of the game "Chip's Challenge". The player controls Chip, navigating him through his challenges. The object of each level of the game is to find and reach the exit tile, which takes you to the next level. The levels contain many different kinds of obstacles, creatures both hostile and indifferent, tools, protective gear -- and, of course, chips.

This project is forked from [David Culyba](https://github.com/dculyba) who is my instructor of the course *Programming for Game Designers* at Carnegie Mellon University. The program designs levels for Chip's Challenge -- to customize the levels with input of different elements.

## Design Pipeline
Chip's Challenge is originally an 8-byte game. Now we have more advanced programming tools, instead of hard-coding 1 and 0 to make the levels, I designed a better pipeline for game designers to design/edit the levels with better visualized layouts.

### How does this pipeline works:

#### 1. Google sheet for level design:

First, every tile/icon in Chip's Challenge has a corresponding code in the 8 byte capacity. 
For example, 0 stands for empty floor; 1 stands for wall; 21 stands for exit, etc.
(For the complete lookup, go to the [Icon Values tab of the sheet](https://github.com/ValerieWang628/Chips-Challenge-Level-Design/blob/master/Chip's%20Challenge%20Final%20Level%20Editor.xlsx) or the [wiki tile directory](https://bitbusters.club/wiki/Category:Tiles))

Thus, it would be rather inconvenient for designers to code in mere numbers. 
Instead, in Google sheet, we can link the icon value, the tile name, and tile image together. 
When inputting tile image into the cells, we can use the lookup function to link to the icon value.
As a result, directly editing a level in google sheet is pretty easy.

<p align="center">
<img src="https://github.com/ValerieWang628/Chips-Challenge-Level-Design/blob/master/cc_suppplement/spreadsheetLevelDesign.png" width ="600" height="413"/>
</p>

But, how do we export the spreadsheet level design?

#### 2. JSON file exported from the Google sheet: 

Next, we need [Google App Script](https://developers.google.com/apps-script/) (a JavaScript-based scripting language) to export the spreadsheet level to JSON files. 
I also added extra features such as password letter-number converter, advanced tiles usage, etc.
([see the complete script I wrote](https://github.com/ValerieWang628/Chips-Challenge-Level-Design/blob/master/Google-sheet-script.gs))

Many people have not realized that Google has a powerful scripting language and an editor for light-weighted programming. Here is a screenshot of what it does:
<p align="center">
<img src="https://github.com/ValerieWang628/Chips-Challenge-Level-Design/blob/master/cc_suppplement/googleScriptSnap.png" width ="500" height="368"/>
</p>


#### 3. Python for JSON reading: 

Python and [JSON](https://www.json.org) has a harmonization. JSON objects are easily converted into Python dictionaries. ([see how](https://pythonspot.com/json-encoding-and-decoding-with-python/))
I then created a python file to read the info stored in JSON through the nested list/dict hierachies.

#### 4. Dac file generated by Python: 

After Python has read through the JSON, Python also works as a port where info will be re-organized and dumped out as a well-formatted dac file.

Note: A .dac file is used to tell Tile World where the level data is and what ruleset to use. The ruleset can be either ms (Microsoft version of Chip’s Challenge) or lynx (Lynx version of Chip’s Challenge). ([More info about the file type](http://www.muppetlabs.com/~breadbox/software/tworld/tworld.html#8))

#### 5. .dac to .dat file: 

Copy the .dac file, change it to a .dat file.

#### 6. import .dac and .dat to TileWorld

Import the two files into the TileWorld directory. And the levels are ready.

A simple screenshot of how successful import looks like:

<p align="center">
<img src="https://github.com/ValerieWang628/Chips-Challenge-Level-Design/blob/master/cc_suppplement/levelInTileWorld.png" width ="300" height="225"/>
</p>

## Level Elements: 

