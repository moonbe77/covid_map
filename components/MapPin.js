import styled from 'styled-components';
import PropTypes from 'prop-types';
import { MdLoupe, MdPersonPinCircle, MdAdjust } from 'react-icons/md';
import { MonitorPin, IsolatePin, UserPin } from './MapPinsComponents';

const MapPinStyled = styled.div`
  /* text-align: center; */
  color: #565454;
  cursor: pointer;
  font-size: 1rem;
  height: 18px;
  left: 50%;
  position: absolute;
  top: 50%;
  transform: 'translate(-50%, -50%)';
  width: 18px;

  svg {
    pointer-events: none;
  }

  :hover {
    font-size: 1.2rem;
    color: red;
  }
`;

export default function MapPin(props) {
  const {
    typeOfPin,
    onClick,
    'data-index': dataIndex,
    'data-type': dataType,
  } = props;

  return (
    <MapPinStyled
      onClick={onClick}
      data-index={dataIndex}
      data-type={dataType}
      typeOfPin={typeOfPin}
    >
      {typeOfPin === 'monitors' && <MonitorPin />}
      {typeOfPin === 'isolate' && <IsolatePin />}
      {typeOfPin === 'userLocation' && <UserPin />}
    </MapPinStyled>
  );
}

MapPin.defaultProps = {
  onClick: null,
};

MapPin.propTypes = {
  onClick: PropTypes.func,
};
