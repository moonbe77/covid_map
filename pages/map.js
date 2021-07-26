import { useEffect, useState } from 'react';
import { useQuery, useIsFetching } from 'react-query';
import Head from 'next/head';
import styled from 'styled-components';
import { MdAdjust } from 'react-icons/md';
import { measureGeoDistance } from '../utils/measureGeoDistance';
import { getVenuesType, addVenueType } from '../utils/dataParse';
import Divider from '../components/Divider';
import useGeolocation from '../hook/useGeolocation';
import MapCard from '../components/MapCard';
import MapComponent from '../components/MapComponent';
import breakpoint from '../utils/breakpoints';

const ResponsiveMapContainer = styled.section`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const MapWrapper = styled.div`
  box-shadow: 0 0 7px -4px gray;
  height: 80%;
  position: relative; 
`;

const MapOptions = styled.div`
  align-items: center;
  display: flex;
  flex-wrap: nowrap;
  flex-direction: row;
  justify-content: space-around;
  padding: 1em;
  gap: 1rem;
  height: 20%;
`;

export default function MapHome() {
  const [venues, setVenues] = useState([]);
  const [datasetDate, setDatasetDate] = useState(null);
  const [isDataUpToDate, setIsDataUpToDate] = useState(false);
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

  const { isSuccess, data: venuesData } = useQuery(
    'getVenues',
    () => fetcher(urlData.url),
    {
      enabled: !!urlData?.url, // !! converts in a boolean value the state of the urlData variable
    }
  );


  useEffect(() => {
    if (venuesData !== undefined) {
      setVenues(addVenueType(venuesData.data))
      setDatasetDate(venuesData.date)
    }
  }, [venuesData]);

  useEffect(() => {
    if (isSuccess && venuesData !== undefined) {
      const venuesDate = new Date(venuesData.date).getDate();
      const lastModified = new Date(urlData?.last_modified).getDate();
      const status = venuesDate === lastModified;
      setIsDataUpToDate(status);
    }
  }, [venuesData, urlData, isSuccess]);

  useEffect(() => {
    if (
      window.gMaps &&
      userLocation.error === null &&
      venues.length !== 0
    ) {
      console.log('closestVenus >>;)>>',);
      setClosestVenue(measureGeoDistance(userLocation, venues));
    }
  }, [userLocation, venues]);

  if (isLoading) return <div> Loading </div>;
  if (error) return <div> something went wrong!</div>


  return (
    <>
      <Head>
        <title>Map of covid locations on Sydney</title>
      </Head>
      <Divider isFetching={isFetching} />
      <ResponsiveMapContainer>
        <MapOptions>
          <MapCard
            title="Dataset Info"
            footer={isDataUpToDate ? 'updated' : 'NOT up to date'}
          >
            {datasetDate}
          </MapCard>
          <MapCard title="Closest Venue" footer="from your location">
            {closestVenue ? (
              <>
                <div>{`${closestVenue.D} km` || '-'}</div>
                <div>{closestVenue.Venue}</div>
              </>
            ) : (
              <div>calculating</div>
            )}
          </MapCard>
        </MapOptions>
        <MapWrapper>
          <MapComponent
            markers={venues}
            userLocation={userLocation}
          />
        </MapWrapper>
      </ResponsiveMapContainer>

    </>
  );
}
