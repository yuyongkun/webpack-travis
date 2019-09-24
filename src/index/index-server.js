
const React = require('react');
require('./index.less');

class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      imgToggle: true,
      buttonText: '隐藏图片',
    };
  }

  componentDidMount() {
  }

  hideOpt() {
    this.setState({
      imgToggle: !this.state.imgToggle,
      buttonText: this.state.imgToggle ? '显示图片' : '隐藏图片',
    });
  }

  render() {
    const img = this.state.imgToggle ? <img src={require('../assets/images/1.jpg')} alt="小图" /> : null;
    return (
        <div>
            {img}
            <button
                type="button"
                style={{
                  display: 'block',
                  margin: '20px auto',
                }}
                onClick={this.hideOpt.bind(this)}
            >
                {this.state.buttonText}
            </button>
        </div>
    );
  }
}
module.exports = <Index />;
