/* eslint-disable react/jsx-no-bind */
/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import GoogleMapReact from 'google-map-react';
import MapPin from './MapPin';
import Snapshot from './Snapshot';
import useGeolocation from '../hook/useGeolocation';

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
  overflow: hidden;
`;
const Loading = styled.div`
  width: 100px;
  margin: 6rem auto;
`;

export default function MapComponent({ markers, venuesTypeFilter }) {
  const [venueSelected, setVenueSelected] = useState({});
  const [markersOnMap, setMarkersOnMap] = useState([]);
  const [mapState, setMapState] = useState({
    center: [-33.79, 151.29],
    zoom: 12,
  });
  const [showSnapshot, setShowSnapshot] = useState(false);
  const userLocation = useGeolocation();

  const createMapOptions = function () {
    return {
      panControl: true,
      mapTypeControl: true,
      scrollwheel: true,
      zoom: mapState.zoom,
      // center: mapState.center,
    };
  };

  const handleApiLoaded = (map, maps) => {
    window.gMaps = maps;
  };

  const toggleSnapshot = () => {
    setShowSnapshot((state) => !state);
  };

  useEffect(() => {
    // FIXME: make this to work with an array of filters

    const venuesFiltered = [];
    venuesTypeFilter.forEach((element) => {
      const filtered = markers.filter((ven) => ven.venueType === element);
      console.log(element);
      venuesFiltered.push(...filtered);
    });

    setMarkersOnMap(venuesFiltered);
  }, [markers, venuesTypeFilter]);

  useEffect(() => {
    if (userLocation.latitude !== null) {
      setMapState((prev) => ({
        ...prev,
        center: [userLocation.latitude, userLocation.longitude],
      }));
    }
  }, []);

  if (markers?.length === 0) {
    return (
      <MapWrapper>
        <Loading>loading...</Loading>
      </MapWrapper>
    );
  }
  const handlePinClick = (e) => {
    const pin = e.target;
    const dataType = pin.dataset.type;
    const { index } = pin.dataset;

    if (!pin) {
      console.log('algo salio mal');
    } else {
      // console.log(getData(dataType, index));
      setVenueSelected(markers[index]);
      setShowSnapshot(true);
    }
  };

  return (
    <MapWrapper>
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
        >
          {markersOnMap.length > 0 &&
            markersOnMap.map((venue, i) => (
              <MapPin
                key={`marker-${i}`}
                lat={venue.Lat.split(',')[0]}
                lng={venue.Lon.split(',')[0]}
                data-index={i}
                data-type={venue.venueType}
                typeOfPin={venue.venueType} // get type from list
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
  );
}

Map.propTypes = {
  markers: PropTypes.array,
  userLocation: PropTypes.object,
  venuesTypeFilter: PropTypes.array,
};
