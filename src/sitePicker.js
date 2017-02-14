sitePicker = function(e){

  pickedSiteF = Newmap.queryRenderedFeatures(
  e.point, { layers: ['tempOpp', 'tempConstrained'] }
  );
  console.log(pickedSiteF)
  pickedSite = turf.featureCollection(pickedSiteF)
  console.log(pickedSite)
  point = turf.centroid(pickedSiteF[0].geometry)
  flyLocation = {center:point.geometry.coordinates}
  Oldmap.flyTo(flyLocation)
  if(Oldmap.getSource('pickedSite')){
  Oldmap.removeSource('pickedSite')}
  Oldmap.addSource('pickedSite',{
    'type':'geojson',
    'data':pickedSite
  })
  Oldmap.addLayer({
    'id':'pickedSite',
    'source':'pickedSite',
    'type':'line',
    'paint':{
      'line-color':'black'
    }

  })
} 


