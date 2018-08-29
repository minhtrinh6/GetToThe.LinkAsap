var namespace = "more_types";

module.exports = moreTypes;

function moreTypes() {
  var types = {
      Map: {
        replacer : function(val) { return Array.from(val); },
        reviver  : function(val) { return new Map(val); }
      },
      Set: {
        replacer : function(val) { return Array.from(val); },
        reviver  : function(val) { return new Set(val); }
      }
  };

  return {
    add_types: more_types_add_types,
    _serialize: more_types_serialize,
    _deserialize: more_types_deserialize
  };

  function more_types_add_types(super_fn, userTypes) {
    for (var type in userTypes) {
      types[type] = userTypes[type];
    }
  }
  
  function _replacer(key, value) {
    var type = value.constructor.name;
    if (type in types && 'replacer' in types[type]) {
      value = {[namespace]: type, data: types[type].replacer(value)};
    }
    return value;
  }
  
  function more_types_serialize(super_fn, obj) {
    return JSON.stringify(obj, _replacer);
  }
  
  function _reviver(key, value) {
    var type = value[namespace];
    if (type !== undefined && type in types && 'reviver' in types[type]) {
      value = types[type].reviver(value['data']);
    }
    return value;
  }
  
	function more_types_deserialize(super_fn, strVal, defaultVal) {
		if (!strVal) { return defaultVal }
		// It is possible that a raw string value has been previously stored
		// in a storage without using store.js, meaning it will be a raw
		// string value instead of a JSON serialized string. By defaulting
		// to the raw string value in case of a JSON parse error, we allow
		// for past stored values to be forwards-compatible with store.js
		var val = '';
		try { val = JSON.parse(strVal, _reviver) }
		catch(e) { val = strVal }

		return (val !== undefined ? val : defaultVal);
	}
}