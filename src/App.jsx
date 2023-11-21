import GlobalStyles from './styles/GlobalStyles';
import Button from './ui/Button';
import Heading from './ui/Heading';
import Row from './ui/Row';

const App = () => {
  return (
    <>
      <GlobalStyles />
      <Row type="horizontal">
        <Heading as="h3">The BAD</Heading>
        <div>
          <input type="text" />
        </div>
      </Row>

      <div>
        <Button>Check in</Button>

        <Button variation="secondary">Check out</Button>
      </div>

      <Row>
        <Heading as="h3">The BAD</Heading>
        <div>
          <input type="text" />
        </div>
      </Row>
    </>
  );
};

export default App;
