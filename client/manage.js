Template.master.staff = function() {
  return Staff.find({list: "master"}).fetch();
}

Template.eightHour.staff = function() {
  return Staff.find({list: "8hr"}).fetch();
}

Template.late.staff = function() {
  return Staff.find({list: "late"}).fetch();
}

Template.mds.staff = function() {
  return Staff.find({list: "mds"}).fetch();
}

$(function() {
  $("#master, #8hr, #late, #mds").sortable({
    connectWith: ".connectedSortable",
    stop: function(event, ui) {
      var elem = ui.item.get(0);
      Staff.update(UI.getElementData(elem)._id, {
        $set: {
          list: elem.parentElement.id
        }
      });
    }
  }).disableSelection();

  $("#add-button").click(function() {
      var name = $("#staff-entry").val();
      Staff.insert({
          name: name
      });

      var name = $("#staff-entry").val("");
  });

  $("ul.connectedSortable").on('click', '.close', function(event) {
      Staff.remove(UI.getElementData(event.target.parentElement)._id);
  });

});
