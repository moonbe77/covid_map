import styled from 'styled-components';
import { GrLocationPin } from 'react-icons/gr';
import { AiOutlineMonitor } from 'react-icons/ai';

const MapPinStyled = styled.div`
  border-radius: 50%;
  border: 1px solid red;
  font-size: 2rem;
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
      {typeOfPin === 'monitors' ? <AiOutlineMonitor /> : <GrLocationPin />}
    </MapPinStyled>
  );
}
