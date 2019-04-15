//Preload and store the values of the Icon Values sheet
//This will prevent the code from reloading the data over and over as we use it
var ICON_SHEET = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Icon Values");
var ICON_KEY_RANGE = ICON_SHEET.getDataRange();
var ICON_FORMULA_DATA = ICON_KEY_RANGE.getFormulas();
var ICON_VALUE_DATA = ICON_KEY_RANGE.getValues();
var PSWD_SHEET = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Password Lookups");
var PSWD_RANGE = PSWD_SHEET.getDataRange();
var PSWD_NUM_DATA = PSWD_RANGE.getValues();



function passwordConverter(pswdStr){
/*
  *Extra Credit*
  Encodes password ASCII letters to numbers
*/
  var result;
  
  for (var i = 0; i < PSWD_NUM_DATA.length; i++){
    if (PSWD_NUM_DATA[i][0] == pswdStr){
      result = PSWD_NUM_DATA[i][1];
   }
  }
  if (result == undefined){
    console.error("Invalid password input.");
  }
  
  return result;
}

function lookupValue(toFind, lookupColumn) {
/* Looks up a icon value in the "Icon Values" worksheet and returns 
   the item in the same row but in the column specified by lookupColumn
  
   toFind (String): the formula string of an icon
   lookupColumn (int): index of the column to return the value of
*/
  
  // avoid the first row where neither icons or rows exist
  var result;
  

  for (var i = 1; i < ICON_FORMULA_DATA.length; i++){
    if (ICON_FORMULA_DATA[i][2] == toFind){
      result = ICON_VALUE_DATA[i][lookupColumn];
   }
  }
  return result;
}

function getIntValueForIcon(iconString) {
/* Returns the integer value for a given icon string
   Note: This should use lookupValue
  
   iconString (String): icon to look up
*/
  return lookupValue(iconString, 1);
}

function isIconMonster(iconString) {
/* Return true if the icon is a monster
   Note: This should call lookupValue
  
   iconString (String): icon to look up
*/
  return lookupValue(iconString, 4);
}


function getMonsterJSONData(mapData) {
/* Iterates through the mapData and returns a string with all the monster data formatted as a proper JSON list.
   Returns null if no monsters are found
   Note:
   This function must search for monsters in the map data and add the coordinates of each one to the JSON string
   This is just the array part of the JSON data and the return value would look something like this: "[[1,1], [2,3]]"
  
   mapData (string[][]): two-dimensional array of map formula data from the range representing the map on the sheet
*/
  var monsterCoordi = "[";
  
  for (var i = 0; i < mapData.length; i++){
    for (var j = 0; j < mapData[i].length; j++){
      if (isIconMonster(mapData[i][j])){
        monsterCoordi += "[" + i.toString() + "," + j.toString() + "], ";
      }
    }
  }
  if (monsterCoordi == "["){
    return null
  }
  var monLen = monsterCoordi.length;
  monsterCoordi = monsterCoordi.substring(0, monLen-2);
  monsterCoordi += "]";

  return monsterCoordi;
}

