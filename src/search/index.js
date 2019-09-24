import React from 'react';
import ReactDOM from 'react-dom';
import common from '../assets/js/common';
import { a } from './tree-shaking';


import './index.less';

class Index extends React.Component {
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

ReactDOM.render(<Index />, document.getElementById('root'));
