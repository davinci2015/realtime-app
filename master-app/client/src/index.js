import React from 'react';
import ReactDOM from 'react-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from 'react-tap-event-plugin';
import { BrowserRouter as Router, Switch } from 'react-router-dom';

// Components
import Home from './js/pages/Home.jsx';
import MentorList from './js/pages/MentorList.jsx';
import MentorProfile from './js/pages/MentorProfile.jsx';
import Login from './js/pages/Login.jsx';
import MentorRegistration from './js/pages/MentorRegistration.jsx';
import UserRegistration from './js/pages/UserRegistration.jsx';
import Panel from './js/pages/Panel.jsx';
import Ratings from './js/pages/Ratings.jsx';
import NotFound from './js/pages/NotFound.jsx';
import PrivateRoute from './js/pages/PrivateRoute.jsx';
import PublicRoute from './js/pages/PublicRoute.jsx';

// Local
import registerServiceWorker from './js/registerServiceWorker';
import constants from './js/utils/constants';
import './scss/main.css';

injectTapEventPlugin();

const AppRouter = () => (
    <MuiThemeProvider>
        <Router>
            <div>
                <Switch>
                    <PrivateRoute exact path={constants.routes.RATING} allowed={[constants.userTypes.BASIC_USER]} component={Ratings}/>
                    <PrivateRoute exact path={constants.routes.MENTORSHIP} allowed={[constants.userTypes.BASIC_USER]} component={MentorList}/>
                    <PrivateRoute exact path={constants.routes.MENTOR_PROFILE} allowed={[constants.userTypes.MENTOR]} component={MentorProfile}/>
                    <PrivateRoute exact path={constants.routes.PANEL_WITH_PARAMS} allowed={[constants.userTypes.BASIC_USER, constants.userTypes.MENTOR]} component={Panel}/>
                    <PublicRoute exact path={constants.routes.ROOT} component={Home}/>
                    <PublicRoute exact path={constants.routes.LOGIN} component={Login}/>
                    <PublicRoute exact path={constants.routes.REGISTER_MENTOR} component={MentorRegistration}/>
                    <PublicRoute exact path={constants.routes.REGISTER_USER} component={UserRegistration}/>
                    <PublicRoute path='*' component={NotFound}/>
                </Switch>
            </div>
        </Router>
    </MuiThemeProvider>
);

ReactDOM.render(<AppRouter />, document.getElementById('root'));

registerServiceWorker();
