import { useEffect, useState } from 'react';
import Head from 'next/head';
import styled from 'styled-components';
import { GrLocationPin } from 'react-icons/gr';
import { AiOutlineMonitor } from 'react-icons/ai';
import { MdLoupe, MdAdjust } from 'react-icons/md';
import ReturnArrow from '../components/ReturnArrow';
import Divider from '../components/Divider';
import useGeolocation from '../hook/useGeolocation';
import MapCard from '../components/MapCard';
import MapComponent from '../components/MapComponent';

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
  const [isolate, setIsolate] = useState([]);
  const [monitors, setMonitor] = useState([]);
  const [showMonitors, setShowMonitors] = useState(true);
  const [showIsolate, setShowIsolate] = useState(true);

  const [closestVenue, setClosestVenue] = useState(null); // distance to closest location
  const [mapState, setMapState] = useState({
    center: [-33.63, 151.32],
    zoom: 12,
  });

  const userLocation = useGeolocation();
  const closestLocation = () => {
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

    const venuesList = [...monitors, ...isolate];

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
        ven.Lat,
        ven.Lon
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
    if (Object.keys(venues).length !== 0) {
      console.log(venues);

      setIsolate(venues.data.isolate || []);
      setMonitor(venues.data.monitor || []);
    }
  }, [venues]);

  useEffect(() => {
    if (
      window.gMaps &&
      userLocation.error === null &&
      Object.keys(venues).length !== 0
    ) {
      measureDistance();
    }
  }, [userLocation, venues]);

  const toggleData = (el) => {
    const target = el.target.value;
    target === 'monitor'
      ? setShowMonitors((prevState) => !prevState)
      : setShowIsolate((prevState) => !prevState);
  };

  const createMapOptions = function () {
    return {
      panControl: true,
      mapTypeControl: true,
      scrollwheel: true,
      zoom: mapState.zoom,
      center: mapState.center,
    };
  };

  const handleApiLoaded = (map, maps) => {
    window.gMaps = maps;
  };

  const onMapChange = (data) => {
    // console.log('on map change', data);
  };

  return (
    <>
      <Head>
        <title>Map of covid Locations on Sydney</title>
      </Head>
      <ReturnArrow />
      <h3>COVID MAP</h3>
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
            <label htmlFor="monitor">
              <input
                type="checkbox"
                id="monitor"
                name="monitor"
                value="monitor"
                checked={showMonitors}
                onChange={toggleData}
              />
              Monitor ( {monitors.length} ) <MdAdjust />
            </label>

            <label htmlFor="isolate">
              <input
                type="checkbox"
                id="isolate"
                name="isolate"
                value="isolate"
                checked={showIsolate}
                onChange={toggleData}
              />
              Isolate ( {isolate.length} ) <MdLoupe />
            </label>
          </MapCard>
        </MapOptions>
        <MapComponent
          markers={venues.data.monitor}
          userLocation={userLocation}
        />
        <VenuesWrapper>
          <TableTitle>
            <h3>
              <GrLocationPin /> Isolate
            </h3>
          </TableTitle>
          {Object.keys(venues).length !== 0 && (
            <>
              <ListOfVenues>
                <thead>
                  <tr>
                    <th>Venue</th>
                    <th>Suburb</th>
                    <th>Address</th>
                    <th>Date</th>
                    <th>Time</th>
                    {/* <th>Alert</th> */}
                  </tr>
                </thead>
                <tbody>
                  {isolate.length > 0 &&
                    isolate.map((venue, i) => (
                      <tr key={`isolate${i}`}>
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
              <TableTitle>
                <h3>
                  <AiOutlineMonitor />
                  Monitor
                </h3>
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
                  {monitors.length > 0 &&
                    monitors.map((venue, i) => (
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

  return {
    props: { venues: fetchVenues }, // will be passed to the page component as props
    revalidate: 1,
  };
}
