# Clean CSS

[![Build Status](https://travis-ci.org/davidrhyswhite/clean.svg)](https://travis-ci.org/davidrhyswhite/clean)

Clean is a CSS typography / basic element framework. It is a class-less based framework that styles up
the most common HTML DOM elements and provides a modern / consistent look and feel to your application.

## Install

Clean has the following dependencies:

* [Normalize-CSS](http://necolas.github.io/normalize.css/)

You can install Clean as a bower component directly into your project, this will install both Clean and Normalize-CSS:

```
bower install --save-dev clean
```

Just include both dependencies in your page:

```
<head>
  ...
  <link href="bower_components/normalize-css/normalize.css" media="all" rel="stylesheet" type="text/css">
  <link href="bower_components/clean/dist/clean.css" media="all" rel="stylesheet" type="text/css">
  ...
</head>
```

## Development

Clean has the following development dependencies:

* [Bower](http://bower.io/)
* [Gulp](http://gulpjs.com/)
* [Less](http://lesscss.org/)

To start:

```
npm install --global bower gulp
```

Once the above completes, install the project dependencies from within the root of the project:

```
npm install
```

Use the watch command to continuously build as you're working:

```
gulp watch
```
