## About this

This is a starter project for webpack with React hot reload

It uses a dev stack with

1. [gulp](http://gulpjs.com/) as the build system
1. [webpack module loader](http://webpack.github.io/) as the module bundler
1. [React Hot Loader](http://gaearon.github.io/react-hot-loader/) to hot reload the file changes
1. [ReactJS](http://facebook.github.io/react/)
1. [Sass](http://sass-lang.com/) for style sheets (CSS with superpowers)

## Getting started

#### Install Gulp globally

```sh
$ npm install -g gulp
```

#### Clone this repo
```sh
$ git clone <repo URI>
```

#### Install dependencies
```sh
$ npm install
```

#### execute gulp and see the different options

```sh
$ gulp
```

#### Launch in watch mode
```sh
$ gulp watch
```

This now opens [http://localhost:3500](http://localhost:3500) in your default browser


##### See HMR (Hot Module Replacement) in action

with `gulp watch` running open `src/scripts/subfolder/hello.jsx` in a text editor, modify something and save it.
Tada !!!!

##### See HMR (Hot Module Replacement) in action for styles

open `webpack.config.js` in text editor and change 

```javascript
entry: [
    './src/scripts/index.js'
],
```

to

```javascript
entry: [
    './src/scripts/index-with-styles.js'
],
```

and restart `gulp watch`

with `gulp watch` running open `src/styles/includes/body.scss` in a text editor, modify the body color and save it.
Tada !!!!

