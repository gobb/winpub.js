// inital clean up
winpub.garbageCollect(); 

test( "getAllSnapshots should return all published snapshots", function() { 
	var publisher = winpub.createPublisher();
	publisher.publish(123);
	var snapshots = winpub.getAllSnapshots();	
	ok(snapshots[0] == 123);
});

test( "getLastSnapshot should get the last snapshot", function() { 
	var publisher = winpub.createPublisher();
	publisher.publish('hello');
	var snapshot = publisher.getLastSnapshot();	
	ok(snapshot == 'hello');
});

test( "publish should publish a snapshot", function() { 
	var publisher = winpub.createPublisher();
	publisher.publish(345);
	publisher.publish(567);
	var snapshots = winpub.getAllSnapshots();
	ok(snapshots[0] == 567);
});

test( "editAndPublish should edit the snapshot and publish it", function() { 
	var publisher = winpub.createPublisher();
	publisher.publish(10);
	publisher.editAndPublish(function(snapshot) {
		return snapshot + 100;
	});
	var lastSnapshot = publisher.getLastSnapshot();	
	ok(lastSnapshot == 110);
});
