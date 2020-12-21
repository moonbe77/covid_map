import styled from 'styled-components';
import Link from 'next/link';

const Header = styled.header`
  position: relative;
  /* border: 1px solid red; */
`;
const Hero = styled.div`
  text-align: center;
  /* height: 50vh; */
  display: block;
  margin-bottom: 2rem;
`;
const Title = styled.h1`
  font-size: 50px;
  color: ${({ theme }) => theme.colors.primary};
`;
const Main = styled.main`
  display: block;
  position: relative;
  /* border: 1px solid red; */
`;
const Disclaimer = styled.div`
  box-shadow: 0 0 7px 0 gray;
  margin: auto;
  width: 80vw;
  padding: 1rem 3rem;
`;
const Button = styled.button`
  background-color: ${(props) => props.theme.colors.primary};
  border-radius: 8px;
  border: none;
  color: white;
  cursor: pointer;
  padding: 10px;
  text-transform: uppercase;

  :hover,
  :focus {
    background-color: ${(props) => props.theme.colors.primaryDarker};
    border: none;
  }
`;

export default function Home() {
  return (
    <>
      <Header>
        <Hero>
          <Title>Covid MAP</Title>
          <h3>
            This is a demo project showing the location of the recent cases
            detected in NSW
          </h3>
          <h4>
            The information utilized here is taken from{' '}
            <a href="https://data.nsw.gov.au/data/dataset/nsw-covid-19-case-locations">
              https://data.nsw.gov.au/data/dataset/nsw-covid-19-case-locations
            </a>{' '}
            dataset.
          </h4>
          <Link href="/map">
            <Button>Check the map</Button>
          </Link>
        </Hero>
      </Header>
      <Main>
        <Disclaimer>
          <h2>DISCLAIMER</h2>
          <p>
            You should not take this information as oficial, the dataset is from
            an oficial source and it is NOT modified. This demo is only meant to
            show that information in a more clear way. This is a personal
            project to practice and improve my skills as web developer.
          </p>
        </Disclaimer>
      </Main>
    </>
  );
}
