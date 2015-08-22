#### Setting up dev environment

```
$ git clone https://github.com/rrag/react-stockcharts.git
$ cd react-stockcharts
$ npm install
$ npm run watch
```

open http://localhost:4000 in a browser

#### Updating documentation
To update the documentation or add an example update the files under `docs`.

Most of documentation is written as markdown under the `docs/md` folder

see the `docs/documentation.js` file to understand how the different pages are organized

`docs/lib/charts` folder contains the different charts in the examples, the same are used to build the gists in quick start examples also

#### Updating source

To update the source update files under `src`

#### Help needed

[ ] Server side rendering example with svg
[ ] Create an extensible api for indicators, refactor sma, ema into that extensible api
[ ] Create new indicators as overlays for 
    [ ] Bollinger bands
[ ] Create new indicators as charts for (like MACD)
    [ ] Stocastics
    [ ] Relatove Strength Index
