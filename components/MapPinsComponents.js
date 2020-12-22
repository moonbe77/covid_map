import styled from 'styled-components';
import { MdLoupe, MdPersonPinCircle, MdAdjust } from 'react-icons/md';

const MasterPin = styled.div`
  pointer-events: none;
  border: 2px solid red;
`;
const Monitor = styled(MasterPin)`
  color: blue;
`;
const Isolate = styled(MasterPin)`
  color: red;
`;
const UserLocation = styled(MasterPin)`
  color: gray;
`;

export const MonitorPin = () => (
  <Monitor>
    <MdAdjust />
  </Monitor>
);

export const IsolatePin = () => (
  <Isolate>
    <MdLoupe />
  </Isolate>
);

export const UserPin = () => (
  <UserLocation>
    <MdPersonPinCircle />
  </UserLocation>
);
