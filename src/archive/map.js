// Generated by CoffeeScript 1.10.0
var addMap, createMap, informationArray, mapC, users;

mapC = {};

mapC.controller = function() {};

mapC.view = function(ctrl, args) {
  return m('div', {
    id: "map",
    config: addMap
  });
};

users = m.prop([]);

addMap = function(element, isInitialized, context) {
  if (isInitialized) {
    return;
  }
  createMap(element);
  return addDataToMap();
};

createMap = function(elID) {
  var map;
  console.log(elID);
  map = L.map(elID).setView([-31, 151], 13);
};

informationArray = [];

$.ajax({
  url: "http://da.ballina.nsw.gov.au/atdis/1.0/applications.json",
  dataType: "json",
  success: function(response) {
    var application, i, len, ref;
    ref = response.response;
    for (i = 0, len = ref.length; i < len; i++) {
      application = ref[i];
      console.log(application);
      informationArray.push(application.application.info.estimated_cost);
    }
    informationArray.push("success");
  }
});

m.mount(document.body, mapC);

//# sourceMappingURL=map.js.map
