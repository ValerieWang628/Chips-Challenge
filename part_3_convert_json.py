import cc_dat_utils
import json
import cc_data

# the yunziw_cc1.json file only listed three very basic optional fields
# advanced fields, like monsters, and buttons, etc are written through the python functions, not manually scripted in json
# because it is a little bit easier to specify object attributes than typing lists/objects in json

#Part 3
def add_trap(ccLevel):
    '''
    this helper function adds trap to each level
    '''
    if ccLevel.level_number == 1:
        ccTrapCoordinates = cc_data.CCTrapControl(6,6,2,3)
    elif ccLevel.level_number == 2:
        ccTrapCoordinates = cc_data.CCTrapControl(6,6,7,3)
    return ccTrapCoordinates

def add_clone_machine(ccLevel):
    '''
    this helper function adds cloning machine to each level
    '''
    if ccLevel.level_number == 1:
        ccCloneCoordinates = cc_data.CCCloningMachineControl(2,7,5,7)
    elif ccLevel.level_number == 2:
        ccCloneCoordinates = cc_data.CCCloningMachineControl(3,7,5,7)
    return ccCloneCoordinates

def activate_monsters(ccLevel):
    '''
    this helper function adds monster movement to each level
    '''
    if ccLevel.level_number == 1:
        ccMonsterCoordinates = [cc_data.CCCoordinate(5,3),cc_data.CCCoordinate(5,4),cc_data.CCCoordinate(6,4)]
    elif ccLevel.level_number == 2:
        ccMonsterCoordinates = [cc_data.CCCoordinate(8,3),cc_data.CCCoordinate(8,4), cc_data.CCCoordinate(8,5),
                                cc_data.CCCoordinate(8,6)]
    return ccMonsterCoordinates


def load_json_to_CCDataFile(json_data):
    # ccDataFile is a container to hold all levels
    # analagous to an overall list
    ccDataFile = cc_data.CCDataFile()

    with open(json_data, "r") as reader:
        json_data = json.load(reader)
    
    for item in json_data:
        # ccLevel is an object that contains all info of a single level
        ccLevel = cc_data.CCLevel()
        ccLevel.level_number = item["level"]["level_number"]
        ccLevel.time = item["level"]["time_limit"]
        ccLevel.num_chips = item["level"]["chip_count"]
        ccLevel.upper_layer = item["level"]["upper_layer"]
        ccLevel.lower_layer = item["level"]["lower_layer"]

        # title, password, and hint are three basic fields that 
        ccMapTitleField = cc_data.CCMapTitleField(item["level"]["optional_fields"][0]["field_3"]["title"])
        ccLevel.add_field(ccMapTitleField)
        ccEncodedPasswordField = cc_data.CCEncodedPasswordField(item["level"]["optional_fields"][1]["field_6"]["password"])
        ccLevel.add_field(ccEncodedPasswordField)
        ccMapHintField = cc_data.CCMapHintField(item["level"]["optional_fields"][2]["field_7"]["hint"])
        ccLevel.add_field(ccMapHintField)
        
        # adding moving monsters
        ccMonsterCoordinates = activate_monsters(ccLevel)
        ccMonsterMovementField = cc_data.CCMonsterMovementField(ccMonsterCoordinates)
        ccLevel.add_field(ccMonsterMovementField)

        # adding trap sets
        ccTrapCoordinates = add_trap(ccLevel)
        ccTrapControlsField = cc_data.CCTrapControlsField([ccTrapCoordinates])
        ccLevel.add_field(ccTrapControlsField)

        # adding cloning machines
        ccCloningCoordinates = add_clone_machine(ccLevel)
        ccCloningMachineFields = cc_data.CCCloningMachineControlsField([ccCloningCoordinates])
        ccLevel.add_field(ccCloningMachineFields)

        ccDataFile.levels.append(ccLevel)
    
    return ccDataFile


cc_dat_utils.write_cc_data_to_dat(load_json_to_CCDataFile("yunziw_cc1.json"), "yunziw_cc1.dat")
cc_dat_utils.make_cc_data_from_dat("yunziw_cc1.dat")