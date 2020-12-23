import styled from 'styled-components';
import PropTypes from 'prop-types';

const SnapshotStyled = styled.div`
  background-color: white;
  display: ${(props) => (props.isOpen ? 'block' : 'none')};
  right: 80px;
  max-width: 450px;
  overflow: hidden;
  padding: 20px 10px;
  position: absolute;
  top: 10px;
  width: 100%;
  box-shadow: 0 0 7px 0px #cdcbcb;
  border-radius: 8px;

  @media (max-width: 680px) {
    position: absolute;
    max-width: none;
    top: 50%;
    width: calc(100vw - 50px);
    left: 50%;
    transform: translate(-50%, -50%);
  }
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
  font-size: 1.3rem;
  font-weight: 700;
  :hover {
    color: black;
  }
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

  if (props.info === null) {
    return (
      <SnapshotStyled {...props}>
        <Close onClick={toggleSnapshot}>X</Close>
        <h3>DATA NOT RECEIVED</h3>
      </SnapshotStyled>
    );
  }
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

Snapshot.defaultProps = {
  info: null,
};

Snapshot.propTypes = {
  info: PropTypes.object,
  // Alert: PropTypes.string,
  // Address: PropTypes.string,
  // Date: PropTypes.string,
  // Suburb: PropTypes.string,
  // Time: PropTypes.string,
  // HealthAdviceHTML: PropTypes.string,
};
