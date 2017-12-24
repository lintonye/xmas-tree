import React from 'react';
import styled, { keyframes }from 'styled-components';

const rotate = keyframes`
  0%    { transform: rotate(0deg); }
  100%  { transform: rotate(360deg); }
`

export default styled.div`
  margin: 20px;
  height: 28px;
  width: 28px;
  animation: rotate 0.8s infinite linear;
  border: 8px solid #fff;
  border-right-color: transparent;
  border-radius: 50%;
`
