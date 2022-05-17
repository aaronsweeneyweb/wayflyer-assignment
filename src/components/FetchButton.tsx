import React, { useState, useRef } from 'react';
import { Button, ButtonContents, ButtonLabel, Tooltip, LoadingSpinner } from './styles/FetchedButton.styled';

interface StateMessages {
  default: {
    label: string,
    tooltip: string,
  },
  loading: {
    label: string,
    tooltip: string,
  },
  error: {
    label: string,
    tooltip: string,
  }
}

interface Props {
  url: string,
  currentState?: string,
  maxDuration?: number,
  stateMessages: StateMessages,
  isDisabled?: boolean
}

const FetchButton: React.FC<Props> = ({ url, currentState, maxDuration, stateMessages, isDisabled }) => {
  const [ buttonState, setButtonState ] = useState<string>(currentState || 'default');

  let abortController: any = useRef(null);

  const fetchData = async () => {
    let timeout;

    try {
      abortController.current = new AbortController();
      setButtonState('loading');
  
      if (maxDuration) {
        timeout = setTimeout(() => {
          cancelRequest();
        }, maxDuration);
      }
  
      const response = await fetch(url, {
        signal: abortController.current.signal
      });
      const data = await response.json();
      console.log(data);
      setButtonState('default')
      resetTimeout(timeout);
    } catch {
      console.error('Failed')
      setButtonState('error');
      resetTimeout(timeout);
    }
  }

  const cancelRequest = () => {
    setButtonState('error');
    abortController.current.abort();
  }

  const resetTimeout = (timeout: any) => {
    clearTimeout(timeout);
  }

  return (
    <Button
      onClick={buttonState === 'loading' ? cancelRequest : fetchData}
      disabled={isDisabled}
      data-testid="fetch-button"
      buttonState={buttonState}
    >
      {
        buttonState === 'default' && 
        <>
          <ButtonLabel
            data-testid="fetch-button-label"
            disabled={isDisabled}
          >
            {stateMessages.default.label}
          </ButtonLabel>
          <Tooltip
            buttonState={buttonState}
            data-testid="tooltip-default"
          >
            <div>{stateMessages.default.tooltip}</div>
          </Tooltip>
        </>
      }
      {
        buttonState === 'loading' &&
        <>
          <ButtonContents>
            <ButtonLabel
              data-testid="fetch-button-label"
              disabled={isDisabled}
            >
              {stateMessages.loading.label}
            </ButtonLabel>
            <LoadingSpinner buttonState={buttonState} />
          </ButtonContents>
          <Tooltip
            buttonState={buttonState}
            data-testid="tooltip-default"
          >
            <div>{stateMessages.loading.tooltip}</div>
          </Tooltip>
        </>
      }
      {
        buttonState === 'error' &&
        <>
          <ButtonLabel
            data-testid="fetch-button-label"
            disabled={isDisabled}
          >
            {stateMessages.error.label}
          </ButtonLabel>
          <Tooltip
            buttonState={buttonState}
            disabled={isDisabled}
            data-testid="tooltip-error"
          >
            <div>{stateMessages.error.tooltip}</div>
          </Tooltip>
        </>
      }
    </Button>
  )
}

export default FetchButton;