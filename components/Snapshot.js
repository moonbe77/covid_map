import styled from 'styled-components';

const SnapshotStyled = styled.div`
  background-color: white;
  display: ${(props) => (props.isOpen ? 'block' : 'none')};
  height: 100%;
  right: 80px;
  max-height: 200px;
  max-width: 300px;
  overflow: hidden;
  padding: 10px;
  position: absolute;
  top: 100px;
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
  margin: 5px 0;
`;
const DateTag = styled.div``;
const TimeTag = styled.div``;

const Close = styled.div`
  position: absolute;
  right: 10px;
  cursor: pointer;
  color: gray;
  font-weight: 700;
`;

export default function Snapshot(props) {
  const { toggleSnapshot } = props;
  const { Venue, Address, Date, Suburb, Time } = props.info;
  return (
    <SnapshotStyled {...props}>
      <Close onClick={toggleSnapshot}>X</Close>
      <VenueTag>{Venue}</VenueTag>
      <SuburbTag>{Suburb}</SuburbTag>
      <AddressTag>{Address}</AddressTag>
      <DateTag>{Date}</DateTag>
      <TimeTag>{Time}</TimeTag>
    </SnapshotStyled>
  );
}
