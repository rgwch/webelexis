const log = require('../logger')
const ElexisUtil = require('../util/elexis-types')
const elexisUtils = new ElexisUtil()

/*** DEPRECATED */
class xCustomVerifier {
    constructor(app, options = {}) {
        this.app = app;
        this.options = options;
        this.userService = app.service('user')

        this._comparePassword = this._comparePassword.bind(this);
        this._normalizeResult = this._normalizeResult.bind(this);
        this.verify = this.verify.bind(this);
    }

    _comparePassword(user, password) {

        return new Promise((resolve, reject) => {
            const hashed = elexisUtils.hashPassword(password, user.salt)
            if (hashed.hashed === user.hashed_password) {
                resolve(user)
            } else {
                reject(false)
            }
        });
    }

    _normalizeResult(results) {
        // Paginated services return the array of results in the data attribute.
        let entities = results.data ? results.data : results;
        let entity = entities[0];

        // Handle bad username.
        if (!entity) {
            return Promise.reject(false); // eslint-disable-line
        }

        return Promise.resolve(entity);
    }

    verify(req, username, password, done) {
        log.debug('Checking credentials', username, password);

        this.userService.get(username)
        .then(user => this._comparePassword(user,password))
        .then(user=> {
            delete user.hashed_password
            delete user.salt
            done(null,user,{"userId":user.id})
        })
        .catch(error => error ? done(error) : done(null, error, { message: 'Invalid login' }));
    }
}

module.exports = CustomVerifier;
