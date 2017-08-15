import React, { Component } from 'react';
import FormContainer from '../components/FormContainer.jsx';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import { Link, Redirect } from 'react-router-dom';
import constants from '../utils/constants';
import apiAuth from '../services/api/apiAuth';
import storage from '../utils/sessionStorage';

class Login extends Component {
    constructor() {
        super();
        this.state = {
            loginData: {},
            loginError: ''
        };
    }

    _onFieldChange(fieldName, value) {
        this.setState({ [fieldName]: value });
    }

    _submitForm() {
        apiAuth.login({
            email: this.state.email,
            password: this.state.password
        })
            .then(user => {
                console.log("Logged Successfully");
                storage.set(constants.storageKeys.USER_TOKEN, user.token);
                storage.set(constants.storageKeys.USER_DATA, user);
                const redirectTo = (user.userType === constants.userTypes.MENTOR) ?
                    constants.routes.MENTOR_PROFILE :
                    constants.routes.MENTORSHIP;
                this.setState({ redirectTo, user });
            })
            .catch(() => {
                this.setState({ loginError: 'Invalid credentials!' });
                setTimeout(() => this.setState({ loginError: '' }), 2000);
            });
    }

    render() {
        if (this.state.redirectTo) return <Redirect to={{pathname: this.state.redirectTo}}/>;

        return (
            <FormContainer heading="Login">
                <TextField className="form__input" fullWidth hintText="Email" onChange={(e, value) => this._onFieldChange('email', value)}/>
                <TextField className="form__input" fullWidth hintText="Password" type="password" onChange={(e, value) => this._onFieldChange('password', value)}/>

                <span className="error">{this.state.loginError}</span>
                <div className="form__buttons">
                    <RaisedButton label="Submit" primary onTouchTap={() => this._submitForm()}/>
                    <Link to={constants.routes.ROOT}>
                        <RaisedButton label="Cancel" default/>
                    </Link>
                </div>
            </FormContainer>
        );
    }
}

export default Login;
