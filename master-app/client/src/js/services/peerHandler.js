class MediaDeviceHandler {
    constructor() {
        this._mediaConstraints = {
            audio: true,
            video: true
        };
    }

    _isSupportingUserMedia() {
        return !!navigator.mediaDevices.getUserMedia;
    }

    getAudio() {
        return new Promise((resolve, reject) => {
            if (this._isSupportingUserMedia()) {
                navigator.mediaDevices.getUserMedia(this._mediaConstraints)
                    .then(stream => resolve(stream))
                    .catch(error => reject(error));
            } else {
                reject(new Error('User media not supported'));
            }
        });
    }
}

export default new MediaDeviceHandler();