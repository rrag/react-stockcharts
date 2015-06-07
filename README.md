## React Stockcharts

Work in progress

Documentation [here](http://rrag.github.io/react-stockcharts/) and [here](http://rrag.github.io/react-stockcharts/dashboard.html)

Tested with React 0.13 and React 0.14

When used with 0.13.x you get a warning 

```
Warning: withContext is deprecated and will be removed in a future version. Use a wrapper component with getChildContext instead.
```

It is ok, This is the only way to make the project work with both 0.13 & 0.14 with minimal code differences. React 0.14 includes [this](https://github.com/facebook/react/issues/2112) which eliminates the need for using `withContext`, since that is not present in 0.13.x `withContext` had to be used.

Checkout some live examples on plunkr, change to use 0.14 alpha and see that warning disappear

AreaChart - [source](https://gist.github.com/rrag/b9658ffa431f1ffb8d6b), [block](http://bl.ocks.org/rrag/b9658ffa431f1ffb8d6b), [plunker](http://plnkr.co/edit/gist:b9658ffa431f1ffb8d6b?p=preview)

CandleStickChart - [source](https://gist.github.com/rrag/b13b739458e65ff93f4a), [block](http://bl.ocks.org/rrag/b13b739458e65ff93f4a), [plunker](http://plnkr.co/edit/gist:b13b739458e65ff93f4a?p=preview)

w/ Finance time scale - [source](https://gist.github.com/rrag/1eac0cb78f27b31415ac), [block](http://bl.ocks.org/rrag/1eac0cb78f27b31415ac), [plunker](http://plnkr.co/edit/gist:1eac0cb78f27b31415ac?p=preview)

w/ Volume Histogram
- v1 - [source](https://gist.github.com/rrag/88cd65baa331d57caa83), [block](http://bl.ocks.org/rrag/88cd65baa331d57caa83), [plunker](http://plnkr.co/edit/gist:88cd65baa331d57caa83?p=preview)
- v2 - [source](https://gist.github.com/rrag/0a54ca33b05001f17f8f), [block](http://bl.ocks.org/rrag/0a54ca33b05001f17f8f), [plunker](http://plnkr.co/edit/gist:0a54ca33b05001f17f8f?p=preview)

w/ crosshair mouse pointer - [source](https://gist.github.com/rrag/261fa4bc7b67536eb789), [block](http://bl.ocks.org/rrag/261fa4bc7b67536eb789), [plunker](http://plnkr.co/edit/gist:261fa4bc7b67536eb789?p=preview)

w/ Zoom & Pan - [source](https://gist.github.com/rrag/a8465abe0061df1b7976), [block](http://bl.ocks.org/rrag/a8465abe0061df1b7976), [plunker](http://plnkr.co/edit/gist:a8465abe0061df1b7976?p=preview)

w/ Moving Average Overlay - [source](https://gist.github.com/rrag/a27298bb7ae613d48ba2), [block](http://bl.ocks.org/rrag/a27298bb7ae613d48ba2), [plunker](http://plnkr.co/edit/gist:a27298bb7ae613d48ba2?p=preview)

w/ Edge coordinates [source](https://gist.github.com/rrag/70ea3fe28ad35bf3ed4c), [block](http://bl.ocks.org/rrag/70ea3fe28ad35bf3ed4c), [plunker](http://plnkr.co/edit/gist:70ea3fe28ad35bf3ed4c?p=preview)

### Advanced Chart Types
Haikin Ashi - [source](https://gist.github.com/rrag/51379c24e9751d46dcea), [block](http://bl.ocks.org/rrag/51379c24e9751d46dcea), [plunker](http://plnkr.co/edit/gist:51379c24e9751d46dcea?p=preview)

Kagi - [source](https://gist.github.com/rrag/d1e5b75ac12f754bb21d), [block](http://bl.ocks.org/rrag/d1e5b75ac12f754bb21d), [plunker](http://plnkr.co/edit/gist:d1e5b75ac12f754bb21d?p=preview)

P & F - [source](https://gist.github.com/rrag/d43ef867bead0f1de663), [block](http://bl.ocks.org/rrag/d43ef867bead0f1de663), [plunker](http://plnkr.co/edit/gist:d43ef867bead0f1de663?p=preview)

Renko - [source](https://gist.github.com/rrag/df51fa445c26e123beb9), [block](http://bl.ocks.org/rrag/df51fa445c26e123beb9), [plunker](http://plnkr.co/edit/gist:df51fa445c26e123beb9?p=preview)
