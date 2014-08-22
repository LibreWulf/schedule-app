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
              if (modifier.$set.list !== "master" && modifier.$set.list !== "8hr" &&
                  modifier.$set.list !== "late" && modifier.$set.list !== "mds") {
                return false;
              }
            } else {
              return false;
            }
          }
        }
      }

      return true;
    },
    remove: function(userId, doc) {
      return true;
    }
  });

  Staff.before.insert(function(user, doc) {
    var newdoc = {
      name: doc.name,
      list: "master",
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
  return Staff.find({});
});
