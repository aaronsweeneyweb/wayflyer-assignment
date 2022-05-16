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

describe('Button Component', () => {

  describe('Default state', () => {

    it('renders the button in the default state', () => {
      render(
        <FetchButton
          url={urlFiveSeconds}
          maxDuration={maxDurationOneSecond}
          stateMessages={stateMessages}
        />
      );
  
      const button = screen.getByTestId('button');
  
      expect(button).toHaveTextContent('Launch Rocket');
    });
  
    it('shows the default state tooltip on hover', () => {
      render(
        <FetchButton
          url={urlFiveSeconds}
          maxDuration={maxDurationOneSecond}
          stateMessages={stateMessages}
        />
      );
  
      const tooltip = screen.getByTestId('tooltip');
      fireEvent.mouseOver(tooltip);
  
      expect(tooltip).toBeInTheDocument();
      expect(tooltip).toHaveTextContent('Ignites the fuel');
    });

    it('goes back to default state after a successful fetch', async () => {
      render(
        <FetchButton
          url={urlOneSecond}
          maxDuration={maxDurationTwoSeconds}
          stateMessages={stateMessages}
        />
      );
  
      const button = screen.getByTestId('button');
      fireEvent.click(button);
  
      expect(button).toHaveTextContent('Launching');
      await wait(() => {
        expect(button).toHaveTextContent('Launch Rocket');
      });
    });
  
    it('is disabled when the isDisabled prop is true', () => {
      render(
        <FetchButton
          url={urlOneSecond}
          maxDuration={maxDurationTwoSeconds}
          stateMessages={stateMessages}
          isDisabled={true}
        />
      );
  
      const button = screen.getByTestId('button');
  
      expect(button).toBeDisabled()
    });

  });

  describe('Loading state', () => {

    it('renders the loading state when the GET request is made (button is clicked)', () => {
      render(
        <FetchButton
          url={urlFiveSeconds}
          maxDuration={maxDurationOneSecond}
          stateMessages={stateMessages}
        />
      );
  
      const button = screen.getByTestId('button');
      fireEvent.click(button);
  
      expect(button).toHaveTextContent('Launching');
    });
  
    it('shows the loading state tooltip hover', () => {
      render(
        <FetchButton
          url={urlFiveSeconds}
          maxDuration={maxDurationOneSecond}
          stateMessages={stateMessages}
        />
      );
  
      const button = screen.getByTestId('button');
      const tooltip = screen.getByTestId('tooltip');
      fireEvent.click(button);
      fireEvent.mouseOver(tooltip);
  
      expect(button).toHaveTextContent('Launching');
      expect(tooltip).toBeInTheDocument();
      expect(tooltip).toHaveTextContent('Cancel launch');
    });

  });

  describe('Error state', () => {

    it('renders the error state when the API request is cancelled (button is clicked during loading)', () => {
      render(
        <FetchButton
          url={urlFiveSeconds}
          maxDuration={maxDurationOneSecond}
          stateMessages={stateMessages}
        />
      );
  
      const button = screen.getByTestId('button');
      const tooltip = screen.getByTestId('tooltip');
  
      fireEvent.click(button);
      fireEvent.click(button);
  
      expect(button).toHaveTextContent('Launch rocket');
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
  
      const button = screen.getByTestId('button');
      fireEvent.click(button);
  
      await wait(() => {
        expect(button).toHaveTextContent('Launch rocket');
      });
    });

  });

});