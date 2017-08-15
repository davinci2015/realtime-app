import React, { Component } from 'react';
import { Link } from 'react-router-dom';

// Local
import constants from '../utils/constants';

// Components
import RaisedButton from 'material-ui/RaisedButton';

class Home extends Component {
    render() {
        return (
            <div className="home">
                <div className="home__login-button">
                    <Link to={constants.routes.LOGIN}>
                        <RaisedButton secondary label="Sign in" default/>
                    </Link>
                </div>
                <div className="home__author">
                    <a href="https://www.linkedin.com/in/davinci2015" target="_blank" rel="noopener noreferrer">
                        <span>Danijel Vincijanović</span>
                        <span>Fakultet organizacije i informatike</span>
                        <span>Diplomski rad - 2017.</span>
                    </a>
                </div>
                <div className="home__left">
                    <Link to={constants.routes.REGISTER_USER}>
                        <h1>I'm student</h1>
                    </Link>
                </div>
                <div className="home__right">
                    <Link to={constants.routes.REGISTER_MENTOR}>
                        <h1>I'm mentor</h1>
                    </Link>
                </div>
            </div>
        );
    }
}

export default Home;
