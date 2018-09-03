#### Setting up dev environment

fork or clone the repo

```sh
$ git clone <git url>
$ cd react-stockcharts
$ npm install
$ npm run watch
```

open [http://localhost:8080](http://localhost:8080) in a browser

Logging is done using the [debug](https://www.npmjs.com/package/debug) package. To see logs in the browser's development console enter this code and refresh the page: `localStorage.debug = "react-stockcharts:*"`.

#### Updating documentation
To update the documentation or add an example, update the files under `docs`.

Most of documentation is written as markdown under the `docs/md` folder

see the `docs/documentation.js` file to understand how the different pages are organized

`docs/lib/charts` folder contains the different charts in the examples, the same are used to build the gists in quick start examples also

#### Updating source

To update the source update files under `src`

#### Help needed

Look for issues with the [enhancement](https://github.com/rrag/react-stockcharts/labels/enhancement), [help_wanted](https://github.com/rrag/react-stockcharts/labels/help_wanted)
