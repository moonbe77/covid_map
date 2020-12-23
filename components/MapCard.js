import styled from 'styled-components';

const CardStyled = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 2rem;
  justify-content: space-around;
  align-items: center;
  color: gray;
  box-shadow: 0 0 7px -3px gray;
  border-radius: 8px;
  min-width: 250px;
  height: 150px;
`;

const CardHeader = styled.div`
  display: block;
  font-size: 1.1rem;
  flex: 1;
`;
const CardBody = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: 1.2rem;
  flex: 2;
  font-weight: 700;
`;

export default function MapCard({ children, title }) {
  return (
    <CardStyled>
      <CardHeader>{title}</CardHeader>
      <CardBody>{children}</CardBody>
    </CardStyled>
  );
}
