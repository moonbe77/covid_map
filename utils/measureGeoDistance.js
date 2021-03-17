import { closestLocation } from './closestLocation';

export const measureGeoDistance = (userLocation, venues) => {
  const p1 = new window.gMaps.LatLng(
    userLocation.latitude,
    userLocation.longitude
  );
  const closest = closestLocation(userLocation, venues.data);

  const p2 = new window.gMaps.LatLng(closest?.Lat, closest?.Lon);
  const D = (
    window.gMaps.geometry.spherical.computeDistanceBetween(p1, p2) / 1000
  ).toFixed(2); // in Km

  return { ...closest, D };
};
