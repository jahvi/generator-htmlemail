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
        type: 'confirm',
        name: 'someOption',
        message: 'Would you like to enable this option?',
        default: true
    }];

    this.prompt(prompts, function (props) {
        this.someOption = props.someOption;

        cb();
    }.bind(this));
};

HtmlEmailGenerator.prototype.prepareMainFiles = function prepareMainFiles() {
    this.mkdir('app');
    this.mkdir('app/css');
    this.mkdir('app/img');

    this.template('_package.json', 'package.json');
    this.copy('Gruntfile.js', 'Gruntfile.js');
};

HtmlEmailGenerator.prototype.copyEmailTemplate = function copyEmailTemplate() {
    this.copy('index.html', 'app/index.html');
};

HtmlEmailGenerator.prototype.copySassFiles = function copySassFiles() {
    this.mkdir('app/scss');

    this.copy('scss/variables.scss', 'app/scss/_variables.scss');
    this.copy('scss/base.scss', 'app/scss/_base.scss');
    this.copy('scss/main.scss', 'app/scss/_main.scss');
    this.copy('scss/media-queries.scss', 'app/scss/_media-queries.scss');
    this.copy('scss/style.scss', 'app/scss/style.scss');
};

