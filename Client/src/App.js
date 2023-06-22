import logo from './logo.svg';
import './App.scss';

import { Button } from 'carbon-components-react';
import React from 'react';

class App extends React.Component {
    render() {
        return (
            <div className="App">
                <div className="App-header">
                    <img src={logo} className="App-logo" alt="logo" />
                    <p>
                        Edit <code>src/App.js</code> and save to reload.
                    </p>
                    <a
                        className="App-link"
                        href="https://reactjs.org"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Learn React
                    </a>

                    <Button>Hello</Button>
                </div>
            </div>
        );
    }
}


export default App;
