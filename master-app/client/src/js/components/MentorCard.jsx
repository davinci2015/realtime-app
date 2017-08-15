import React, { Component } from 'react';
import { Card, CardActions, CardHeader, CardText } from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import cx from 'classnames';
import helper from '../utils/helpers';

class MentorCard extends Component {
    _generateKnowledge = knowledge => knowledge.map((item, index) => <li key={index}>{item}</li>);

    render() {
        const { mentor, onCall } = this.props;

        const statusClass = cx({
            'card__status': true,
            'card__status--online': mentor.online,
            'card__status--offline': !mentor.online
        });

        const maxRating = 5;
        const mentorRating = helper.calculateAverage(mentor.ratings).toFixed(2);
        const ratingColor = helper.getColorFromRedToGreen(mentorRating / maxRating);

        return (
            <Card containerStyle={{ position: 'relative' }}>
                <CardHeader
                    title={`${mentor.name} ${mentor.surname}`}
                    subtitle={mentor.profession}
                    avatar="https://astiahealth.com/wp-content/uploads/2016/05/user-placeholder.png"
                />
                <CardText>
                    <div className={statusClass}></div>
                    <div className="card__content">
                        <span style={{ color: ratingColor }}>Rating: {mentorRating}</span>
                        <span>{mentor.about}</span>
                        <ul>
                            {this._generateKnowledge(mentor.knowledge)}
                        </ul>
                    </div>
                </CardText>
                <CardActions>
                    <RaisedButton label="Call" default disabled={!mentor.online} onTouchTap={() => onCall(mentor._id)}/>
                </CardActions>
            </Card>
        );
    }
}

export default MentorCard;
