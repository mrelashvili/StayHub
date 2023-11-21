import styled, { css } from 'styled-components';

// const test = css`
//   text-align: center;
//   ${'background-color: red'}
// `;

const Heading = styled.h1`
  ${(props) =>
    props.as === 'h1' &&
    css`
      font-size: 1rem;
      font-weight: 600;
    `}

  ${(props) =>
    props.as === 'h2' &&
    css`
      font-size: 2rem;
      font-weight: 600;
      background-color: red;
    `}
`;

export default Heading;
