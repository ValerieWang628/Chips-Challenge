import test_data
import json

#Creates and returns a GameLibrary object(defined in test_data) from loaded json_data
def make_game_library_from_json( json_data ):
    #Initialize a new GameLibrary
    game_library = test_data.GameLibrary()

    with open(json_data,"r") as reader:
        json_data = json.load(reader)
    for item in json_data:
        game = test_data.Game()
        game.title = item["title"]
        game.year = item["year"]
        # nested platform dictionary
        # flatten the dict into object attributes
        game.platform = test_data.Platform()
        game.platform.launch_year = item["platform"]["launch_year"]
        game.platform.name = item["platform"]["name"]
        game_library.add_game(game)

    return game_library




#Part 2
input_json_file = "data/test_data.json"
print(make_game_library_from_json("test_data.json"))

