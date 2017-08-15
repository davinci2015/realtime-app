import React, { Component } from 'react';
import {Redirect, Route} from 'react-router-dom';
import storage from '../utils/sessionStorage';
import constants from '../utils/constants';
import apiAuth from '../services/api/apiAuth';

class PrivateRoute extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isAuthorized: undefined,
            redirectTo: undefined
        };
    }

    componentWillMount() {
        this._authorizeUser(this._getToken());
    }

    componentWillReceiveProps() {
        this.setState({ isAuthorized: null }, () => {
            this._authorizeUser(this._getToken());
        });
    }

    _getToken() {
        return storage.get(constants.storageKeys.USER_TOKEN);
    }

    _saveUserToStorage(user, token) {
        storage.set(constants.storageKeys.USER_DATA, user);
        storage.set(constants.storageKeys.USER_TOKEN, token);
    }

    _isUserAuthorizedByRole(userType, allowedUserTypes) {
        const isAuthorized = allowedUserTypes.find(allowedUserType => allowedUserType === userType);
        return typeof isAuthorized !== 'undefined';
    };

    _authorizeUser(token) {
        let user;
        apiAuth.authorizeUser(token)
            .then(userResult => {
                user = userResult;
                if (this._isUserAuthorizedByRole(user.userType, this.props.allowed)) {
                    this._saveUserToStorage(user, user.token);
                    this.setState({ isAuthorized: true, user });
                } else {
                    return Promise.reject();
                }
            })
            .catch(() => {
                this.setState({
                    isAuthorized: false,
                    redirectTo: constants.routes.LOGIN
                });
            });
    }

    render() {
        if (this.state.redirectTo) return <Redirect to={{pathname: this.state.redirectTo}}/>;
        if (!this.state.isAuthorized) return null;
        const { allowed, component, ...rest } = this.props;
        const Component = component;

        return <Route {...rest} component={() => <Component {...rest} user={this.state.user} token={this.state.user.token}/>}/>;
    }
}

export default PrivateRoute;
