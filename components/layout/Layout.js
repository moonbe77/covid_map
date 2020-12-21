import styled from 'styled-components';

const MainContainer = styled.main`
  display: block;
  margin: 0 auto;
  padding: 10px;
  background-color: whitesmoke;
`;
const Footer = styled.footer`
  text-align: center;
`;
export default function Layout({ children }) {
  return (
    <MainContainer>
      <section>{children}</section>
      <Footer>
        <p>Website made with love by BMDev</p>
      </Footer>
    </MainContainer>
  );
}
