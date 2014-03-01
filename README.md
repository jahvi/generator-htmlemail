# generator-htmlemail

A [Yeoman](http://yeoman.io) generator to create HTML emails with built-in support for SCSS, image optimization, CSS inlining, test email delivery and more.

Based on Marco Solazzi's [grunt-email-boilerplate](https://github.com/dwightjack/grunt-email-boilerplate).

## Features

* SCSS stylesheets with [Compass](http://compass-style.org/)
* Image optimization with [jpegtran](http://jpegclub.org/jpegtran/) and [OptiPNG](http://optipng.sourceforge.net/)
* Inlining CSS styles with [Premailer](http://premailer.dialect.ca/)
* Test email delivery with [NodeMailer](https://github.com/andris9/Nodemailer)

## Requirements

* Node.js >= 0.8.11 ([install wiki](https://github.com/joyent/node/wiki/Installing-Node.js-via-package-manager))
* Yeoman >= 1.0.0 (`npm install -g yo`)
* Ruby >= 1.8.7 ([installers](http://www.ruby-lang.org/en/downloads/))
* Compass >= 0.12.2 (`gem install compass`)
* Premailer >= 1.7.3 (`gem install premailer` and, most of the time, `gem install hpricot`)

## Getting Started

To install generator-htmlemail from npm, run:

```
$ npm install -g generator-htmlemail
```

Then, initiate the generator in an empty directory with:

```
$ yo htmlemail
```

## Documentation

### Prompts

This generator will ask you a few questions about your project before scaffolding the file structure. Here's a summary of what each question is used for:

#### [?] What's the project name?

Used in the generated `package.json` file as the name of the project, by default this is the folder name.

#### [?] What template do you want to use?

Enter the URL of the boilerplate HTML file you want to use for your email, this can be the "raw" version of a github file or gist. Defaults to a modified version of [HTML Email Boilerplate](http://htmlemailboilerplate.com/).

#### [?] What's your production domain?

Used by the premailer task to rewrite your assets url, e.g:

```
<img src="/img/sample.jpg" />
```

Becomes:

```
<img src="http://www.yourdomain.com/img/sample.jpg" />
```

#### [?] Select the SMTP host to use when sending test emails

Used to set up the nodemailer transport service.

#### [?] What's your SMTP server username and passsword?

Used to authenticate with the SMTP service.

#### [?] What's the name and email of the test email recipient?

The name and email address of the account where the test email will be sent.

### Sources

Sources are located in the `app` folder:

* `index.html`: HTML boilerplate
* `scss/`: SCSS folder
    * `_variables.scss`: boilerplate style variables
    * `_base.scss`: common styles
    * `_media-queries.scss`: optional media queries for responsive emails
    * `_main.scss`: **your email styles**
    * `style.scss`: glue stylesheet, don't edit it directly
* `img`: source images of your email
* `css`: destination folder of compiled SCSS sources

### Default Tasks

The generator comes with some predefined tasks to cover average email development needs.

#### `dev` Task

This task runs a watch trigger for changes to the `scss` folder and starts a static HTTP server at `http://localhost:8000` pointing to the `app` folder. The browser will reload automatically (thanks to the `livereload` task) upon changes to your SCSS or HTML files.

#### `build` Task

This task creates a build from your sources. It creates a folder named `dist` next to `app`, then compiles your SCSSes and inlines the resulting stylesheet in the HTML source through Premailer. Finally it starts a static HTTP server at `http://localhost:8000` pointing to the `dist` folder.

Images are optimized with jpegtran and OptiPNG.

#### `send` Task

This task sends the compiled email to any configured recipient. This basically performs the same actions as the `build` task only that instead of running a static HTTP server it'll try to send the actual email.

Yeoman will ask you for your email transport settings and recipients on startup but if you wish to further customize these options refer to the `nodemailer` tasks in `Gruntfile.js`.

### Tasks Customization

See `Gruntfile.js` source for more options and customizations.

## Roadmap

### 1.0.0

* Prefix domain with http:// automatically if needed
* Run tasks concurrently when possible
* Support for adding multiple email targets
* Support to change transport type
* Allow users to change the initial template
* Include SCSS support optionally
* Add EJS support

## Contributing

Feel free to submit bugs or pull requests, just make sure to target the develop branch and follow the same coding style.

## License

[MIT License](http://en.wikipedia.org/wiki/MIT_License)
