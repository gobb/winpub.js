// winpub - window publication library for inter-window communication
// license info: unlicense (http://unlicense.org/)

(function () { 'use strict';	

	// unique key for this window, stored in the window's name, and used to write to localStorage
	var identity = 'winpub/' + (window.name || (window.name = Math.random()));
	
	// last item stored in localStorage by this window
	var lastItemStored = JSON.parse(localStorage.getItem(identity) || '{}')
	
	// last snapshot published by this window
	var lastSnapshot = lastItemStored.snapshot || {};

	window.winpub = { 
		
		// options for customizing the behavior of winpub
		options: { 
		
			// this is how long snapshots may live in localStorage; checked during garbage collection
			snapshotExpiration: 60000, 
			
			// how often publishers renew themselves with the garbage collector; this value should be less than snapshotExpiration
			heartbeatInterval: 5000 
		},
		
		// get all the snapshots published by active windows
		// as a side-effect, this method performs garbage collection
		getAllSnapshots: function(options) {		
			var results = [];
			var now = new Date() * 1;
			var snapshotExpiration = (options || {}).snapshotExpiration || this.options.snapshotExpiration;
			
			for(var k = 0; k < localStorage.length; k++) {
			
				var key = localStorage.key(k);
				if(key.indexOf('winpub/') !== 0) { return; } // ignore non-winpub items in localStorage
				
				// retrieve the item
				var value = JSON.parse(localStorage.getItem(key) || '{}');				
				
				if(now - value.heartbeat > snapshotExpiration) { 
					// perform garbage collection while we are gathering the snapshot
					console.log('destroying ' + key);
					localStorage.removeItem(key); 
					
				} else {
					// this item is not stale; include it in our results
					results.push(value.snapshot);
				}
			}
		},
		
		// create a publisher object for this window
		createPublisher: function(options) {
		
			// perform snapshot for the sake of the garbage collection side-effect
			this.getAllSnapshots(options);
			
			// set up heartbeat to ensure that this window's snapshots don't get garbage-collected
			var running = true;			
			var heartbeatInterval = (options || {}).heartbeatInterval || this.options.heartbeatInterval;
			function heartbeat() { 
				if(!running) { return; }
				lastItemStored.heartbeat = new Date() * 1;
				localStorage.setItem(identity, JSON.stringify(lastItemStored));
				setTimeout(heartbeat, heartbeatInterval);
			};
			heartbeat();
			
			// build publisher object
			var ensureRunning = function() { if(!running) { throw 'cannot call publish() after stop() has been called on the publisher'; } };
			return {
			
				// get the last snapshot published by this window
				getLastSnapshot: function() { 
					return lastSnapshot;
				},
				
				// edit the most recent snapshot and publish it
				editAndPublish: function(editSnapshot) {
					ensureRunning();
					this.publish(editSnapshot(lastSnapshot) || lastSnapshot);
				},
				
				// publish a snapshot from this window
				publish: function(snapshot) { 
					ensureRunning();
					lastItemStored.snapshot = lastSnapshot = snapshot;
					localStorage.setItem(identity, JSON.stringify(lastItemStored));
				},
				
				// stop this publisher, allowing its snapshot to be reclaimed by garbage collection
				stop: function() {
					running = false;
				}
			};
		}
	};	
}());

