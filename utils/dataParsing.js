export const getVenuesType = (venues) => {
  // It returns a list of values of the key
  const types = [];

  venues.data.forEach((ven) => {
    if (types.length === 0) {
      types.push(ven.venueType);
      return;
    }

    types.includes(ven.venueType) === false && types.push(ven.venueType);
  });

  return types;
};
