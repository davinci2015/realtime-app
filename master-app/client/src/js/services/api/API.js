import axios from 'axios';

// Local
import constants from '../../utils/constants';
import config from '../../config';

class Api {
    constructor({path = null}) {
        this._apiConfig = {
            baseURL: config.apiBaseUrl,
            path
        }
    }

    _constructURL(route) {
        return this._apiConfig.path ?
            `${this._apiConfig.baseURL}${this._apiConfig.path}${route}` :
            `${this._apiConfig.baseURL}${route}`;
    }

    _get(route) {
        return axios.get(this._constructURL(route))
            .then(response => response.data);
    }

    _post(route, params) {
        return axios.post(this._constructURL(route), params)
            .then(response => response.data)
    }

    request({route = '', method, params}) {
        let req;

        switch (method) {
            case constants.apiMethods.GET:
                req = this._get(route);
                break;
            case constants.apiMethods.POST:
                req = this._post(route, params);
                break;
            default:
                throw new Error("Invalid request method");
        }

        return req;
    }
}

export default Api;