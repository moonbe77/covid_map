import styled from 'styled-components';
import Link from 'next/link';

const Title = styled.h1`
  font-size: 50px;
  color: ${({ theme }) => theme.colors.primary};
`;

export default function Home() {
  return (
    <div>
      <Title>Covid MAP</Title>
      <Link href="/map">
        <a>Map of recent cases</a>
      </Link>
    </div>
  );
}
