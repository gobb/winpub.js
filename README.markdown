winpub.js
=========

Tiny example of inter-window communication in the browser using localStorage.

Sample usage
============

*Window 1*

    winpub.subscribe(function(data) { console.log(data) })

*Window 2*

    winpub.publish('hello world')

All that's required is multiple tabs or windows, and the winpub.js file.
