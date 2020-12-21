/* eslint-disable react/jsx-no-bind */
import { useEffect, useState } from 'react';
import Head from 'next/head';
import styled from 'styled-components';
import GoogleMapReact from 'google-map-react';
import { GrLocationPin } from 'react-icons/gr';
import { AiOutlineMonitor } from 'react-icons/ai';
import { check } from 'prettier';
import MapPin from '../components/MapPin';
import ReturnArrow from '../components/ReturnArrow';
import Divider from '../components/Divider';
import Snapshot from '../components/Snapshot';

const Columns = styled.div`
  display: flex;
  flex-direction: column;
`;
const VenuesWrapper = styled.div`
  display: flex;
  flex-direction: row;
  margin-top: 1rem;
`;

const ListOfVenues = styled.div`
  display: flex;
  padding-left: 1rem;
  flex-direction: column;
  flex: 1;
`;

const MapWrapper = styled.div`
  box-shadow: 0 0 7px 0 gray;
  margin-top: 1rem;
`;

const MapBox = styled.div`
  width: 100%;
  height: 60vh;
  position: relative;
`;

const MapOptions = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
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

  useEffect(() => {
    console.log('fetching data');
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
    console.log('data fetched setting states');

    if (Object.keys(venues).length !== 0) {
      setIsolate(venues.data.isolate);
      setMonitor(venues.data.monitor);
    }
  }, [venues]);

  // TODO: add dynamic centering and zoom of map.
  // useEffect(() => {
  // }, [isolate]);

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
    console.log(e.pageX, e.pageY);
    const pin = e.target;
    const dataType = pin.dataset.type;
    const { index } = pin.dataset;
    if (!pin) {
      console.log('algo salio mal');
    } else {
      console.log(getData(dataType, index));
      setShowSnapshot(true);
      setVenueSelected(getData(dataType, index));
    }
  };
  const toggleSnapshot = () => {
    setShowSnapshot((state) => !state);
  };

  const toggleData = (el) => {
    const target = el.target.value;
    console.log(target);

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
            <div>dataset date: {venues.date}</div>
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
            </GoogleMapReact>
            <Snapshot
              toggleSnapshot={toggleSnapshot}
              isOpen={showSnapshot}
              info={venueSelected}
            />
          </MapBox>
        </MapWrapper>
        <VenuesWrapper>
          {Object.keys(venues).length !== 0 && (
            <>
              <ListOfVenues>
                <h3>
                  <GrLocationPin />
                  Isolate
                </h3>
                {isolate.length > 0 &&
                  isolate.map((venue, i) => (
                    <div key={`isolate${i}`}>{venue.Venue}</div>
                  ))}
              </ListOfVenues>
              <ListOfVenues>
                <h3>
                  <AiOutlineMonitor />
                  Monitor
                </h3>
                {monitors.length > 0 &&
                  monitors.map((venue, i) => (
                    <div key={`monitors${i}`}>{venue.Venue}</div>
                  ))}
              </ListOfVenues>
            </>
          )}
        </VenuesWrapper>
      </Columns>
    </>
  );
}
