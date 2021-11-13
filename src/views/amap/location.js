export function addressSetMapCenter(address,map) {
  const geocoder = new AMap.Geocoder({});
  geocoder.getLocation(address, function (status, result) {
    if (status === 'complete' && result.geocodes.length) {
      // var lnglat = result.geocodes[0].location;
      let lat = result.geocodes[0].location.lat;
      let lng = result.geocodes[0].location.lng;
      map.setCenter([lng, lat]); //设置地图中心点
    } else {
      console.log('根据地址查询位置失败');
    }
  });
}
