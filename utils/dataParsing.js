export const getVenuesType = (venues) => {
  const types = [];
  venues.data.map((ven) =>
    types.includes(ven.venueType) ? null : types.push(ven.venueType)
  );

  return types;
};
