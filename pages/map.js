import { useEffect, useState } from 'react';
import styled from 'styled-components';
import GoogleMapReact from 'google-map-react';
import { GrLocationPin } from 'react-icons/gr';
import { AiOutlineMonitor } from 'react-icons/ai';
import MapPin from '../components/MapPin';
import ReturnArrow from '../components/ReturnArrow';
import Divider from '../components/Divider';

const VenuesWrapper = styled.div`
  display: flex;
  flex-direction: row;
  margin: 0 25%;
`;
const ListOfVenues = styled.div`
  /* border: 1px solid red; */
  display: flex;
  flex-direction: column;
  flex: 1;
`;
const Map = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const MapWrapper = styled.div`
  width: 100%;
  height: 500px;
`;

export default function MapHome() {
  const [venues, setVenues] = useState({});
  const [isolate, setIsolates] = useState([]);
  const [monitors, setMonitor] = useState([]);
  const [mapState, setMapState] = useState({
    center: [-33.63, 151.32],
    zoom: 8,
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

  return (
    <div>
      <ReturnArrow />
      <Divider />
      <h1>Venues data</h1>
      <Map>
        <MapWrapper>
          <GoogleMapReact
            bootstrapURLKeys={{
              key: process.env.NEXT_PUBLIC_MAPS_API_KEY,
            }}
            center={mapState.center}
            zoom={mapState.zoom}
          >
            {isolate.length > 0 &&
              isolate.map((venue, i) => (
                <MapPin
                  key={`isolate${i}`}
                  lat={venue.Lat}
                  lng={venue.Lon}
                  // text={venue.Venue}
                  typeOfPin="isolate"
                />
              ))}
            {monitors.length > 0 &&
              monitors.map((venue, i) => (
                <MapPin
                  key={`isolate${i}`}
                  lat={venue.Lat}
                  lng={venue.Lon}
                  // text={venue.Venue}
                  typeOfPin="monitors"
                />
              ))}
          </GoogleMapReact>
        </MapWrapper>
      </Map>
      {Object.keys(venues).length !== 0 && (
        <VenuesWrapper>
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
        </VenuesWrapper>
      )}
    </div>
  );
}
