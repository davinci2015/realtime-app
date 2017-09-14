import Api from './api';
import constants from '../../utils/constants';

class ApiUsers extends Api {
    /**
     * Get all mentors
     * @returns {Promise}
     */
    getMentors() {
        return this.request({method: constants.apiMethods.GET});
    }

    /**
     * Toggle mentor online status
     * @param mentorId {String}
     * @returns {*}
     */
    toggleOnlineStatus(mentorId) {
        return this.request({
            route: '/toggle-status',
            method: constants.apiMethods.POST,
            params: { id: mentorId }
        });
    }

    /**
     * Call process
     * @param senderId {String}
     * @param senderName {String}
     * @param recipientId {String}
     * @param actionType {String}
     * @param channelId {String}
     * @returns {*}
     */
    processCall({senderId, senderName, recipientId, callRequestType, channelId}) {
        return this.request({
            route: '/call-process',
            method: constants.apiMethods.POST,
            params: { senderId, senderName, recipientId, callRequestType, channelId }
        });
    }

    /**
     * Request feedback for mentor
     * @param userId
     * @param mentorId
     * @returns {*}
     */
    requestFeedback({userId, mentorId}) {
        return this.request({
            route: '/request-feedback',
            method: constants.apiMethods.POST,
            params: { userId, mentorId }
        });
    }

    /**
     * Submit rating for mentor
     * @param userId {String}
     * @param mentorId {String}
     * @param feedbackRequestId {String}
     * @param rating {Number}
     * @returns {*}
     */
    submitFeedback({userId, mentorId, feedbackRequestId, rating}) {
        return this.request({
            route: '/submit-feedback',
            method: constants.apiMethods.POST,
            params: { userId, mentorId, feedbackRequestId, rating }
        })
    }
}

export default new ApiUsers({
    path: '/users'
});