import React, { useState, useRef } from 'react';
import { Button, ButtonContents, Tooltip, LoadingSpinner } from './styles/FetchedButton.styled';

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
  maxDuration?: number,
  stateMessages: StateMessages,
  isDisabled?: boolean
}

const FetchButton: React.FC<Props> = ({ url, maxDuration, stateMessages, isDisabled }) => {
  const [ isLoading, setIsLoading ] = useState<boolean>(false);
  const [ isError, setIsError ] = useState<boolean>(false);

  let abortController: any = useRef(null);

  const fetchData = async () => {
    let timeout;

    try {
      abortController.current = new AbortController();
      setIsLoading(true);
      setIsError(false);
  
      if (maxDuration) {
        timeout = setTimeout(() => {
          cancelRequest();
        }, maxDuration);
      }
  
      const response = await fetch(url, {
        signal: abortController.current.signal
      });
      const data = await response.json();
      resetTimeout(timeout);

    } catch {
      console.error('Failed')
      resetTimeout(timeout);
    }
  }

  const getButtonState = () => {
    let buttonState = '';

    if (isLoading && !isError) {
      buttonState = 'loading';
    } else if (!isLoading && !isError) {
      buttonState = 'default';
    } else if (!isLoading && isError) {
      buttonState = 'error';
    }

    return buttonState;
  }

  const cancelRequest = () => {
    setIsLoading(false);
    setIsError(true);
    abortController.current.abort();
  }

  const resetTimeout = (timeout: any) => {
    setIsLoading(false);
    clearTimeout(timeout);
  }

  const buttonState = getButtonState();

  return (
    <Button
      onClick={isLoading ? cancelRequest : fetchData}
      disabled={isDisabled}
      data-testid="fetch-button"
      buttonState={buttonState}
    >
      {
        buttonState === 'default' && 
        <>
          <div data-testid="fetch-button-label">
            {stateMessages.default.label}
          </div>
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
            <div data-testid="fetch-button-label">
              {stateMessages.loading.label}
            </div>
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
          <div data-testid="fetch-button-label">
            {stateMessages.error.label}
          </div>
          <Tooltip
            buttonState={buttonState}
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