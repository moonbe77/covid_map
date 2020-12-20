/* eslint-disable react/jsx-no-bind */
import { useEffect, useState } from 'react';
import Head from 'next/head';
import styled from 'styled-components';
import GoogleMapReact from 'google-map-react';
import { GrLocationPin } from 'react-icons/gr';
import { AiOutlineMonitor } from 'react-icons/ai';
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
  flex: 1;
  flex-direction: row;
`;

const ListOfVenues = styled.div`
  border: 1px solid red;
  display: flex;
  padding-left: 1rem;
  flex-direction: column;
  flex: 1;
`;
const MapWrapper = styled.div`
  width: 100%;
  height: 95vh;
  flex: 2;
`;

export default function MapHome() {
  const [venues, setVenues] = useState({});
  const [isolate, setIsolates] = useState([]);
  const [monitors, setMonitor] = useState([]);
  const [showSnapshot, setShowSnapshot] = useState(true);
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
      setIsolates(venues.data.isolate);
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
        <title>Map of covid recent cases</title>
      </Head>
      <ReturnArrow />
      <div>dataset date: {venues.date}</div>
      <Divider />
      <Columns>
        <MapWrapper>
          <GoogleMapReact
            bootstrapURLKeys={{
              key: process.env.NEXT_PUBLIC_MAPS_API_KEY,
            }}
            options={createMapOptions}
            // onClick={_onClick}
            // onChildClick={_onClickChild}
            // onChildMouseEnter={(obj) => {
            //   console.log(obj);
            // }}
            center={mapState.center}
            zoom={mapState.zoom}
          >
            {isolate.length > 0 &&
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
