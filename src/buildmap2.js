// get mapbox token
mapboxgl.accessToken = 'pk.eyJ1IjoiZ2FydGhkYmVldGxlIiwiYSI6ImNpcHl5emhrdjB5YmxoY25yczF6MHhhc2IifQ.2Ld30uLqcffVv-RUAWk_qQ';

//instantiate map
Oldmap = new mapboxgl.Map({
    container: 'Oldmap',
    style: 'mapbox://styles/mapbox/streets-v9',
    center: [151,-33],
    zoom: 15.99,
    pitch: 40,
    bearing: 20
   });

Newmap = new mapboxgl.Map({
    container: 'Newmap',
    style: 'mapbox://styles/mapbox/light-v9',
    center: [151,-33],
    zoom: 15.99, 
   });

//get data and convert to GeoJSON source
finalBuildingGJ = {"type":"FeatureCollection","features":[]}
var building = {
   'type':'geojson',
   'data':finalBuildingGJ
  }
//onlick get geojson object properties.
actualB = {}
currentid = ''
actualBProps = {}
// unprocessedFloors = []
// floorArray = []
fullFloors = []
processedFloors_noHeight = []
// finalBuildingGJ = {}
Newmap.on('click', function(e) {

  console.log(e)
   if(e.originalEvent.ctrlKey==true){
   console.log(JSON.stringify(e.lngLat))
     f = dataGetter(e.lngLat)
   }
   
   if(e.originalEvent.shiftKey==true){
     f = sitePicker(e)
   }
   Oldmap.getSource('building').setData(finalBuildingGJ)
   //get selected features
   currentid = Draw.getSelectedIds()[0]
   proposedB = Draw.getAll().features
   console.log(proposedB)
   // filter function
   currentFeature = R.filter(R.propEq('id', currentid), proposedB)[0]
   if(!(typeof(currentFeature) == 'undefined')){
   actualBGeom = R.assoc(currentFeature.id, R.clone(currentFeature),actualB)
   //put selected features in table

   if (!(R.has(currentid)(actualBProps))){
   actualBProps[currentid] = {properties:{}}
   }
   if (!(R.has('properties')(actualBProps[currentid]))){
   R.assoc('properties',{},actualBProps[currentid])
   }

   document.getElementById('rank').value = (actualBProps[currentid].properties.rank||'')
   document.getElementById('type').value = (actualBProps[currentid].properties.type||'')
   document.getElementById('floors').value = (actualBProps[currentid].properties.floors||'')
   sourceUpdater()
   Oldmap.getSource('building').setData(finalBuildingGJ)
   }
});

//take list of prop objects and geom, sort by rank, duplicate by number of floors iterating height and base height, attach geom and make feature


//'building' source updater
sourceUpdater = function(){

   // console.log(actualBProps)
   // console.log(actualBGeom)
   //update features based on input values
   unprocessedFloors = []
   unprocessedFloors = combiner()
   //sort by rank
   unprocessedFloors.sort(function(a,b){return R.view(rankLens,a)-R.view(rankLens,b)})

   floorArray = unprocessedFloors.map(R.view(floorLens))
   // const floorArray = floorArray
   fullFloors = floorArray.map(fillArray)
   processedFloors_noHeight = [].concat.apply([],fullFloors)
   //rewrite geojson

   processedFloors_noHeight.map(heightAdder)
   finalBuildingGJ.features = processedFloors_noHeight
  }

combiner = function(){
   return finalBuilding = Draw.getAll().features.map(propertyAdder)
  }

propertyAdder = function(e){
   test = e
   test.properties = actualBProps[e.id].properties
   return test
  }

function fillArray(item, index) {
  var arr = [];
  for (let i = 0; i < item; i++) {

   (function(j){
 arr.push(R.clone(unprocessedFloors[index]));
   })(i)

  }
  return arr;
}

function heightAdder(obj, i, arr){
   // console.log(i)
   k = i
   tobj = obj
   // console.log(k)
   arr[i].properties.height = (k+1)*4-0.2
   arr[i].properties.base_height = k*4
   arr[i].properties.color = "OrangeRed"
   arr[i].id = k
   return arr[i]
   // console.log(obj)
  }


