Meteor.startup(function() {
  Staff.allow({
    insert: function(user, doc) {
      // Note: don't have to check doc for extra fields, pre insert does that
      // TODO: Check printable chars?
      if (typeof doc.name != "string" || doc.name.length == 0 || doc.name.length > 127) {
        return false;
      }

      return true;
    },
    update: function(user, doc, fieldNames, modifier) {
      // We only want to allow $set
      for (var op in modifier) {
        if (op != "$set") {
          return false;
        } else {
          // Allow set only on some properties
          for (var settings in modifier.$set) {
            if (settings == "left" || settings == "early_break" || settings == "lunch" ||
                settings == "late_break") {

              if (typeof modifier.$set[settings] != "boolean") {
                return false;
              }

            } else if (settings == "list") {
              if (modifier.$set.type !== null && modifier.$set.type !== "8hr" &&
                  modifier.$set.type !== "late" && modifier.$set.type !== "mds") {
                return false;
              }
            } else {
              return false;
            }
          }
        }
      }

      return true;
    }
  });

  Staff.before.insert(function(user, doc) {
    var newdoc = {
      name: doc.name,
      list: null,
      left: false,
      early_break: false,
      lunch: false,
      late_break: false
    };

    // Clear doc and copy newdoc back into it, this ensures data sanity
    for (var prop in doc) {
      delete doc[prop];
    }

    for (var newprop in newdoc) {
      doc[newprop] = newdoc[newprop];
    }
  });
});

Meteor.publish("staff", function(list) {
  if (list === "master") {
    return Staff.find({list: null});
  } else if (list === "8hr" || list === "late" || list === "mds") {
    return Staff.find({list: list});
  } else {
    return false;
  }
});
