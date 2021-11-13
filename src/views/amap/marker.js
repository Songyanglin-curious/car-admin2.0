let marker = null;
export function ampaSetMarker(lnglat,map){
  if(marker){
    map.remove(marker)
    marker = null;
  }
  let lng = lnglat.lng;
  let lat = lnglat.lat;
  marker = new AMap.Marker({
      position: [lng,lat]
  });
  map.add(marker);
}
export function amapClearMarker(map){
  if(marker){
    map.remove(marker)
    marker = null;
  }
}

