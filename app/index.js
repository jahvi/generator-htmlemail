'use strict';

var util   = require('util'),
    path   = require('path'),
    yeoman = require('yeoman-generator');

var HtmlEmailGenerator = module.exports = function HtmlEmailGenerator(args, options, config) {
    yeoman.generators.Base.apply(this, arguments);

    this.on('end', function () {
        // this.installDependencies({ skipInstall: options['skip-install'] });
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

HtmlEmailGenerator.prototype.createMainFolders = function createMainFolders() {
    this.mkdir('css');
    this.mkdir('img');
};

HtmlEmailGenerator.prototype.copySassFiles = function copySassFiles() {
    this.mkdir('scss');
    this.copy('scss/style.scss', 'scss/style.scss');
};

HtmlEmailGenerator.prototype.copyEmailTemplate = function copyEmailTemplate() {
    this.copy('index.html', 'index.html');
};
