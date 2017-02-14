project = {"id":id, "properties":properties "buildings":[]}

properties = {
	typeDict:[],
	client,
	gfa
}

building = {
	id,
	properties,
	subsections
}

subsection = {
	type,
	rank,
	floors
}

typeDict = {
	type1:color1,
	type2:color2...
}

projects = [project,project,project]

//Functions

//new building
//field in geometry on map, adds to menu of buildings

//delete subsection on map deletes subsection in array of subsections

//add type
//adds type and color to typeDict - displays in box

//delete type
//removes type from typeDict

//render
//1. groups buildings 2. loops through and adds height 3. renders to map

//report
//1. loops through buildings summing area by type displays in table