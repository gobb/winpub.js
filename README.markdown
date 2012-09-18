winpub
======

This is an inter-window communication library for the browser using localStorage.

Sample usage
============

    var publisher = winpub.createPublisher();
    publisher.publish('hello world');
    winpub.getAllSnapshots(); // returns ['hello world'];
    
If other windows are publishing to winpub in the same domain, the values they've published in winpub.getAllSnapshots() as well.

All that's required is the winpub.js file.

Cloning
=======
winpub uses git submodules to track qunit.
So, after cloning, run:

    git submodule update --init

Code documentation
==================
Forthcoming
