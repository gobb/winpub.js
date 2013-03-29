winpub 0.1.0
============

This is an inter-window communication library for the browser using localStorage.

Sample usage
============

    var publisher = winpub.createPublisher();
    publisher.publish('hello world');
    winpub.getAllSnapshots(); // returns ['hello world'];

If other windows are publishing to winpub in the same domain, the values they've published in winpub.getAllSnapshots() as well.

All that's required is the winpub.js file.

Website
=======
http://omphalos.github.com/winpub.js/
