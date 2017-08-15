import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';

// Local
import constants from '../utils/constants';
import apiAuth from '../services/api/apiAuth';
import storage from '../utils/sessionStorage';

// Components
import FormContainer from '../components/FormContainer.jsx';
import CustomLink from '../components/CustomLink.jsx';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';

class UserRegistration extends Component {
    constructor() {
        super();
        this.state = {};
    }

    _onFieldChange(fieldName, value) {
        this.setState({ [fieldName]: value });
    }

    _submitForm() {
        apiAuth.register({
            name: this.state.name,
            surname: this.state.surname,
            email: this.state.email,
            password: this.state.password,
            userType: constants.userTypes.BASIC_USER
        })
            .then(user => {
                console.log("User registered");
                storage.set(constants.storageKeys.USER_TOKEN, user.token);
                storage.set(constants.storageKeys.USER_DATA, user);
                const redirectTo = constants.routes.MENTORSHIP;
                this.setState({ redirectTo });
            })
            .catch(() => {
                this.setState({ regError: 'Something went wrong!' });
                setTimeout(() => this.setState({ regError: '' }), 3000);
            });
    }

    render() {
        if (this.state.redirectTo) return <Redirect to={{pathname: this.state.redirectTo}}/>;

        return (
            <FormContainer heading="Registration">
                <TextField className="form__input" fullWidth hintText="First name" onChange={(e, value) => this._onFieldChange('name', value)}/>
                <TextField className="form__input" fullWidth hintText="Last name" onChange={(e, value) => this._onFieldChange('surname', value)}/>
                <TextField className="form__input" fullWidth hintText="Email" onChange={(e, value) => this._onFieldChange('email', value)}/>
                <TextField className="form__input" fullWidth hintText="Password" type="password" onChange={(e, value) => this._onFieldChange('password', value)}/>
                <CustomLink to={constants.routes.LOGIN} text="Already have account? Sign in!"/>

                <span className="error">{this.state.regError}</span>
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

export default UserRegistration;
