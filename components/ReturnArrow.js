import styled from 'styled-components';
import Link from 'next/link';
import { BsArrowLeft } from 'react-icons/bs';

const ReturnArrowStyled = styled.div`
  font-size: 2.5rem;
  display: inline-block;
`;

export default function ReturnArrow() {
  return (
    <>
      <ReturnArrowStyled>
        <Link href="/">
          <a>
            <BsArrowLeft />
          </a>
        </Link>
      </ReturnArrowStyled>
    </>
  );
}
