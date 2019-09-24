import React from 'react';
import ReactDOM from 'react-dom';
import './index.less';

const imgpath = require('../assets/images/1.jpg');

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
        const img = this.state.imgToggle ? <img src={imgpath} alt="小图" /> : null;
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
ReactDOM.render(<Index />, document.getElementById('root'));
