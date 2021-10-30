// Call the dataTables jQuery plugin
$(document).ready(function() {
  $('#dataTable').DataTable({
	  "searching": false,
      "paging": false,
      "info": false
  } );
} );