import { useEffect, useState } from 'react';
import styled from 'styled-components';

export default function MapHome() {
  const [venues, setVenues] = useState();

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

  console.log(venues);
  return (
    <div>
      <h1>map data</h1>
    </div>
  );
}
