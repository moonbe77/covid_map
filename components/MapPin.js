import styled from 'styled-components';
import { GrLocationPin } from 'react-icons/gr';
import { AiOutlineMonitor } from 'react-icons/ai';
import { ImLocation2 } from 'react-icons/im';

const MapPinStyled = styled.div`
  font-size: 1rem;
  color: gray;
  height: 30px;
  position: absolute;
  text-align: center;
  width: 30px;
  top: -15px;
  left: -15px;
  transform: 'translate(-50%, -50%)';
  cursor: pointer;

  svg {
    pointer-events: none;
  }

  :hover {
    /* border-radius: 50%; */
    /* border: 1px solid red; */
    font-size: 1.2rem;
    color: red;
  }
`;

export default function MapPin(props) {
  const {
    text,
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
      {typeOfPin === 'monitors' && <AiOutlineMonitor />}
      {typeOfPin === 'isolate' && <GrLocationPin />}
      {typeOfPin === 'userLocation' && <ImLocation2 />}
    </MapPinStyled>
  );
}
