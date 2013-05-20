if (!('onupgradeneeded' in webkitIndexedDB.open('feature-detect'))) {
  var originalOpen = webkitIndexedDB.open;
  webkitIndexedDB.open = function(name, version) {
    if (arguments.length >= 2) {
      version = Math.floor(Number(version));
      if (version < 1 || version >= Math.pow(2,53)) {
        throw new TypeError("Invalid version");
      }
    }
    var shimRequest = (function() {
      var eventListeners = Object.create(null);
      return {
        result: undefined,
        error: null,
        source: null,
        transaction: null,
        readyState: 'pending',
        onsuccess: null,
        onerror: null,
        onblocked: null,
        onupgradeneeded: null,
        addEventListener: function(type, callback) {
          eventListeners[type] = eventListeners[type] || [];
          if (eventListeners[type].indexOf(callback) === -1) {
            eventListeners[type].push(callback);
          }
        },
        removeEventListener: function(type, callback) {
          if (!(type in eventListeners)) { return; }
          var index = eventListeners[type].indexOf(callback);
          if (index !== -1) {
            eventListeners[type].splice(index, 1);
          }
        },
        dispatchEvent: function(event) {
          var type = String(event.type),
              oldSelfEvent = self.event;
          try {
            self.event = event;
            if (typeof this['on' + type] === 'function') {
              try { this['on' + type](event); } catch (e) { console.error(e); }
            }
            if (type in eventListeners) {
              eventListeners[type].forEach(function(listener) {
                try { listener(event); } catch (e) { console.error(e); }
              });
            }
          } finally {
            self.event = oldSelfEvent;
          }
        }
      };
    }());

    function fire(type, target, properties) {
      var event = new Event(type);
      event.target = target;
      if (properties) {
        Object.keys(properties).forEach(function(key) {
          event[key] = properties[key];
        });
      }
      target.dispatchEvent(event);
    }

    var openIDBRequest = originalOpen.call(webkitIndexedDB, name);
    openIDBRequest.addEventListener('error', function(e) {
      shimRequest.result = openIDBRequest.result;
      shimRequest.readyState = 'done';
      shimRequest.error = e.target.error;
      fire('error', shimRequest);
    });
    openIDBRequest.addEventListener('success', function () {
      var db = openIDBRequest.result,
          oldVersion = db.version;
      if (!version && oldVersion === "") {
        version = 1;
      }
      if (version < Number(db.version)) {
        shimRequest.readyState = 'done';
        shimRequest.error = {
          name: 'VersionError',
          code: 0,
          message: 'An attempt was made to open a database using a lower version than the existing version.'
        };
        fire('error', shimRequest);
      } else if (version === Number(db.version)) {
        shimRequest.result = db;
        shimRequest.readyState = 'done';
        shimRequest.transaction = null;
        fire('success', shimRequest);
      } else {
        var versionChangeIDBRequest = db.setVersion(version);
        versionChangeIDBRequest.addEventListener('error', function(e) {
          shimRequest.readyState = 'done';
          shimRequest.error = e.target.error;
          fire('error', shimRequest);
        });
        versionChangeIDBRequest.addEventListener('blocked', function() {
          fire('blocked', shimRequest);
        });
        versionChangeIDBRequest.addEventListener('success', function() {
          var trans = versionChangeIDBRequest.result;
          shimRequest.result = db;
          shimRequest.transaction = trans;
          trans.addEventListener('abort', function(e) {
            db.close();
            shimRequest.readyState = 'done';
            shimRequest.error = e.target.error;
            fire('error', shimRequest);
          });
          trans.addEventListener('complete', function() {
            shimRequest.result = db;
            shimRequest.readyState = 'done';
            shimRequest.transaction = null;
            fire('success', shimRequest);
          });
          fire('upgradeneeded', shimRequest,
               {oldVersion: oldVersion, newVersion: db.version});
        });
      }
    });
    return shimRequest;
  };
}
