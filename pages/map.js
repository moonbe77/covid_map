/* eslint-disable react/jsx-no-bind */
import { useEffect, useState } from 'react';
import Head from 'next/head';
import styled from 'styled-components';
import GoogleMapReact from 'google-map-react';
import { GrLocationPin } from 'react-icons/gr';
import { AiOutlineMonitor } from 'react-icons/ai';
import { MdLoupe, MdPersonPinCircle, MdAdjust } from 'react-icons/md';
import MapPin from '../components/MapPin';
import ReturnArrow from '../components/ReturnArrow';
import Divider from '../components/Divider';
import Snapshot from '../components/Snapshot';
import useGeolocation from '../hook/useGeolocation';

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

const MapWrapper = styled.div`
  box-shadow: 0 0 7px -4px gray;
  margin-top: 1rem;
`;

const MapBox = styled.div`
  height: 60vh;
  position: relative;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const MapOptions = styled.div`
  align-items: center;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  padding: 1em;
`;
const ToggleData = styled.div`
  display: flex;
  flex-direction: column;
`;

const callback = (resp, status) => {
  console.log('distance callback', status, resp);
};

export default function MapHome() {
  const [venues, setVenues] = useState({});
  const [isolate, setIsolate] = useState([]);
  const [monitors, setMonitor] = useState([]);
  const [showMonitors, setShowMonitors] = useState(true);
  const [showIsolate, setShowIsolate] = useState(true);
  const [showSnapshot, setShowSnapshot] = useState(false);
  const [venueSelected, setVenueSelected] = useState({});
  const [distance, setDistance] = useState(null); // distance to closest location
  const [mapState, setMapState] = useState({
    center: [-33.63, 151.32],
    zoom: 12,
  });

  const userLocation = useGeolocation();

  useEffect(() => {
    fetch(
      'https://data.nsw.gov.au/data/dataset/0a52e6c1-bc0b-48af-8b45-d791a6d8e289/resource/f3a28eed-8c2a-437b-8ac1-2dab3cf760f9/download/venue-data-2020-dec-19-pm.json'
    )
      .then((res) => res.json())
      .then((res) => {
        setVenues(res);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    if (Object.keys(venues).length !== 0) {
      setIsolate(venues.data.isolate);
      setMonitor(venues.data.monitor);
    }
  }, [venues]);

  // TODO: add dynamic centering and zoom of map.
  useEffect(() => {
    if (userLocation) {
      setMapState((prev) => ({
        ...prev,
        center: [userLocation.latitude, userLocation.longitude],
      }));
    }
  }, [venues]);

  const getData = (type, index) => {
    switch (type) {
      case 'monitor':
        return monitors[index];
      case 'isolate':
        return isolate[index];

      default:
        break;
    }
  };

  const distanceToLocation = () => {
    console.log('distanceToLocation');
    const uLocation = {
      lat: userLocation.latitude,
      lon: userLocation.longitude,
    };

    if (userLocation.error != null || Object.keys(venues).length === 0) {
      return;
    }

    // go trouhgh the list of venues and find the closest one
    // console.log(uLocation);
    // console.log(monitors);
    const monitorsList = monitors;
    const threshold = 200;
    const diff = (userLat, venueLat) => Math.abs(userLat - venueLat);

    const closest = monitorsList.reduce((acc, ven) => {
      const accValue = diff(uLocation.lat, acc.lat);
      const newValue = diff(uLocation.lat, ven.lat);
      return accValue < newValue ? acc : ven;
    });

    // console.log('closest', closest);
    return closest;
  };

  useEffect(() => {
    if (window.gMaps) {
      measureDistance();
    }
    console.log('from use effect', window.gMaps);
  }, [userLocation]);

  const handlePinClick = (e) => {
    // console.log(e.pageX, e.pageY);
    const pin = e.target;
    const dataType = pin.dataset.type;
    const { index } = pin.dataset;
    if (!pin) {
      console.log('algo salio mal');
    } else {
      // console.log(getData(dataType, index));
      setShowSnapshot(true);
      setVenueSelected(getData(dataType, index));
    }
  };

  const toggleSnapshot = () => {
    setShowSnapshot((state) => !state);
  };

  const toggleData = (el) => {
    const target = el.target.value;
    target === 'monitor'
      ? setShowMonitors((prevState) => !prevState)
      : setShowIsolate((prevState) => !prevState);
  };

  const createMapOptions = function (maps) {
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

  const measureDistance = () => {
    const p1 = new window.gMaps.LatLng(
      userLocation.latitude,
      userLocation.longitude
    );

    const p2 = new window.gMaps.LatLng(monitors[0].Lat, monitors[0].Lon);
    console.log(p1, p2);

    const D = (
      window.gMaps.geometry.spherical.computeDistanceBetween(p1, p2) / 1000
    ).toFixed(2); // in Km

    setDistance(D);
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
        <MapWrapper>
          <MapOptions>
            <div>Dataset Date: {venues.date}</div>
            <div>Distance to closest location: {distance || '-'}</div>
            <ToggleData>
              <label htmlFor="monitor">
                <input
                  type="checkbox"
                  id="monitor"
                  name="monitor"
                  value="monitor"
                  checked={showMonitors}
                  onChange={toggleData}
                />
                Show Monitor Locations
                <MdAdjust />
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
                Show Isolate Locations
                <MdLoupe />
              </label>
            </ToggleData>
          </MapOptions>
          <MapBox>
            <GoogleMapReact
              bootstrapURLKeys={{
                libraries: ['geometry'],
                key: process.env.NEXT_PUBLIC_MAPS_API_KEY,
              }}
              options={createMapOptions}
              center={mapState.center}
              zoom={mapState.zoom}
              yesIWantToUseGoogleMapApiInternals
              onGoogleApiLoaded={({ map, maps }) => handleApiLoaded(map, maps)}
              onChange={onMapChange}
            >
              {isolate.length > 0 &&
                showIsolate &&
                isolate.map((venue, i) => (
                  <MapPin
                    key={`isolate-${i}`}
                    lat={venue.Lat}
                    lng={venue.Lon}
                    data-index={i}
                    data-type="isolate"
                    typeOfPin="isolate"
                    onClick={handlePinClick}
                  />
                ))}
              {monitors.length > 0 &&
                showMonitors &&
                monitors.map((venue, i) => (
                  <MapPin
                    key={`monitor-${i}`}
                    lat={venue.Lat}
                    lng={venue.Lon}
                    data-index={i}
                    data-type="monitor"
                    typeOfPin="monitors"
                    onClick={handlePinClick}
                  />
                ))}
              {userLocation.latitude !== null && (
                <MapPin
                  lat={userLocation.latitude}
                  lng={userLocation.longitude}
                  data-type="userLocation"
                  typeOfPin="userLocation"
                  text="user"
                  // onClick={handlePinClick}
                >
                  USER
                </MapPin>
              )}
            </GoogleMapReact>
            <Snapshot
              toggleSnapshot={toggleSnapshot}
              isOpen={showSnapshot}
              info={venueSelected}
            />
          </MapBox>
        </MapWrapper>
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
