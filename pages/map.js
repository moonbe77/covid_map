/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import Head from 'next/head';
import styled from 'styled-components';
import { GrLocationPin } from 'react-icons/gr';
import { AiOutlineMonitor } from 'react-icons/ai';
import { MdLoupe, MdAdjust } from 'react-icons/md';
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

export default function MapHome({ venues }) {
  const [venuesTypes, setVenuesTypes] = useState([]);
  const [venuesTypeFilter, setVenuesTypeFilter] = useState([]);
  const [closestVenue, setClosestVenue] = useState(null); // distance to closest location

  const userLocation = useGeolocation();
  const closestLocation = () => {
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
        Math.sin(dlon / 2) *
          Math.sin(dlon / 2) *
          Math.cos(Lat1) *
          Math.cos(Lat2);
      const c = 2 * Math.asin(Math.sqrt(a));
      return R * c;
    };

    const uLocation = {
      lat: userLocation.latitude,
      lon: userLocation.longitude,
    };

    if (userLocation.error != null || Object.keys(venues).length === 0) {
      return;
    }

    const venuesList = venues.data;

    const closest = venuesList.reduce((acc, ven) => {
      // console.log('acc', acc);
      // console.log('ven', ven);
      const accValue = haversine(
        uLocation.lat,
        uLocation.lon,
        acc.Lat,
        acc.Lon
      );
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

  const measureDistance = () => {
    const p1 = new window.gMaps.LatLng(
      userLocation.latitude,
      userLocation.longitude
    );
    const closest = closestLocation();

    const p2 = new window.gMaps.LatLng(closest.Lat, closest.Lon);
    const D = (
      window.gMaps.geometry.spherical.computeDistanceBetween(p1, p2) / 1000
    ).toFixed(2); // in Km

    setClosestVenue({ ...closest, D });
  };

  useEffect(() => {
    if (venues.data.length > 0) {
      const types = [];

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
      Object.keys(venues.data).length !== 0
    ) {
      measureDistance();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userLocation, venues]);

  const toggleData = (el) => {
    const target = el.target.value;
    console.log(target);
    if (venuesTypeFilter.includes(target)) {
      setVenuesTypeFilter(venuesTypeFilter.filter((e) => e !== target));
    } else {
      setVenuesTypeFilter((prevState) => [...prevState, target]);
    }
  };

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
          <TableTitle>
            <h3>
              <GrLocationPin /> Isolate
            </h3>
          </TableTitle>
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

export async function getStaticProps() {
  const fetchVenues = await fetch(
    'https://data.nsw.gov.au/data/dataset/0a52e6c1-bc0b-48af-8b45-d791a6d8e289/resource/f3a28eed-8c2a-437b-8ac1-2dab3cf760f9/download/venue-data-2020-dec-19-pm.json'
  ).then((res) => res.json());

  if (!fetchVenues) {
    return {
      notFound: true,
    };
  }
  // get all the venues coming from the api [venus.data] and put all together with an extra key with the type of data

  const venuesParsed = [];
  // eslint-disable-next-line no-restricted-syntax
  for (const key in fetchVenues.data) {
    if (Object.prototype.hasOwnProperty.call(fetchVenues.data, key)) {
      // grab every key from venues.data and put the venue type (key) inside the venue data
      const venuesWithTypeOfVenue = fetchVenues.data[key].map((venue) => ({
        ...venue,
        venueType: key,
      }));
      venuesParsed.push(...venuesWithTypeOfVenue);
    }
  }

  const venues = {
    date: fetchVenues.date,
    data: venuesParsed,
  };

  return {
    props: { venues }, // will be passed to the page component as props
    revalidate: 1,
  };
}
