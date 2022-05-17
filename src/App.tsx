import { Container } from './components/styles/Container.styled';
import FetchButton from "./components/FetchButton";

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
  },
};

function App() {
  return (
    <Container>
      <FetchButton
        url={'https://httpbin.org/delay/3'}
        maxDuration={4000}
        stateMessages={stateMessages}
        isDisabled={false}
      />
    </Container>
  );
}

export default App;
