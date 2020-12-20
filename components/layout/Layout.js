import styled from 'styled-components';

const MainContainer = styled.main`
  display: block;
  margin: 0 auto;
  padding: 10px;
  background-color: whitesmoke;
`;

export default function Layout({ children }) {
  return <MainContainer>{children}</MainContainer>;
}
