// *winpub* - Sampple of inter-window communication using localStorage
// License info: unlicense (http://unlicense.org/)

window.winpub = {

  // *subscribe* subscribes to updates to winpub.js snapshots
  subscribe: function subscribe(callback) {

    function onStorage(evt) {
      // Ignore non-winpub events && ignore the clear-item event
      if(evt.key === 'winpub' && evt.newValue) callback(evt.newValue)
    }

    if(window.addEventListener) window.addEventListener('storage', onStorage, false)
    else if(window.attachEvent) window.attachEvent('onstorage', onStorage)
  },

  unsubscribe: function unsubscribe(subscription) {
    if(window.removeEventListener) window.removeEventListener('storage', subscription, false)
    else if(window.detachEvent) window.detachEvent('onstorage', onStorage)
  },

  publish: function publish(data) {
    localStorage.setItem('winpub', '') // without this, the storage event won't fire if data is unchanged
    localStorage.setItem('winpub', JSON.stringify(data))
  }
}
