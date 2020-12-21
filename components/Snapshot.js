import styled from 'styled-components';

const SnapshotStyled = styled.div`
  background-color: white;
  display: ${(props) => (props.isOpen ? 'block' : 'none')};
  height: 100%;
  right: 80px;
  min-height: 200px;
  max-width: 350px;
  overflow: hidden;
  padding: 10px;
  position: absolute;
  top: 10px;
  width: 100%;
  box-shadow: 0 0 7px 0px #cdcbcb;
  border-radius: 8px;
`;
const VenueTag = styled.div`
  font-size: 1.2rem;
  font-weight: 700;
`;

const SuburbTag = styled.div`
  font-size: 1.1rem;
  font-weight: 700;
`;
const AddressTag = styled.div`
  color: gray;
`;
const DateTag = styled.div`
  margin-top: 1rem;
`;
const TimeTag = styled.div``;

const Close = styled.div`
  position: absolute;
  right: 10px;
  cursor: pointer;
  color: gray;
  font-weight: 700;
`;
const AlertTitle = styled.div`
  color: red;
  font-size: 1.2em;
  margin-top: 20px;
`;
const AlertAdvice = styled.div`
  margin-top: 15px;
`;

export default function Snapshot(props) {
  const { toggleSnapshot } = props;
  const {
    Venue,
    Alert,
    Address,
    Date,
    Suburb,
    Time,
    HealthAdviceHTML,
  } = props.info;
  return (
    <SnapshotStyled {...props}>
      <Close onClick={toggleSnapshot}>X</Close>
      <VenueTag>{Venue}</VenueTag>
      <SuburbTag>{Suburb}</SuburbTag>
      <AddressTag>{Address}</AddressTag>
      <AlertTitle>{Alert}</AlertTitle>
      <DateTag>{Date}</DateTag>
      <TimeTag>{Time}</TimeTag>
      <AlertAdvice
        dangerouslySetInnerHTML={{
          __html: HealthAdviceHTML,
        }}
      />
    </SnapshotStyled>
  );
}
