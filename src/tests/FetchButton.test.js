import { render, fireEvent, screen } from '@testing-library/react';
import FetchButton from '../components/FetchButton';
import { wait } from '@testing-library/user-event/dist/utils';

const urlFiveSeconds = 'https://httpbin.org/delay/5';
const urlOneSecond = 'https://httpbin.org/delay/1';

const maxDurationTwoSeconds = 2000;
const maxDurationOneSecond = 1000;

const stateMessages = {
  default: {
    label: 'Launch Rocket',
    tooltip: 'Ignites the fuel',
  },
  loading: {
    label: 'Launching',
    tooltip: 'Cancel launch',
  },
  error: {
    label: 'Launch Rocket',
    tooltip: 'Ignition error',
  }
};

describe('FetchButton Component', () => {

  describe('Default state', () => {

    it('renders the button in the default state', () => {
      render(
        <FetchButton
          url={urlFiveSeconds}
          maxDuration={maxDurationOneSecond}
          stateMessages={stateMessages}
        />
      );
  
      const buttonLabel = screen.getByTestId('fetch-button-label');
  
      expect(buttonLabel).toHaveTextContent('Launch Rocket');
    });
  
    it('shows the default state tooltip on hover', async () => {
      render(
        <FetchButton
          url={urlFiveSeconds}
          maxDuration={maxDurationOneSecond}
          stateMessages={stateMessages}
        />
      );
  
      const button = screen.getByTestId('fetch-button');
      fireEvent.mouseOver(button);
  
      await wait(() => {
        const tooltip = screen.getByTestId('tooltip-default');
        expect(tooltip).toBeInTheDocument();
        expect(tooltip).toHaveTextContent('Ignites the fuel');
      });
    });

    it('goes back to default state after a successful fetch', async () => {
      render(
        <FetchButton
          url={urlOneSecond}
          maxDuration={maxDurationTwoSeconds}
          stateMessages={stateMessages}
        />
      );
  
      const button = screen.getByTestId('fetch-button');
      const buttonLabel = screen.getByTestId('fetch-button-label');

      fireEvent.click(button);
  
      await wait(() => {
        expect(buttonLabel).toHaveTextContent('Launching');
      });

      await wait(() => {
        expect(buttonLabel).toHaveTextContent('Launch Rocket');
      });
    });

    it('is disabled when the isDisabled prop is true', async () => {
      render(
        <FetchButton
          url={urlOneSecond}
          maxDuration={maxDurationTwoSeconds}
          stateMessages={stateMessages}
          isDisabled={true}
        />
      );
  
      const button = screen.getByTestId('fetch-button');

      expect(button).toBeDisabled()
    });

    it('does not show the tooltip on hover when disabled', async () => {
      render(
        <FetchButton
          url={urlOneSecond}
          maxDuration={maxDurationTwoSeconds}
          stateMessages={stateMessages}
          isDisabled={true}
        />
      );
  
      const button = screen.getByTestId('fetch-button');
      fireEvent.mouseOver(button);
      const tooltip = screen.getByTestId('tooltip-default');
      
      expect(button).toHaveStyle('pointer-events: none');
      expect(tooltip).toHaveStyle('display: none')
    });

  });

  describe('Loading state', () => {

    it('renders the loading state when the GET request is made (button is clicked)', async () => {
      render(
        <FetchButton
          url={urlFiveSeconds}
          maxDuration={maxDurationOneSecond}
          stateMessages={stateMessages}
        />
      );
  
      const button = screen.getByTestId('fetch-button');
      const buttonLabel = screen.getByTestId('fetch-button-label');
      
      fireEvent.click(button);
  
      await wait(() => {
        expect(buttonLabel).toHaveTextContent('Launching');
      })
    });
  
    it('shows the loading state tooltip hover', async () => {
      render(
        <FetchButton
          url={urlFiveSeconds}
          maxDuration={maxDurationOneSecond}
          stateMessages={stateMessages}
        />
      );
  
      const button = screen.getByTestId('fetch-button');
      const buttonLabel = screen.getByTestId('fetch-button-label');

      fireEvent.click(button);
      fireEvent.mouseOver(button);

      await wait(() => {
        const tooltip = screen.getByTestId('tooltip-loading');
        expect(buttonLabel).toHaveTextContent('Launching');
        expect(tooltip).toBeInTheDocument();
        expect(tooltip).toHaveTextContent('Cancel launch');
      });
    });

  });

  describe('Error state', () => {

    it('renders the error state when the API request is cancelled (button is clicked during loading)', async () => {
      render(
        <FetchButton
          url={urlFiveSeconds}
          maxDuration={maxDurationOneSecond}
          stateMessages={stateMessages}
        />
      );
  
      const button = screen.getByTestId('fetch-button');
      const buttonLabel = screen.getByTestId('fetch-button-label');
  
      fireEvent.click(button);
      fireEvent.click(button);
  
      const tooltip = screen.getByTestId('tooltip-error');
      expect(buttonLabel).toHaveTextContent('Launch Rocket');
      expect(tooltip).toBeInTheDocument();
      expect(tooltip).toHaveTextContent('Ignition error');
    });
  
    it('renders the error state when the request continues beyond the max duration', async () => {
      render(
        <FetchButton
          url={urlFiveSeconds}
          maxDuration={maxDurationOneSecond}
          stateMessages={stateMessages}
        />
      );
  
      const button = screen.getByTestId('fetch-button');
      const buttonLabel = screen.getByTestId('fetch-button-label');

      fireEvent.click(button);
  
      await wait(() => {
        expect(buttonLabel).toHaveTextContent('Launch Rocket');
      });
    });

  });

});