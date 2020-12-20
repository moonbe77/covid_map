import styled from 'styled-components';
import Link from 'next/link';

const MainContainer = styled.main`
  display: block;
  max-width: 1280px;
  margin: 0 auto;
  padding: 10px;
  background-color: whitesmoke;
`;

const ReturnArrow = styled.div``;

export default function Layout({ children }) {
  return (
    <MainContainer>
      <ReturnArrow>
        <Link href="/">
          <a> return</a>
        </Link>
      </ReturnArrow>
      {children}
    </MainContainer>
  );
}
