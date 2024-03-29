import styled from 'styled-components';
import PropTypes from 'prop-types';
import ReturnArrow from './ReturnArrow';

const HeaderStyled = styled.header`
  display: flex;
  /* justify-content: center; */
  text-align: center;
  align-items: center;
  height:50px;
`;

const Box = styled.div`
`;

const LeftBox = styled(Box)`
  flex: 1;
`;
const CenterBox = styled(Box)`
  flex: 6;
`;
const RightBox = styled(Box)`
  flex: 1;
`;

export default function HeaderContent({ children }) {
  return (
    <>
      <HeaderStyled>
        <LeftBox>
          <ReturnArrow />
        </LeftBox>
        <CenterBox>{children}</CenterBox>
        <RightBox><a href="https://www.bmunz.dev/"> bMunz.dev</a></RightBox>
      </HeaderStyled>
    </>
  );
}

HeaderContent.propTypes = {
  children: PropTypes.node,
};
