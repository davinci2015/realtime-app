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
import FlatButton from 'material-ui/FlatButton';

class MentorRegistration extends Component {
    constructor() {
        super();
        this.state = {
            numOfKnowledgeFields: 1,
            knowledge: []
        }
    }

    _addKnowledgeField() {
        this.setState({numOfKnowledgeFields: this.state.numOfKnowledgeFields + 1});
    }

    _onKnowledgeChange(value, index) {
        const knowledge = this.state.knowledge;
        knowledge[index] = value;
        this.setState({knowledge})
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
            profession: this.state.profession,
            knowledge: this.state.knowledge,
            about: this.state.about,
            userType: constants.userTypes.MENTOR
        })
            .then(user => {
                console.log("User registered");
                storage.set(constants.storageKeys.USER_TOKEN, user.token);
                storage.set(constants.storageKeys.USER_DATA, user);
                const redirectTo = constants.routes.MENTOR_PROFILE;
                this.setState({ redirectTo });
            })
            .catch(() => {
                this.setState({ regError: 'Something went wrong!' });
                setTimeout(() => this.setState({ regError: '' }), 3000);
            });
    }

    /**
     * Render dynamic number of knowledge fields
     * @param numOfFields {Number} - number of knowledge fields to render
     * @returns {Array}
     * @private
     */
    _renderKnowledgeFields(numOfFields) {
        const fields = [];
        for (let i = 0; i < numOfFields; i++)
            fields.push(
                <TextField
                    key={i}
                    className="form__input"
                    fullWidth
                    hintText="Knowledge"
                    onChange={(e, value) => this._onKnowledgeChange(value, i)}
                />
            );
        return fields;
    }

    render() {
        if (this.state.redirectTo) return <Redirect to={{pathname: this.state.redirectTo}}/>;

        return (
            <FormContainer heading="Registration">
                <TextField className="form__input" fullWidth hintText="First name" onChange={(e, value) => this._onFieldChange('name', value)}/>
                <TextField className="form__input" fullWidth hintText="Last name" onChange={(e, value) => this._onFieldChange('surname', value)}/>
                <TextField className="form__input" fullWidth hintText="Email" onChange={(e, value) => this._onFieldChange('email', value)}/>
                <TextField className="form__input" fullWidth hintText="Password" type="password" onChange={(e, value) => this._onFieldChange('password', value)}/>
                <TextField className="form__input" fullWidth hintText="Profession" onChange={(e, value) => this._onFieldChange('profession', value)}/>
                <TextField className="form__input" fullWidth hintText="About" onChange={(e, value) => this._onFieldChange('about', value)}/>
                {this._renderKnowledgeFields(this.state.numOfKnowledgeFields)}
                <FlatButton label="+ Add knowledge" onTouchTap={() => this._addKnowledgeField()}/>
                <CustomLink to={constants.routes.LOGIN} text="Already have account? Sign in!"/>

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

export default MentorRegistration;
