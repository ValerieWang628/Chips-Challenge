import cc_dat_utils
import json
import cc_data

#Part 3

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
        ccMapTitleField = cc_data.CCMapTitleField(item["level"]["optional_fields"]["field_3"]["title"])
        ccLevel.add_field(ccMapTitleField)
        ccEncodedPasswordField = cc_data.CCEncodedPasswordField(item["level"]["optional_fields"]["field_6"]["password"])
        ccLevel.add_field(ccEncodedPasswordField)
        ccMapHintField = cc_data.CCMapHintField(item["level"]["optional_fields"]["field_7"]["hint"])
        ccLevel.add_field(ccMapHintField)

        # adding monsters can also be
        ccMonsterMovementField = []
        for monster in item["level"]["optional_fields"]["field_10"]["monsters"]:
            ccMonsterMovementField.append(cc_data.CCCoordinate(monster[0],monster[1]))
        ccMonsterMovementField = cc_data.CCMonsterMovementField(ccMonsterMovementField)
        ccLevel.add_field(ccMonsterMovementField)

        # adding trap sets
        ccTrapCoordinates = []
        for trap in item["level"]["optional_fields"]["field_4"]["traps"]:
            ccTrapCoordinates.append(cc_data.CCTrapControl(trap[0], trap[1], trap[2], trap[3]))
        ccTrapControlsField = cc_data.CCTrapControlsField(ccTrapCoordinates)
        ccLevel.add_field(ccTrapControlsField)

        # adding cloning machines
        ccCloningMachines = []
        for machine in item["level"]["optional_fields"]["field_5"]["cloning machines"]:
            ccCloningMachines.append(cc_data.CCCloningMachineControl(machine[0], machine[1], machine[2], machine[3]))
        ccCloningMachineField = cc_data.CCCloningMachineControlsField(ccCloningMachines)
        ccLevel.add_field(ccCloningMachineField)

        # adding levels into the ccDataFile Object
        ccDataFile.levels.append(ccLevel)
    
    return ccDataFile


cc_dat_utils.write_cc_data_to_dat(load_json_to_CCDataFile("yunziw_cc1.json"), "yunziw_cc1.dat")
cc_dat_utils.make_cc_data_from_dat("yunziw_cc1.dat")