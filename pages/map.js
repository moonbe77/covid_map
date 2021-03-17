/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import { QueryClient, QueryClientProvider, useQuery } from 'react-query';
import Head from 'next/head';
import styled from 'styled-components';
import { GrLocationPin } from 'react-icons/gr';
import Axios from 'axios';
import { AiOutlineMonitor } from 'react-icons/ai';
import { MdLoupe, MdAdjust } from 'react-icons/md';
import { measureGeoDistance } from '../utils/measureGeoDistance';
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

  const { isLoading, error, data: urlData } = useQuery('urlData', () =>
    fetch(
      'https://data.nsw.gov.au/data/api/3/action/package_show?id=0a52e6c1-bc0b-48af-8b45-d791a6d8e289'
    )
      .then((res) => res.json())
      .then((data) => {
        const { url } = data.result.resources[1];
        return url;
      })
  );

  const getVenues = fetch(urlData)
    .then((data) => data.json())
    .then((data) => {
      const venuesParsed = [];
      // eslint-disable-next-line no-restricted-syntax
      for (const key in data.data) {
        if (Object.prototype.hasOwnProperty.call(data.data, key)) {
          // grab every key from venues.data and put the venue type (key) inside the venue data
          const venuesWithTypeOfVenue = data.data[key].map((venue) => ({
            ...venue,
            venueType: key,
          }));
          venuesParsed.push(...venuesWithTypeOfVenue);
        }
      }

      return venuesParsed;
    });

  const { isIdle, error: venuesError, data: venuesData } = useQuery(
    'venues',
    getVenues,
    {
      enabled: !!urlData,
    }
  );

  console.log(venuesError, venuesData);

  useEffect(() => {
    const types = [];
    if (venues?.data?.length > 0) {
      venues.data.forEach((ven) => {
        if (types.length === 0) {
          types.push(ven.venueType);
          return;
        }

        types.includes(ven.venueType) === false && types.push(ven.venueType);
      });

      setVenuesTypes(types);
    }
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

  return (
    <>
      <Head>
        <title>Map of covid Locations on Sydney</title>
      </Head>
      <Header>
        <h3>COVID MAP</h3>
      </Header>
      <Divider />
      <Columns>
        <MapOptions>
          <MapCard title="Dataset Date"> {venues.date}</MapCard>
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
                {type} ({' '}
                {venues.data.filter((ven) => ven.venueType === type).length} ){' '}
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
                    {/* <th>alert</th> */}
                  </tr>
                </thead>
                <tbody>
                  {venues.data.length > 0 &&
                    venues.data.map((venue, i) => (
                      <tr key={`monitor${i}`}>
                        <td>{venue.Venue}</td>
                        <td>{venue.Suburb}</td>
                        <td>{venue.Address}</td>
                        <td>{venue.Date}</td>
                        <td>{venue.Time}</td>
                        {/* <td
                        dangerouslySetInnerHTML={{
                          __html: venue.HealthAdviceHTML,
                        }}
                      /> */}
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

// export async function getStaticProps() {
//   const fetchDataUrl = await fetch(
//     'https://data.nsw.gov.au/data/api/3/action/package_show?id=0a52e6c1-bc0b-48af-8b45-d791a6d8e289'
//   );
//   const dataUrl = await fetchDataUrl.json();

//   const { url } = dataUrl.result.resources[1];
//   // const url = 'https://data.nsw.gov.au/data/dataset/0a52e6c1-bc0b-48af-8b45-d791a6d8e289/resource/f3a28eed-8c2a-437b-8ac1-2dab3cf760f9/download/covid-case-locations-30-12-20-9am.json'

//   const fetchVenues = await Axios.get(url);
//   const venuesData = fetchVenues.data;

//   if (!venuesData) {
//     return {
//       notFound: true,
//     };
//   }
//   // get all the venues coming from the api [venus.data] and put all together with an extra key with the type of data

//   const venuesParsed = [];
//   // eslint-disable-next-line no-restricted-syntax
//   for (const key in venuesData.data) {
//     if (Object.prototype.hasOwnProperty.call(venuesData.data, key)) {
//       // grab every key from venues.data and put the venue type (key) inside the venue data
//       const venuesWithTypeOfVenue = venuesData.data[key].map((venue) => ({
//         ...venue,
//         venueType: key,
//       }));
//       venuesParsed.push(...venuesWithTypeOfVenue);
//     }
//   }

//   const venues = {
//     date: venuesData.date,
//     data: venuesParsed,
//   };
//   return {
//     props: { venues }, // will be passed to the page component as props
//     revalidate: 1,
//   };
// }
