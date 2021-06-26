/* eslint-disable no-unused-expressions */
/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import Head from 'next/head';
import styled from 'styled-components';
// import { GrLocationPin } from 'react-icons/gr';
// import { AiOutlineMonitor } from 'react-icons/ai';
import { MdAdjust } from 'react-icons/md';
import { measureGeoDistance } from '../utils/measureGeoDistance';
import { getVenuesType } from '../utils/dataParsing';
import Divider from '../components/Divider';
import useGeolocation from '../hook/useGeolocation';
import MapCard from '../components/MapCard';
import MapComponent from '../components/MapComponent';
import Header from '../components/Header';

const Columns = styled.div`
  display: flex;
  flex-direction: column;
`;
const VenuesWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 1rem;
`;

const ListOfVenues = styled.table`
  max-width: 100%;
  overflow: hidden;
  th {
    background-color: black;
    color: white;
    padding: 5px;
  }
  th {
    height: 40px;
  }
  td {
    padding: 10px 5px;
  }
  tr:nth-child(2n + 3) {
    background-color: #e5e5e5;
  }
`;
const TableTitle = styled.div`
  text-align: center;
`;

const MapOptions = styled.div`
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  justify-content: space-around;
  padding: 1em;
  gap: 1rem;
`;

export default function MapHome() {
  const [venues, setVenues] = useState([]);
  const [venuesTypes, setVenuesTypes] = useState([]);
  const [venuesTypeFilter, setVenuesTypeFilter] = useState([]);
  const [closestVenue, setClosestVenue] = useState(null); // distance to closest location
  const userLocation = useGeolocation();

  const queryFunction = async (url) => {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed fetching data');
    }

    return response.json();
  };

  const { isLoading, data: urlData, error, isFetching } = useQuery(
    'urlData',
    async () => {
      const data = await queryFunction(
        'https://data.nsw.gov.au/data/api/3/action/package_show?id=0a52e6c1-bc0b-48af-8b45-d791a6d8e289'
      );
      const { url } = data.result.resources[1];
      return url;
    }
  );

  const { isIdle, data: venuesData } = useQuery(
    'venues',
    () => queryFunction(urlData),
    {
      enabled: !!urlData,
    }
  );

  useEffect(() => {
    if (!isIdle && venuesData) {
      const venuesParsed = [];

      // eslint-disable-next-line no-restricted-syntax
      for (const key in venuesData.data) {
        if (Object.prototype.hasOwnProperty.call(venuesData.data, key)) {
          // fill venues.data with venue type (key) (monitor, isolation, ...)
          const venuesWithTypeOfVenue = venuesData.data[key].map((venue) => ({
            ...venue,
            venueType: key,
          }));
          venuesParsed.push(...venuesWithTypeOfVenue);
        }
      }

      setVenues({ date: venuesData.date, data: venuesParsed });
    }
  }, [venuesData, isIdle]);

  useEffect(() => {
    venues?.data && setVenuesTypes(getVenuesType(venues));
  }, [venues]);

  useEffect(() => {
    setVenuesTypeFilter(venuesTypes);
  }, [venuesTypes]);

  useEffect(() => {
    if (
      window.gMaps &&
      userLocation.error === null &&
      venues?.data?.length !== 0
    ) {
      setClosestVenue(measureGeoDistance(userLocation, venues));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userLocation, venues]);

  const toggleData = (el) => {
    const target = el.target.value;
    if (venuesTypeFilter.includes(target)) {
      setVenuesTypeFilter(venuesTypeFilter.filter((e) => e !== target));
    } else {
      setVenuesTypeFilter((prevState) => [...prevState, target]);
    }
  };

  if (isLoading) return <div> Loading </div>;
  if (error) return <div> something went wrong</div>;

  return (
    <>
      <Head>
        <title>Map of covid locations on Sydney</title>
      </Head>
      <Header>
        <h3>COVID MAP</h3>
      </Header>
      <Divider isFetching={isFetching} />
      <Columns>
        <MapOptions>
          <MapCard title="Dataset Info">
            {venues.date}
            {venues.length}
          </MapCard>
          <MapCard title="Closest Venue">
            {closestVenue ? (
              <>
                <div>{`${closestVenue.D} km` || '-'}</div>
                <div>{closestVenue.Venue}</div>
              </>
            ) : (
              <div>LOADING</div>
            )}
          </MapCard>
          <MapCard title="Options">
            {venuesTypes.map((type) => (
              <label key={type} htmlFor={type}>
                <input
                  type="checkbox"
                  id={type}
                  name={type}
                  value={type}
                  onChange={toggleData}
                  checked={venuesTypeFilter.includes(type)}
                />
                {type} (
                {venues.data.filter((ven) => ven.venueType === type).length} )
                <MdAdjust />
              </label>
            ))}
          </MapCard>
        </MapOptions>
        <MapComponent
          markers={venues.data}
          userLocation={userLocation}
          venuesTypeFilter={venuesTypeFilter}
        />
        <VenuesWrapper>
          {Object.keys(venues).length !== 0 && (
            <>
              <TableTitle>
                <h3>Venues</h3>
              </TableTitle>
              <ListOfVenues>
                <thead>
                  <tr>
                    <th>Venue</th>
                    <th>Suburb</th>
                    <th>Address</th>
                    <th>Date</th>
                    <th>Time</th>
                  </tr>
                </thead>
                <tbody>
                  {venues?.data?.length > 0 &&
                    venues.data.map((venue, i) => (
                      <tr key={`monitor${i}`}>
                        <td>{venue.Venue}</td>
                        <td>{venue.Suburb}</td>
                        <td>{venue.Address}</td>
                        <td>{venue.Date}</td>
                        <td>{venue.Time}</td>
                      </tr>
                    ))}
                </tbody>
              </ListOfVenues>
            </>
          )}
        </VenuesWrapper>
      </Columns>
    </>
  );
}
