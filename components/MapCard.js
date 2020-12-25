import styled from 'styled-components';

const CardStyled = styled.div`
  align-items: center;
  border-radius: 8px;
  box-shadow: 0 0 7px -3px gray;
  color: gray;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 1rem;
  position: relative;
  height: 160px;
  min-width: 160px;
  flex: 1;

  @media (max-width: 680px) {
    padding: 10px;
    flex: 1;
  }
`;

const CardHeader = styled.div`
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
  text-align: center;
`;

export default function MapCard({ children, title }) {
  return (
    <CardStyled>
      <CardHeader>{title}</CardHeader>
      <CardBody>{children}</CardBody>
    </CardStyled>
  );
}
