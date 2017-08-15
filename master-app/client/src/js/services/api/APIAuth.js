import Api from './api';
import constants from '../../utils/constants';

class ApiAuth extends Api {
    /**
     * Login user
     * @param params {Object}
     * @param params.email {String}
     * @param params.password {String}
     * @returns {Promise}
     */
    login(params) {
        return this.request({
            route: '/login',
            method: constants.apiMethods.POST,
            params
        });
    }

    /**
     * Logout user
     * @param userId {String}
     * @returns {Promise}
     */
    logout(userId) {
        return this.request({
            route: '/logout',
            method: constants.apiMethods.POST,
            params: {id: userId}
        });
    }

    authorizeUser(token) {
        return this.request({
            route: '/authorize-token',
            method: constants.apiMethods.POST,
            params: { token }
        })
    }

    /**
     * Register user
     * @param params {Object}
     * @returns {*}
     */
    register(params) {
        return this.request({
            route: '/register',
            method: constants.apiMethods.POST,
            params
        });
    }
}

export default new ApiAuth({
    path: '/auth'
});