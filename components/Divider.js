import styled from 'styled-components';
import PropTypes from 'prop-types';

const DividerStyled = styled.div`
  height: 5px;
  border-bottom: ${({ isFetching }) =>
    isFetching ? '2px solid red' : '2px solid gray'};
`;

function Divider({ isFetching }) {
  return <DividerStyled isFetching={isFetching} />;
}

export default Divider;
Divider.propTypes = {
  isFetching: PropTypes.bool,
};
