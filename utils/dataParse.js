export function addVenueType(venuesData){
  let venuesParsed = []  
  for (const key in venuesData) {
    if (Object.prototype.hasOwnProperty.call(venuesData, key)) {
      // fill venues.data with venue type (key) (monitor, isolation, ...)
      const venuesWithTypeOfVenue = venuesData[key].map((venue) => ({
        ...venue,
        venueType: key,
      }));
      venuesParsed.push(...venuesWithTypeOfVenue);
    }
  }
  return venuesParsed
} 

export const getVenuesType = (venues) => {
  const types = [];
  venues.data.map((ven) =>
    types.includes(ven.venueType) ? null : types.push(ven.venueType)
  );

  return types;
};
