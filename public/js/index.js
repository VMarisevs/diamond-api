$(document).ready(function(){
	// hiding div
	$( "#dialog" ).dialog({ autoOpen: false,resizable: false, modal: true, width:'500px', });
	
	$("#showButton").click(function(event){
		if ($.isNumeric($("#showDiamondId").val())){
			//window.location.href = "/GET/" + $("#showDiamondId").val();
			
			$.ajax({
				url: '/diamond',
				type: 'POST',
				data: 'id=' + $("#showDiamondId").val(),
				success: function(data) {
					var msg = "";
					if (data == "Error"){
						msg = "This record doesn't exists...";
						alert(msg);	
					}						
					else {
						msg = 	"Diamond id:" + data.id + "<br/>"
								+ "Carat : " + data.carat + "<br/>"
								+ "Cut : " + data.cut + "<br/>"
								+ "Color : " + data.color + "<br/>"
								+ "Clarity : " + data.clarity + "<br/>"
								+ "Depth : " + data.depth + "<br/>"
								+ "Table : " + data.table + "<br/>"
								+ "Price : " + data.price + "<br/>"
								+ "X : " + data.x + "<br/>"
								+ "Y : " + data.y + "<br/>"
								+ "Z : " + data.z + "<br/>";
						$("#dialog-text").html(msg);
						$("#dialog").dialog("open");
						// running function draw diamond from my d3 file
						//drawDiamond(data);
						drawThree(data);
					}
										
				}
			});
		}
	});
	
	
	$("#deleteButton").click(function(event){
		if ($.isNumeric($("#deleteDiamondId").val())){
			$.ajax({
				url: '/DELETE',
				type: 'DELETE',
				data: 'id=' + $("#deleteDiamondId").val(),
				success: function(result) {
					var msg = "This record doesn't exists";
					if (result == "OK")
						msg = "Record with id " + $("#deleteDiamondId").val()
									+ " successfully deleted.";
					
					alert(msg);
				},
				error:function(){
					//$('.fail').show();
					//e.preventDefault();
					var msg = "Error occured while submitting the form.	";
					alert(msg);
				},
			});
			
		}
	});
	
	$("#postInsert").click(function(event){
		$.ajax({
			url: '/POST',
			type: 'POST',
			data: 	'carat=' + $("#postCarat").val()
					+ '&cut=' + $("#postCut").val()
					+ '&color=' + $("#postColor").val()
					+ '&clarity=' + $("#postClarity").val()
					+ '&depth=' + $("#postDepth").val()
					+ '&table=' + $("#postTable").val()
					+ '&price=' + $("#postPrice").val()
					+ '&x=' + $("#postX").val()
					+ '&y=' + $("#postY").val()
					+ '&z=' + $("#postZ").val()
			,success: function(data) {
				var msg = 	"<strong>The new diamond inserted.</strong><br/>Diamond id:" + data.id + "<br/>"
								+ "Carat : " + data.carat + "<br/>"
								+ "Cut : " + data.cut + "<br/>"
								+ "Color : " + data.color + "<br/>"
								+ "Clarity : " + data.clarity + "<br/>"
								+ "Depth : " + data.depth + "<br/>"
								+ "Table : " + data.table + "<br/>"
								+ "Price : " + data.price + "<br/>"
								+ "X : " + data.x + "<br/>"
								+ "Y : " + data.y + "<br/>"
								+ "Z : " + data.z + "<br/>";
						$("#dialog-text").html(msg);
						$("#dialog").dialog("open");					
			}
		});
	});
	
	$("#putUpdate").click(function(event){
		$.ajax({
			url: '/PUT',
			type: 'PUT',
			data: 	
					 'id=' + $("#putId").val()
					+ '&carat=' + $("#putCarat").val()
					+ '&cut=' + $("#putCut").val()
					+ '&color=' + $("#putColor").val()
					+ '&clarity=' + $("#putClarity").val()
					+ '&depth=' + $("#putDepth").val()
					+ '&table=' + $("#putTable").val()
					+ '&price=' + $("#putPrice").val()
					+ '&x=' + $("#putX").val()
					+ '&y=' + $("#putY").val()
					+ '&z=' + $("#putZ").val()
			,success: function(data) {
					var msg = 	"<strong>Diamond with id =" + data.id + "</strong><br/>"
								+ "Carat : " + data.carat + "<br/>"
								+ "Cut : " + data.cut + "<br/>"
								+ "Color : " + data.color + "<br/>"
								+ "Clarity : " + data.clarity + "<br/>"
								+ "Depth : " + data.depth + "<br/>"
								+ "Table : " + data.table + "<br/>"
								+ "Price : " + data.price + "<br/>"
								+ "X : " + data.x + "<br/>"
								+ "Y : " + data.y + "<br/>"
								+ "Z : " + data.z + "<br/>";
						$("#dialog-text").html(msg);
						$("#dialog").dialog("open");
			}
		});
	});
	
});