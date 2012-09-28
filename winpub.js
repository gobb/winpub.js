// *winpub* - Library for serverless inter-window communication
// License info: unlicense (http://unlicense.org/)

(function () { 'use strict';	

	// *identity* is a unique key for this window, stored in the window's name, and used to write to localStorage.
	var identity = 'winpub/' + (window.name || (window.name = Math.random()));

	// *lastItemStored* tracks the last item stored in localStorage by this window.
	var lastItemStored = JSON.parse(localStorage.getItem(identity) || '{}')

	// *lastSnapshot* tracks the last snapshot published by this window
	var lastSnapshot = lastItemStored.snapshot;

	window.winpub = { 

		// *options* provides the ability to customize the behavior of *winpub*.
		options: { 
			// *snapshotExpiration* is how long snapshots may live in localStorage; checked during garbage collection.
			snapshotExpiration: 5000, 
			// *heartbeatInterval* is how often publishers renew themselves with the garbage collector.
            // This value should be less than snapshotExpiration.
			heartbeatInterval: 1000 
		},		
		
		// *getAllSnapshots* gets all the snapshots published by active windows.
		// As a side-effect, this method will clean up any expired *winpub* data in localStorage.
		getAllSnapshots: function(options) {		
			var results = [];
			var now = new Date() * 1;
			var snapshotExpiration = (options || {}).snapshotExpiration || this.options.snapshotExpiration;

			for(var k = 0; k < localStorage.length; k++) {

				var key = localStorage.key(k);
                // Ignore non-winpub items in localStorage.
				if(key.indexOf('winpub/') !== 0) { continue; } 

				// Retrieve the item
				var value = JSON.parse(localStorage.getItem(key) || '{}');				

				if(now - value.heartbeat > snapshotExpiration) { 
					// Perform garbage collection while we are gathering the snapshot
					localStorage.removeItem(key); 

				} else {
					// This item is not stale.
                    // Include it in our results.
					results.push(value.snapshot);
				}
			}
			
			return results;
		},

		// *garbageCollect* cleans up any expired *winpub* data in localStorage.
		garbageCollect: function() { 
			// We can perform garbage collection by calling getAllSnapshots, since it has that side-effect.
			this.getAllSnapshots();
		},

		// *createPublisher* creates a publisher object for this window.
		createPublisher: function(options) {

			// Perform a snapshot for the sake of the garbage collection side-effect.
			this.getAllSnapshots(options);

			// Set up a heartbeat to ensure that this window's snapshots don't get garbage-collected.
			var running = true;			
			var heartbeatInterval = (options || {}).heartbeatInterval || this.options.heartbeatInterval;
			function heartbeat() { 
				if(!running) { return; }
				lastItemStored.heartbeat = new Date() * 1;
				localStorage.setItem(identity, JSON.stringify(lastItemStored));
				setTimeout(heartbeat, heartbeatInterval);
			}
			heartbeat();

			// Build the publisher object.
			var ensureRunning = function() { if(!running) { throw 'cannot call publish() after stop() has been called on the publisher'; } };
			return {

				// Get the last snapshot published by this window.
				getLastSnapshot: function() { 
					return lastSnapshot;
				},

				// Edit the most recent snapshot and publish it.
				editAndPublish: function(editSnapshot) {
					ensureRunning();
					this.publish(editSnapshot(lastSnapshot) || lastSnapshot);
				},

				// Publish a snapshot from this window.
				publish: function(snapshot) { 
					ensureRunning();
					lastItemStored.snapshot = lastSnapshot = snapshot;
					localStorage.setItem(identity, JSON.stringify(lastItemStored));
				},

				// Stop this publisher (terminating the timer associated with it)
				stop: function() {
					running = false;
				}
			};
		}
	};	
}());

