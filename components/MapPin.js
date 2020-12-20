import styled from 'styled-components';
import { GrLocationPin } from 'react-icons/gr';
import { AiOutlineMonitor } from 'react-icons/ai';

const MapPinStyled = styled.div`
  border-radius: 50%;
  border: 1px solid red;
  font-size: 2rem;
  height: 30px;
  left: -15px;
  position: absolute;
  text-align: center;
  top: -30px;
  width: 30px;
`;

export default function MapPin({ text, typeOfPin }) {
  console.log(typeOfPin);
  return (
    <MapPinStyled>
      {typeOfPin === 'monitors' ? <AiOutlineMonitor /> : <GrLocationPin />}
    </MapPinStyled>
  );
}
