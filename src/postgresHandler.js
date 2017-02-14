dataGetter = function(e){

addToMap(testgeoJ)
}

addToMap = function(data){
  console.log(data)
  if(Newmap.getSource('tempOppSites')){
  Newmap.removeSource('tempOppSites')}
  Newmap.addSource('tempOppSites', {    
    'type':'geojson',
    'data':data
  })
  Newmap.addLayer({
    'id':'tempOpp',
    'source':'tempOppSites',
    'type':'fill',
    'layout': {},
    "paint": {
    "fill-color": {
        "property": ("gfa"),
        "stops": [
            [1, "lightblue"],
            [2500, "navy"]
            ]
        },
      "fill-outline-color":'black'
      }

  })

  if(Newmap.getSource('tempConstrainedSites')){
  Newmap.removeSource('tempConstrainedSites')}
  Newmap.addSource('tempConstrainedSites', {    
    'type':'geojson',
    'data':data.constrainedsites
  })
  Newmap.addLayer({
    'id':'tempConstrained',
    'source':'tempConstrainedSites',
    'type':'fill',
    'layout': {},
    "paint": {
    "fill-color": {
        "property": "constraint_type",
        "stops": [
            [1, "LightGreen"], //open space
            [2, "Orange"], // special use
            [3, "mediumSpringGreen"], //env conservation
            [4, "orangeRed"], // strata 10
            [5, "tomato"], // strata 9
            [6, "red"], // recent deve
            [7, "mediumSeaGreen"], // conservation area
            [8, "lightsalmon"], //heritage
            [10,"forestGreen"], // tec communities 
            [11,"lightblue"], //anef
            [12,"darkblue"],//anef
            [13,"darkblue"]//anef
            ]
        },
      "fill-opacity":0.4
      }

  })



}
