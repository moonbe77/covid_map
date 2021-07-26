import { useRouter } from 'next/router'
import styled from 'styled-components';
import HeaderContent from '../Header';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  position:relative;
`
const Header = styled.header`
  /* height: 5vh; */
`
const Main = styled.main`
  background-color: white;
  display: block;
  flex: 1 0 auto;
`;

const Footer = styled.footer`
  background-color: black;
  color: #fff;
  /* height: 3vh; */
  /* margin-top: 2rem; */
  padding: 1rem 0;
  text-align: center;
`;

export default function Layout({ children }) {
  const router = useRouter()
  return (
    <Container>
      {router.pathname === "/map" && (
        <Header>
          <HeaderContent>
            <h3>COVID MAP</h3>
          </HeaderContent>
        </Header>
      )}
      <Main>{children}</Main>
      <Footer>
        <div>
          Website made by <a href="https://www.bmunz.dev/"> bMunz.dev</a>
        </div>
      </Footer>
    </Container>
  );
}
