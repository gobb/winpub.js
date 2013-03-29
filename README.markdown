winpub 0.2.0
============

Tiny example of inter-window communication the browser using localStorage.

Sample usage
============

*Window 1*

    winpub.subscribe(function(data) { console.log(data) })

*Window 2*

    winpub.publish('hello world')

All that's required is multiple tabs/windows and the winpub.js file.
