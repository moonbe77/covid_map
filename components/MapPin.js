import styled from 'styled-components';
import PropTypes from 'prop-types';
import {
  MonitorPin,
  IsolatePin,
  UserPin,
  DefaultPin,
} from './MapPinsComponents';

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
      {typeOfPin === 'monitor' && <MonitorPin />}
      {typeOfPin === 'isolate' && <IsolatePin />}
      {typeOfPin === 'userLocation' && <UserPin />}
      {typeOfPin !== 'monitor' ||
        typeOfPin !== 'isolate' ||
        (typeOfPin !== 'userLocation' && <DefaultPin />)}
    </MapPinStyled>
  );
}

MapPin.defaultProps = {
  onClick: null,
};

MapPin.propTypes = {
  typeOfPin: PropTypes.string,
  'data-index': PropTypes.number,
  'data-type': PropTypes.string,
  onClick: PropTypes.func,
};
