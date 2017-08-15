import React, { Component } from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import { Redirect } from 'react-router-dom';
import StarRating from 'react-star-rating-component';

import apiUsers from '../services/api/apiUsers';
import constants from '../utils/constants';
import appStrings from '../utils/strings';
import FormContainer from '../components/FormContainer.jsx';

class Ratings extends Component {
    constructor() {
        super();
        this.state = {
            data: {},
            requestError: '',
            submitDisabled: true,
            rating: new Map()
        };
    }

    _submitForm() {
        Promise.all(this._createApiRequests())
            .then(() => this.setState({ redirectTo: constants.routes.MENTORSHIP }))
            .catch(() => this.setState({ requestError: appStrings.BAD_REQUEST }));
    }

    _createApiRequests() {
        return this.props.user.feedbackRequests.map(request => {
            return apiUsers.submitFeedback({
                userId: this.props.user._id,
                mentorId: request.mentorId,
                feedbackRequestId: request.feedbackRequestId,
                rating: this.state.rating.get(request.feedbackRequestId)
            });
        });
    }

    _addRating(feedbackRequestId, value, callback) {
        const currRating = this.state.rating.set(feedbackRequestId, value);
        this.setState({ rating: currRating }, callback);
    }

    _didUserRatedEveryone() {
        return this.props.user.feedbackRequests.length === this.state.rating.size;
    }

    _onStarClick(fieldName, value) {
        this._addRating(fieldName, value, () => {
            if (this._didUserRatedEveryone()) {
                this.setState({ submitDisabled: false });
            }
        });
    }

    _renderFields() {
        return this.props.user.feedbackRequests.map((request, index) => (
            <div key={index} className="ratings__star-wrapper">
                <label>{request.name} {request.surname}</label>
                <StarRating
                    name={request.feedbackRequestId}
                    value={this.state.rating.get(request.feedbackRequestId) || 0}
                    onStarClick={(nextValue, prevValue, name) => this._onStarClick(name, nextValue)}
                />
            </div>
        ));
    }

    render() {
        if (this.state.redirectTo) return <Redirect to={{pathname: this.state.redirectTo}}/>;

        return (
            <FormContainer heading="Mentor Rating">
                <div className="ratings">
                    {this._renderFields()}
                    <span className="error">{this.state.requestError}</span>
                    <div className="form__buttons">
                        <RaisedButton label="Submit" disabled={this.state.submitDisabled} primary onTouchTap={() => this._submitForm()}/>
                    </div>
                </div>
            </FormContainer>
        );
    }
}

export default Ratings;
