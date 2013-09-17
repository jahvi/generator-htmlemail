'use strict';

var util   = require('util'),
    path   = require('path'),
    yeoman = require('yeoman-generator');

var HtmlEmailGenerator = module.exports = function HtmlEmailGenerator(args, options, config) {
    yeoman.generators.Base.apply(this, arguments);

    this.on('end', function () {
        this.installDependencies({ skipInstall: options['skip-install'], bower: false });
    });

    this.pkg = JSON.parse(this.readFileAsString(path.join(__dirname, '../package.json')));
};

util.inherits(HtmlEmailGenerator, yeoman.generators.Base);

HtmlEmailGenerator.prototype.askFor = function askFor() {
    var cb = this.async();

    // have Yeoman greet the user.
    console.log(this.yeoman);

    var prompts = [{
        type: 'input',
        name: 'appname',
        message: 'What\'s the project name?',
        default: this.appname,
        validate: function (value) {
            // Trim input value and check if it's not mepty
            if (!value.replace(/^\s+/g, '').replace(/\s+$/g, '')) {
                return 'You need to provide a project name';
            }
            return true;
        }
    }, {
        type: 'input',
        name: 'htmlTemplate',
        message: 'What template do you want to use?',
        default: 'https://gist.github.com/jahvi/6595019/raw/b982a85c71c7f592d9d6798733a52ecf1a524895/email-template.html',
        validate: function (value) {
            // Trim input value
            var domain = value.replace(/^\s+/g, '').replace(/\s+$/g, '');
            // Check if domain isn't empty
            if (!domain) {
                return 'You need to provide a production domain';
            }
            // Check if domain is valid
            if (!domain.match(/^(https?:\/\/)([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/)) {
                return 'You need to provide a valid domain';
            }
            return true;
        }
    }, {
        type: 'input',
        name: 'domainProduction',
        message: 'What\'s your production domain?',
        default: 'http://www.mydomain.com/',
        validate: function (value) {
            // Trim input value
            var domain = value.replace(/^\s+/g, '').replace(/\s+$/g, '');
            // Check if domain isn't empty
            if (!domain) {
                return 'You need to provide a production domain';
            }
            // Check if domain is valid
            if (!domain.match(/^(https?:\/\/)([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/)) {
                return 'You need to provide a valid domain';
            }
            return true;
        },
        filter: function (value) {
            // Make sure domain ends with a trailing slash
            if (value[value.length - 1] !== '/') {
                return value + '/';
            }
            return value;

        }
    }, {
        type: 'list',
        name: 'emailService',
        message: 'Select the SMTP host to use when sending test emails',
        choices: [
            'Gmail',
            'DynectEmail',
            'hot.ee',
            'Hotmail',
            'iCloud',
            'mail.ee',
            'Mail.Ru',
            'Mailgun',
            'Mailjet',
            'Mandrill',
            'Postmark',
            'QQ',
            'SendGrid',
            'SES',
            'Yahoo',
            'yandex',
            'Zoho'
        ],
        default: 0
    }, {
        type: 'input',
        name: 'emailAuthUser',
        message: 'What\'s your SMTP server username?',
        validate: function (value) {
            // Trim input value and check if it's not mepty
            if (!value.replace(/^\s+/g, '').replace(/\s+$/g, '')) {
                return 'You need to provide a SMTP server username';
            }
            return true;
        }
    }, {
        type: 'password',
        name: 'emailAuthPassword',
        message: 'What\'s your SMTP server passsword?',
        validate: function (value) {
            // Trim input value and check if it's not mepty
            if (!value.replace(/^\s+/g, '').replace(/\s+$/g, '')) {
                return 'You need to provide a SMTP server passsword';
            }
            return true;
        }
    }, {
        type: 'input',
        name: 'emailRecipientName',
        message: 'What\'s the name of the test email recipient?',
        validate: function (value) {
            // Trim input value and check if it's not mepty
            if (!value.replace(/^\s+/g, '').replace(/\s+$/g, '')) {
                return 'You need to provide an email recipient name';
            }
            return true;
        }
    }, {
        type: 'input',
        name: 'emailRecipientEmail',
        message: 'What\'s the email of the test email recipient?',
        validate: function (value) {
            // Trim input value
            var email = value.replace(/^\s+/g, '').replace(/\s+$/g, '');
            // Check if email isn't empty
            if (!email) {
                return 'You need to provide an email';
            }
            // Check if email is valid
            if (!email.match(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) {
                return 'You need to provide a valid email';
            }
            return true;
        }
    }];

    this.prompt(prompts, function (props) {
        this.appname             = props.appname;
        this.htmlTemplate        = props.htmlTemplate;
        this.domainProduction    = props.domainProduction;
        this.emailService        = props.emailService;
        this.emailAuthUser       = props.emailAuthUser;
        this.emailAuthPassword   = props.emailAuthPassword;
        this.emailRecipientName  = props.emailRecipientName;
        this.emailRecipientEmail = props.emailRecipientEmail;

        cb();
    }.bind(this));
};

HtmlEmailGenerator.prototype.prepareMainFiles = function prepareMainFiles() {
    this.mkdir('app');
    this.mkdir('app/css');
    this.mkdir('app/img');

    this.template('_package.json', 'package.json');
    this.template('_Gruntfile.js', 'Gruntfile.js');
};

HtmlEmailGenerator.prototype.copyPremailerParser = function copyPremailerParser() {
    this.directory('vendor', 'vendor');
};

HtmlEmailGenerator.prototype.fetchEmailTemplate = function fetchEmailTemplate() {
    var request = require('request'),
        self    = this,
        cb      = self.async();

    self.log.writeln('Fetching template...');

    request.get(this.htmlTemplate, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            self.write('app/index.html', body);
        }
        cb();
    });
};

HtmlEmailGenerator.prototype.copySassFiles = function copySassFiles() {
    this.mkdir('app/scss');

    this.copy('scss/variables.scss', 'app/scss/_variables.scss');
    this.copy('scss/base.scss', 'app/scss/_base.scss');
    this.copy('scss/main.scss', 'app/scss/_main.scss');
    this.copy('scss/media-queries.scss', 'app/scss/_media-queries.scss');
    this.copy('scss/style.scss', 'app/scss/style.scss');
};