function getTrapJSONData(mapData){

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

function getCloningMachineJSONData(mapData){
  
  var machStr = ICON_SHEET.getRange("C47").getFormula();
  var buttStr = ICON_SHEET.getRange("C39").getFormula();
  var machCoordi = "[";
  var mach = [-1,-1,-1,-1];
  
  for (var i = 0; i < mapData.length; i++){
    for (var j = 0; j < mapData[i].length; j++){
      if (mapData[i][j] == buttStr){
        mach[0] = i;
        mach[1] = j;
      }
      if (mapData[i][j] == machStr){
        mach[2] = i;
        mach[3] = j;
      }
    }
  }
  if (mach[0] == -1 || mach[2] == -1){
    return null
  }

  mach = "[" + mach + "]";
  machCoordi += mach;
  machCoordi += "]";
  return machCoordi;
}


function getMapJSONData(mapData) {  
/* Returns a string with the map data formatted as a proper JSON list
   Note: Return value would look something like this: "[0,0,0,0,64,0]"
  
   mapData (string[][]): two-dimensional array of map formula data from the range representing the map on the sheet
*/
  
  var intArray = [];
  
  for (var i = 0; i < mapData.length; i++){
    for (var j = 0; j < mapData[i].length; j++){
      intArray.push(getIntValueForIcon(mapData[i][j]));
    }
  }
   
  return "[" + intArray + "]";
}

function getComputerChipCount(mapData) {
/* Iterates through the mapData and returns a count of all the computer chips in the map.
   Note:
   This function must search for computer chips in the map data
  
   mapData (string[][]): two-dimensional array of map formula data from the range representing the map on the sheet
*/
  var count = 0;
  
  var chipStr = ICON_SHEET.getRange("C4").getFormula();
  
  for (var i = 0; i < mapData.length; i++){
    for (var j = 0; j < mapData[i].length; j++){
      if(mapData[i][j] == chipStr){
        count += 1;
      }
    }
  }
  return count;
}

function checkPlayerAndExit(mapData){
/* Checks if the map has one and only player and exit, respectively*/

  var playerCount = 0;
  var playerStr = ICON_SHEET.getRange("C37").getFormula();
  var exitCount = 0;
  var exitStr = ICON_SHEET.getRange("C21").getFormula();

  for (var i = 0; i < mapData.length; i++){
    for (var j = 0; j < mapData[i].length; j++){
      if (mapData[i][j] == playerStr){
        playerCount += 1;
      }
      if (mapData[i][j] == exitStr){
        exitCount += 1;
      }
    }
  }
  if (playerCount != 1 || exitCount != 1){
    console.error("You must have only one player and one exit in the game.");
  }
}


function lowerLevelGenerator(mapData){
  var lowerLevel = [];
  var gridLength = mapData.length * mapData.length;
  for (var i = 0; i < gridLength; i++){
    lowerLevel.push(0);
  }
  return "[" + lowerLevel + "]";
}

function getMapTitle(sheet) {
/* Returns the title of the map defined by the given sheet
   Note: This can either look up a specific cell value on the sheet or use the name of the sheet
  
   sheet (Sheet): Sheet defining the map
*/
  return sheet.getRange("AH2").getValue();
}

function getTime(sheet) {
/* Returns the time value of the map defined by the given sheet
   Note: This should look up a specific cell value on the sheet
  
   sheet (Sheet): Sheet defining the map
*/
  return sheet.getRange("AH3").getValue();
}

function getMapHint(sheet) {
/* Returns the hint value of the map defined by the given sheet
   Note: This should look up a specific cell value on the sheet
  
   sheet (Sheet): Sheet defining the map
*/
  return sheet.getRange("AH5").getValue();
}

function getMapPassword(sheet) {
/* Returns the password value, encoded as a string, of the map defined by the given sheet
   Note: This should look up specific cell values on the sheet. The values should be stored ints in the sheet.
   An example return value is "[220, 220, 220, 220]"
  
   sheet (Sheet): Sheet defining the map
*/
  var password = [];
  var char_1 = sheet.getRange("AH4").getValue().toString();
  char_1 = passwordConverter(char_1);
  password.push(char_1);
  var char_2 = sheet.getRange("AI4").getValue().toString();
  char_2 = passwordConverter(char_2);
  password.push(char_2);
  var char_3 = sheet.getRange("AJ4").getValue().toString();
  char_3 = passwordConverter(char_3);
  password.push(char_3);
  var char_4 = sheet.getRange("Ak4").getValue().toString();
  char_4 = passwordConverter(char_4);
  password.push(char_4);
  
  return "[" + char_1 + ", " + char_2 + ", " + char_3 + ", " + char_4 + "]"
}

function getFieldJSONData(mapData, sheet){

  var jsonFieldStr = "";
  jsonFieldStr += "\n{\n";
  
  // level title
  var title = getMapTitle(sheet);
  if (title.length >= 64){
    console.error("Map Title must be 63 characters or fewer.");
  }
  jsonFieldStr += '"title": ' + '"' + title + '"' + ",\n";
    
  // level password
  var password = getMapPassword(sheet);
  jsonFieldStr += '"password": ' + password + ",\n";
  
  // hint
  var hint = getMapHint(sheet);
  if (title.length > 127 || title.length < 0){
    console.error("Hint must be from 0 to 127 characters in length.");
  }
  jsonFieldStr += '"hint": ' + '"' + hint + '"' + ",\n";
  
  // monster
  var monster = getMonsterJSONData(mapData);
  if (monster){
    jsonFieldStr += '"monsters": ' + monster + ",\n";
  }
  
  
  // traps
  var trap = getTrapJSONData(mapData);
  jsonFieldStr += '"traps": ' + trap + ",\n";
  
  // cloning machines
  var cloning_machines = getCloningMachineJSONData(mapData);
  jsonFieldStr += '"cloning machines": ' + cloning_machines + "\n";
  
  jsonFieldStr += "}"
  
  return jsonFieldStr;
}


function getJSONLevelToSave(sheet, levelNumber) {
/* Returns a valid JSON string representing the map defined by the sheet and levelNumber
   Note: This return just a single level, so it's JSON value would look something like this:
   '{"level_number":1, "time":100, "chip_num":2, ...}'
   This string must match your JSON file format
   Be careful when putting quotation marks in strings:
     Use one style '' outside the string and the other style "" inside the string
  
   sheet (Sheet): Sheet defining the map
   levelNumber (int): Index of the level
*/
  // level #
  var jsonLevelString = "{\n";
  jsonLevelString += '"level_number": ' + levelNumber + ",\n";
  
  // level time
  var time = getTime(sheet);
  jsonLevelString += '"time_limit": ' + time + ",\n";
  

  var mapData = sheet.getRange("A1:AF32").getFormulas();
  
  // checking if with only one player and exit
  checkPlayerAndExit(mapData);
  
  // chip num
  var chip = getComputerChipCount(mapData);
  jsonLevelString += '"chip_count": ' + chip + ",\n";
  
  // upper level
  //how to convert formulas into int values?
  var mapJSON = getMapJSONData(mapData);
  jsonLevelString += '"upper_layer": ' + mapJSON + ",\n";

  // lower level
  var lowerLevel = lowerLevelGenerator(mapData);
  jsonLevelString += '"lower_layer": ' + lowerLevel + ",\n";

  // optional fields
  var fields = getFieldJSONData(mapData, sheet);
  jsonLevelString += '"optional_fields": ' + fields;
  

  jsonLevelString += "\n},\n";
  
  return jsonLevelString;
}

function isLevelWorksheet(sheet) {
/* Convenience function that returns true if the given sheet 
   is not the Template sheet or the Icon Values sheet
   
   sheet (Sheet): Sheet to check
*/
  var worksheetName = sheet.getName();
  return (worksheetName != "Template" && worksheetName != "Icon Values" && worksheetName != "Password Lookups");

}

function getAllLevelsJSON(){
/* Returns a valid JSON string representing a level pack containing all the levels in the active spreadsheet.
   Note: This string must match your JSON file format
*/
  
  var jsonAllLevelString = "";
  
  jsonAllLevelString += "[\n";
  
  var sheets = SpreadsheetApp.getActiveSpreadsheet().getSheets();
  for (var i = 0; i < sheets.length; i++){
    if (isLevelWorksheet(sheets[i])){
      var jsonLevelString = getJSONLevelToSave(sheets[i], i);
      jsonAllLevelString += jsonLevelString;
    }
  }
  jsonAllLevelString = jsonAllLevelString.substring(0, jsonAllLevelString.length-2);
  jsonAllLevelString += "\n]";
  return jsonAllLevelString;
}

function saveAllLevels() {
/* Saves all the valid Chip's Challenge levels in the active spreadsheet to a file
*/
  var json_string = getAllLevelsJSON();
  DriveApp.createFile("yunziw_cc_level_data.json", json_string, MimeType.PLAIN_TEXT);
}


function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu("Chip's Challenge")
      .addItem("Save all levels", "saveAllLevels")
      .addToUi();
}
