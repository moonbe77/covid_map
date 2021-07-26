import styled from 'styled-components';
import breakpoint from '../utils/breakpoints';

const CardStyled = styled.div`
  align-items: center;
  border-radius: 8px;
  box-shadow: 0 0 7px -3px gray;
  color: gray;
  display: flex;
  flex-wrap: nowrap;
  flex-direction: column;
  justify-content: center;
  padding: 0.5rem;
  position: relative;
  height: 100px;
  min-width: 160px;
  flex: 1;
  align-items: stretch;

  @media only screen and ${breakpoint.device.xs}{
    padding: 0.3rem;
  }
`;

const CardHeader = styled.div`
  flex: 1;
`;

const CardBody = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  flex: 2;
  font-weight: 700;
  text-align: center; 
`;

const CardFooter = styled.div`
  border-top: 1px solid gray;
  flex: 1;
  text-align: center;
`;

export default function MapCard({ children, title, footer }) {
  return (
    <CardStyled>
      <CardHeader>{title}</CardHeader>
      <CardBody>{children}</CardBody>
      <CardFooter>{footer}</CardFooter>
    </CardStyled>
  );
}
