export const closestLocation = (userLocation, venuesList) => {
  // return the closest venue to the user location
  const radians = function (degree) {
    // degrees to radians
    const rad = (degree * Math.PI) / 180;

    return rad;
  };
  const haversine = (lat1, lon1, lat2, lon2) => {
    const R = 6372.8; // km
    const dlat = radians(lat2 - lat1);
    const dlon = radians(lon2 - lon1);
    const Lat1 = radians(lat1);
    const Lat2 = radians(lat2);
    const a =
      Math.sin(dlat / 2) * Math.sin(dlat / 2) +
      Math.sin(dlon / 2) * Math.sin(dlon / 2) * Math.cos(Lat1) * Math.cos(Lat2);
    const c = 2 * Math.asin(Math.sqrt(a));
    return R * c;
  };

  const uLocation = {
    lat: userLocation.latitude,
    lon: userLocation.longitude,
  };

  if (userLocation.error != null || venuesList?.length === 0) {
    return;
  }

  const closest = venuesList?.reduce((acc, ven) => {
    const accValue = haversine(uLocation.lat, uLocation.lon, acc.Lat, acc.Lon);
    const newValue = haversine(
      uLocation.lat,
      uLocation.lon,
      ven.Lat.split(',')[0],
      ven.Lon.split(',')[0]
    );
    return accValue < newValue ? acc : ven;
  }, {});

  return closest;
};
