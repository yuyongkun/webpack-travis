const React = require('react');
const common = require('../assets/js/common');
const { a } = require('./tree-shaking');

class Search extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      Text: null,
    };
  }

  componentDidMount() {
    common();
  }

  tapText() {
    import('../test.js').then((result) => {
      this.setState({
        Text: result.default,
      });
    });
  }

  render() {
    const funA = a();
    const { Text } = this.state;
    return (
      <div>
        <h1>Search Page</h1>
        <img src={require('../assets/images/3.png')} alt="个人背景" />
        <br />
        <div>
          <button onClick={this.tapText.bind(this)} type="button">动态import加载</button>
        </div>
        {funA}
        <br />
        {Text ? <Text /> : null}
      </div>
    );
  }
}
module.exports = <Search />;
