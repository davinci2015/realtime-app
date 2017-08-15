import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import RaisedButton from 'material-ui/RaisedButton';

class NotFound extends Component {
    render() {
        return (
            <div className="notFound">
                <Link to="/">
                    <RaisedButton label="Go home, you're drunk"/>
                </Link>
            </div>
        );
    }
}

export default NotFound;
