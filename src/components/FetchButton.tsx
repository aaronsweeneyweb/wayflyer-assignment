import React, { useState, useRef } from 'react';
import LoadingSpinner from './LoadingSpinner';
import classNames from 'classnames';

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
  maxDuration: number,
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

  const cancelRequest = () => {
    setIsLoading(false);
    setIsError(true);
    abortController.current.abort();
  }

  const resetTimeout = (timeout: any) => {
    setIsLoading(false);
    clearTimeout(timeout);
  }

  return (
    <button
      className={classNames({
        'fetch-button': true,
        'fetch-button--loading': isLoading,
        'fetch-button--error': isError,
        'fetch-button--disabled': isDisabled,
      })}
      onClick={isLoading ? cancelRequest : fetchData}
      disabled={isDisabled}
      data-testid="fetch-button"
    >
      {
        isLoading && !isError &&
        <div>
          <div className="fetch-button__contents">
            <div
              className="fetch-button__label"
              data-testid="fetch-button-label"
            >
              {stateMessages.loading.label}
            </div>
            <div><LoadingSpinner /></div>
          </div>
          <div
            data-testid="tooltip-loading"
            className="tooltip tooltip--loading"
          >
            {stateMessages.loading.tooltip}
          </div>
        </div>
      }
      {
        !isLoading && !isError &&
        <div>
          <div
            className="fetch-button__label"
            data-testid="fetch-button-label"
          >
            {stateMessages.default.label}
          </div>
          <div
            data-testid="tooltip-default"
            className="tooltip"
          >
            {stateMessages.default.tooltip}
          </div>
        </div>
      }
      {
        !isLoading && isError &&
        <div>
          <div
            className="fetch-button__label"
            data-testid="fetch-button-label"
          >
            {stateMessages.error.label}
          </div>
          <div
            data-testid="tooltip-error"
            className="tooltip tooltip--error"
          >
            {stateMessages.error.tooltip}
          </div>
        </div>
      }
    </button>
  )
}

export default FetchButton;