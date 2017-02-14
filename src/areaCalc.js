apartmentReporter = function(){
//get metrics
	singleArea = parseInt(document.getElementById('1br area').value)
	doubleArea = parseInt(document.getElementById('2br area').value)
	tripleArea = parseInt(document.getElementById('3br area').value)
	singlePropo = parseInt(document.getElementById('1br proportion').value)
	doublePropo = parseInt(document.getElementById('2br proportion').value)
	triplePropo = parseInt(document.getElementById('3br proportion').value)
//avg size
	avgApartmentSize = (singleArea*singlePropo+doubleArea*doublePropo+tripleArea*triplePropo)/(singlePropo+doublePropo+triplePropo)

//area
	buildingArea = parseInt(turf.area(finalBuildingGJ))

	apartmentReport = {}

	apartmentReport.buildingArea = buildingArea;
// total number of apartments
	apartmentNo = parseInt(buildingArea/avgApartmentSize)
	apartmentReport.apartmentNo = apartmentNo
// percentage of each
	apartmentReport.singleNo = parseInt(apartmentNo*(singlePropo/(singlePropo+doublePropo+triplePropo)))
	apartmentReport.doubleNo = parseInt(apartmentNo*(doublePropo/(singlePropo+doublePropo+triplePropo)))
	apartmentReport.tripleNo = parseInt(apartmentNo*(triplePropo/(singlePropo+doublePropo+triplePropo)))

	return apartmentReport
}


reportPresentation = function(){
	apartmentReport = apartmentReporter();
	document.getElementById('buildingArea').innerHTML = "Total area is "+apartmentReport.buildingArea +"."
	document.getElementById('totalApartments').innerHTML = "Under current split and areas this will yield "+apartmentReport.apartmentNo+" apartments in total."
	document.getElementById('splitReport').innerHTML = "There will be "+apartmentReport.singleNo+" 1br apartments, "+apartmentReport.doubleNo+" 2br apartments and "+apartmentReport.tripleNo+" 3br apartments."

}

document.getElementById('all_inputs').onchange = function(e){
	reportPresentation()
}