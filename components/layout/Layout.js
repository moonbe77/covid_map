import styled from 'styled-components';

const MainContainer = styled.main`
  display: block;
  background-color: white;
  min-height: calc(100vh - 50px);
`;
const Footer = styled.footer`
  padding: 1rem 0;
  margin-top: 2rem;
  background-color: black;
  color: #fff;
  text-align: center;
`;
export default function Layout({ children }) {
  return (
    <>
      <MainContainer>{children}</MainContainer>
      <Footer>
        <p>
          Website made by <a href="https://www.bmunz.dev/"> bMunz.dev</a>
        </p>
      </Footer>
    </>
  );
}
