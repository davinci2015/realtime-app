import React from 'react';
import {Redirect, Route} from 'react-router-dom';
import storage from '../utils/sessionStorage';
import constants from '../utils/constants';

const PublicRoute = ({component: Component, ...rest}) => {
    return (
        <Route {...rest} render={props => {
            const user = storage.get(constants.storageKeys.USER_DATA);
            const token = storage.get(constants.storageKeys.USER_TOKEN);

            if (user && token) {
                const path = user.userType === constants.userTypes.MENTOR ?
                    constants.routes.MENTOR_PROFILE :
                    constants.routes.MENTORSHIP;
                return <Redirect to={{pathname: path}}/>
            } else {
                return <Component {...props}/>
            }
        }}/>
    )
}

export default PublicRoute;
