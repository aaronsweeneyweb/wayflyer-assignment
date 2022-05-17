import styled, { css } from 'styled-components';

const colorDefault = '#000000';
const colorLoading = '#f57901';
const colorError = '#f40002';
const colorDisabled = '#4a4a4a';
const colorWhite = '#ffffff';

const handleColor = buttonState => {
  switch (buttonState) {
    case 'loading':
      return colorLoading;
    case 'error':
      return colorError;
    default:
      return colorDefault;
  }
}

export const Tooltip = styled.div`
  display: ${({ buttonState }) => buttonState === 'error' ? 'block' : 'none'};
  position: absolute;
  top: 60px;
  left: -3px;
  width: calc(100% + 6px);
  height: 40px;
  z-index: 1;
  color: ${colorWhite};
  background-color: ${({ buttonState }) => handleColor(buttonState)};
  font-weight: 600;
  padding: 10px 0;
  box-sizing: border-box;

  &:after {
    content: "";
    position: absolute;
    bottom: 100%;
    left: 50%;
    margin-left: -15px;
    border-width: 15px;
    border-style: solid;
    border-color: transparent transparent ${({ buttonState }) => handleColor(buttonState)} transparent;
  }
`

export const Button = styled.button`
  display: inline-block;
  min-width: 185px;
  position: relative;
  margin-bottom: 10px;
  padding: 2px 14px;
  height: 55px;
  cursor: pointer;
  font-size: 16px;
  background: ${colorWhite};
  border: 3px solid ${({ buttonState }) => handleColor(buttonState)};
  color: ${({ buttonState }) => handleColor(buttonState)};
  ${({ disabled }) => disabled && css`
    pointer-events: none;
    color: ${colorDisabled};
  `}

  &:hover > ${Tooltip} {
    display: block;
  }
`

export const ButtonContents = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-around;
`

export const LoadingSpinner = styled.div`
  @keyframes spinner {
    to {transform: rotate(360deg);}
  }
  
  &:before {
    content: '';
    box-sizing: border-box;
    position: absolute;
    width: 28px;
    height: 28px;
    margin-top: -15px;
    margin-left: -20px;
    border-radius: 50%;
    border: 1px solid transparent;
    border-top-color: ${({ buttonState }) => handleColor(buttonState)};
    border-left-color: ${({ buttonState }) => handleColor(buttonState)};
    animation: spinner .6s linear infinite;
  }
`