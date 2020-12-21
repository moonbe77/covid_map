import styled from 'styled-components';
import Link from 'next/link';

const Hero = styled.div`
  text-align: center;
  height: 70vh;
`;
const Title = styled.h1`
  font-size: 50px;
  color: ${({ theme }) => theme.colors.primary};
`;
const Disclaimer = styled.div`
  box-shadow: 0 0 7px 0 gray;
  margin: auto;
  width: 80vw;
  padding: 1rem 3rem;
`;

export default function Home() {
  return (
    <>
      <Hero>
        <Title>Covid MAP</Title>
        <h3>
          This is a demo project showing the location of the recent cases
          detected in NSW
        </h3>
        <h4>
          The information showed here is taken from{' '}
          <a href="https://data.nsw.gov.au/data/dataset/nsw-covid-19-case-locations">
            https://data.nsw.gov.au/data/dataset/nsw-covid-19-case-locations
          </a>{' '}
          dataset.
        </h4>
        <Link href="/map">
          <a>Check the map</a>
        </Link>
      </Hero>
      <Disclaimer>
        <h2>DISCLAIMER</h2>
        <p>
          It is worth to mention that you should not take this information as
          oficial, this demo is only meant to be a personal project to improve
          my skills as web developer.
        </p>
      </Disclaimer>
      <main />
        
    </>
  );
}
