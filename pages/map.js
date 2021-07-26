import { useEffect, useState } from 'react';
import { useQuery, useIsFetching } from 'react-query';
import Head from 'next/head';
import styled from 'styled-components';
import { MdAdjust } from 'react-icons/md';
import { measureGeoDistance } from '../utils/measureGeoDistance';
import { getVenuesType } from '../utils/dataParsing';
import Divider from '../components/Divider';
import useGeolocation from '../hook/useGeolocation';
import MapCard from '../components/MapCard';
import MapComponent from '../components/MapComponent';
import breakpoint from '../utils/breakpoints';

// import VenuesTable from '../components/VenuesTable';


const MapWrapper = styled.div`
  box-shadow: 0 0 7px -4px gray;
  height: 80%;
  position: relative;

    @media only screen and ${breakpoint.device.xs}{
    height: 50%;
    }
    /* @media only screen and ${breakpoint.device.sm}{
        display: flex;
    }
    @media only screen and ${breakpoint.device.lg}{
        display: flex;
    } */
`;

const MapOptions = styled.div`
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  justify-content: space-around;
  padding: 1em;
  gap: 1rem;
  height: 20%;

    @media only screen and ${breakpoint.device.xs}{
      height: 50%;
    }
`;

export default function MapHome() {
  const [venues, setVenues] = useState([]);
  const [venuesTypes, setVenuesTypes] = useState([]);
  const [isDataUpToDate, setIsDataUpToDate] = useState(false);
  const [venuesTypeFilter, setVenuesTypeFilter] = useState([]);
  const [closestVenue, setClosestVenue] = useState(null); // distance to closest location
  const userLocation = useGeolocation();
  const isFetchingData = useIsFetching();

  const fetcher = async (url) => {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed fetching data');
    }

    return response.json();
  };

  const { isLoading, data: urlData, error, isFetching } = useQuery(
    'getDatasetUrl',
    async () => {
      const data = await fetcher(
        'https://data.nsw.gov.au/data/api/3/action/package_show?id=0a52e6c1-bc0b-48af-8b45-d791a6d8e289',
        {
          refetchOnMount: true,
        }
      );
      return data?.result?.resources[1];
    }
  );

  const { isIdle, data: venuesData } = useQuery(
    'getVenues',
    () => fetcher(urlData.url),
    {
      enabled: !!urlData?.url, // !! converts in a boolean value the state of the urlData variable
    }
  );

  useEffect(() => {
    const venuesDate = new Date(venuesData?.date).getDate();
    const lastModified = new Date(urlData?.last_modified).getDate();
    const status = venuesDate === lastModified;
    setIsDataUpToDate(status);
  }, [venuesData, urlData]);

  useEffect(() => {
    // if (last_modified) console.log(last_modified);

    if (!isIdle && venuesData) {
      const venuesParsed = [];

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
  }, [userLocation, venues]);

  const filterData = (el) => {
    const filter = el.target.value;
    if (venuesTypeFilter.includes(filter)) {
      setVenuesTypeFilter(venuesTypeFilter.filter((e) => e !== filter));
    } else {
      setVenuesTypeFilter((prevState) => [...prevState, filter]);
    }
  };

  if (isLoading) return <div> Loading </div>;
  if (error) return <div> something went wrong!</div>

  return (
    <>
      <Head>
        <title>Map of covid locations on Sydney</title>
      </Head>
      <Divider isFetching={isFetching} />
      <MapWrapper>
        <MapOptions>
          <MapCard
            title="Dataset Info"
            footer={isDataUpToDate ? 'updated' : 'NOT up to date'}
          >
            {venues.date}
          </MapCard>
          <MapCard title="Closest Venue" footer="from your location">
            {closestVenue ? (
              <>
                <div>{`${closestVenue.D} km` || '-'}</div>
                <div>{closestVenue.Venue}</div>
              </>
            ) : (
              <div>LOADING</div>
            )}
          </MapCard>
          <MapCard
            title="Options"
            footer={isFetchingData ? 'updating' : 'updated'}
          >
            {venuesTypes.map((type) => (
              <label key={type} htmlFor={type}>
                <input
                  type="checkbox"
                  id={type}
                  name={type}
                  value={type}
                  onChange={filterData}
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
        {/* {venues && <VenuesTable venues={venues} />} */}
      </MapWrapper>

    </>
  );
}
