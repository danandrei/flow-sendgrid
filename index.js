// Dependencies
var sendgrid = require('sendgrid');

var moduleConfig = process.config.flow['flow-sendgrid'] || {};

/**
 * Send email using sendgrid API
 *
 * @name send
 * @function
 * @param {Object} options Object containig the mail options (can also be added in the data object)
 *
 *  - `template` (String):  The template name (required).
 *  - `to` (String):  The receiver information (required).
 *  - `from` (String):  The sender information (required).
 *  - `subject` (String):  The email subject (optional).
 * @param {Object} data Object containig the mail data
 *  - `mergeVars` (Object):  The object containing template substitutions (optional).
 *
 * @param {Function} next The next function.
 */
 exports.send = function (_options, data, next) {
    var self = this;
    var options = defOptions(_options, data);

    if (!options.template || !options.to || !options.from) {
        return next(new Error('Missing required properties.'));
    }

    // build the email template
    var email = new self._sendgridClient.Email({
        to: options.to,
        from: options.from,
        subject: options.subject || ' ',
        text: ' ',
        html: ' '
    });

    if (data.mergeVars) {
        email.setSubstitutions(buildMergeVars(data.mergeVars));
    }

    // add template
    email.addFilter('templates', 'enable', 1);
    email.addFilter('templates', 'template_id', options.template);

    // send email
    self._sendgridClient.send(email, function (err, json) {

        if (err) {
            return next(new Error(err.message));
        }

        if (json && json.message === 'success') {
            return next(null, data);
        } else {
            return next(new Error('A Sendgrid error occured while sending the template.'));
        }
    });

 };

/**
 *  define send method options

 *  @name defOptions
 *  @private
 */
 function defOptions (_options, data) {

    var options = {
        template: null,
        to: null,
        from: null,
        subject: null
    };

    Object.keys(options).forEach(function (option) {

        options[option] = _options._[option] || data[option];
    });

    return options;
 };

/**
 *  Build the merge fields structure
 *
 *  @name buildMergeVars
 *  @private
 */
function buildMergeVars (data) {
    var substitutions = {};

    for (var key in data) {
        substitutions['*|' + key + '|*'] = [ data[key] ];
    }

    return substitutions;
}

/**
 *  Initilizes module
 *
 *  @name init
 *  @private
 */
exports.init = function (config, ready) {
    var apiKey = moduleConfig.apiKey;

    if (!apiKey) {
        return ready(new Error('Missing sendgrid api key.'));
    }

    this._sendgridClient = sendgrid(apiKey);

    ready();
};