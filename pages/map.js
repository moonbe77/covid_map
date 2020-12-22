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
  thead {
    background-color: black;
    color: white;
    padding: 5px;
  }
  thead {
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

export default function MapHome() {
  const [venues, setVenues] = useState({});
  const [isolate, setIsolate] = useState([]);
  const [monitors, setMonitor] = useState([]);
  const [showMonitors, setShowMonitors] = useState(true);
  const [showIsolate, setShowIsolate] = useState(true);
  const [showSnapshot, setShowSnapshot] = useState(false);
  const [venueSelected, setVenueSelected] = useState({});
  const [mapState, setMapState] = useState({
    center: [-33.63, 151.32],
    zoom: 10,
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

  const _distanceToMouse = (markerPos, mousePos, markerProps) => {
    // console.log(markerPos);
    // console.log(mousePos);
    // console.log(markerProps);
    const { x } = markerPos;
    // because of marker non symmetric,
    // we transform it central point to measure distance from marker circle center
    // you can change distance function to any other distance measure
    const { y } = markerPos;

    // and i want that hover probability on markers with text === 'A' be greater than others
    // so i tweak distance function (for example it's more likely to me that user click on 'A' marker)
    // another way is to decrease distance for 'A' marker
    // this is really visible on small zoom values or if there are a lot of markers on the map
    const distanceKoef = markerProps.text !== 'A' ? 1.5 : 1;
    // it's just a simple example, you can tweak distance function as you wish
    const distance =
      distanceKoef *
      Math.sqrt(
        (x - mousePos.x) * (x - mousePos.x) +
          (y - mousePos.y) * (y - mousePos.y)
      );
    // console.log(distance);
    return distance;
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
      <Divider />
      <Columns>
        <MapWrapper>
          <MapOptions>
            <div>Dataset Date: {venues.date}</div>
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
                key: process.env.NEXT_PUBLIC_MAPS_API_KEY,
              }}
              options={createMapOptions}
              center={mapState.center}
              zoom={mapState.zoom}
              distanceToMouse={_distanceToMouse}
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
                {isolate.length > 0 &&
                  isolate.map((venue, i) => (
                    <tbody key={`isolate${i}`}>
                      <tr>
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
                    </tbody>
                  ))}
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
                {monitors.length > 0 &&
                  monitors.map((venue, i) => (
                    <tbody key={`monitor${i}`}>
                      <tr>
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
                    </tbody>
                  ))}
              </ListOfVenues>
            </>
          )}
        </VenuesWrapper>
      </Columns>
    </>
  );
}