rankLens = R.pipe(R.lensProp('rank'),R.lensProp('properties'))
floorLens = R.pipe(R.lensProp('floors'),R.lensProp('properties'))

//add listners to inputs
changer = function(variable){
   document.getElementById(variable).addEventListener("change",
   function(event){
   // actualBprops
   current = actualBProps[currentid]
   actualBProps[currentid].properties[variable] = (parseInt(document.getElementById(variable).value)||document.getElementById(variable).value)
   sourceUpdater()
   Oldmap.getSource('building').setData(finalBuildingGJ)
  });
  }

//render GeoJSON source to map
Oldmap.on('load', function () {
   Oldmap.addSource('building', building);
   Oldmap.addLayer({
   'id': 'building1',
   'type': 'fill',
   'source': 'building',
   'paint': {
   // See the Mapbox Style Spec for details on property functions
   // https://www.mapbox.com/mapbox-gl-style-spec/#types-function
   'fill-color': {
 // Get the fill-color from the source 'color' property.
 'property': 'color',
 'type': 'identity'
   },
   'fill-extrude-height': {
 // Get fill-extrude-height from the source 'height' property.
 'property': 'height',
 'type': 'identity'
   },
   'fill-extrude-base': {
 // Get fill-extrude-base from the source 'base_height' property.
 'property': 'base_height',
 'type': 'identity'
   },
   // Make extrusions slightly opaque for see through indoor walls.
   'fill-opacity': 0.8

   }
   });

   changer('rank')
   changer('type')
   changer('floors')

  });


//render GeoJSON source to map
Newmap.on('load', function () {
   Newmap.dragRotate.disable();
   Newmap.addSource('wms-lot-size', {
   'type': 'raster',
   'tiles': [
   'https://opendata.planningportal.nsw.gov.au/cgi-bin/qgis_mapserv.fcgi?map=/data/maps/nswdpe_opendata.qgs&&SERVICE=WMS&VERSION=1.1.1&REQUEST=GetMap&BBOX={bbox-epsg-3857}&SRS=EPSG:3857&WIDTH=256&HEIGHT=256&LAYERS=lot_size&STYLES=&FORMAT=image/png; mode=16bit&DPI=96&MAP_RESOLUTION=96&FORMAT_OPTIONS=dpi:96'  
   ],
   'tileSize': 256
});
    // Newmap.addLayer({
    //         'id': 'lot-size',
    //         'type': 'raster',
    //         'source': 'wms-lot-size',
    //         'paint': {}
    //         }, 
    //     'aeroway-taxiway'
    //     );



    // wmsLayers.map(function(e){
    //    Newmap.addSource('wms-'+e,{
    //    'type':'raster',
    //    'tiles':['https://opendata.planningportal.nsw.gov.au/cgi-bin/qgis_mapserv.fcgi?map=/data/maps/nswdpe_opendata.qgs&&SERVICE=WMS&VERSION=1.1.1&REQUEST=GetMap&BBOX={bbox-epsg-3857}&SRS=EPSG:3857&WIDTH=256&HEIGHT=256&LAYERS='+e+'&STYLES=&FORMAT=image/png; mode=16bit&DPI=96&MAP_RESOLUTION=96&FORMAT_OPTIONS=dpi:96' 
    //    ],
    //    'tileSize':256
    //    });
    //    Newmap.addLayer({
    //    'id':e,
    //    'type':'raster',
    //    'source':'wms-'+e,
    //    'paint':{}},'wms'+e+'yah')
    //    })



    // new MapboxGLLayers({
    //  layers: {
    //    'lot size': 'lot-size',
    //    'lga':'local_government_area',
    //    'heritage':'heritage',
    //    'hob':'height_of_building',
    //    'fsr':'floor_space_ratio',
    //    'lzn':'land_zoning'
    //  }
    // }).addTo(Newmap) // map is the mapbox gl map instance

});

wmsLayers = ['local_government_area','heritage','height_of_building','floor_space_ratio','land_zoning']



var Draw = mapboxgl.Draw();
Newmap.addControl(Draw);