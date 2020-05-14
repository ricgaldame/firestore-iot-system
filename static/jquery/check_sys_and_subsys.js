$(function(){
   firebase.auth().onAuthStateChanged(function(user) {
    if (user) {

    	var select_system = '';
    	var select_subsystem = '';

    	var db = firebase.firestore();

    	$(document).on('change','#select_system',function(){
    		$("#select_subsystem").html('\
    		<option selected="selected"></option>');

			var select_system_input = document.getElementById("select_system");
			select_system = select_system_input.value;
			//console.log(select_system);

			db.collection("cross_references").doc(user.email).collection("counts").get().then(function(querySnapshot) {
				querySnapshot.forEach(function(doc) {
					var cross_references_id = doc.id;
					var cross_references_data = doc.data();

					if(cross_references_id == select_system){
						console.log(cross_references_data);
						var systems = Object.keys(cross_references_data);
						//var system_val = Object.values(cross_references_data);
						for(var i = 0; i < systems.length; i++){
							$("#select_subsystem").append('\
							<option>'+systems[i]+'</option>');
						}
					}
				});
			});

		});

		$(document).on('change','#select_subsystem',function(){
			var select_subsystem_input = document.getElementById("select_subsystem");
			select_subsystem = select_subsystem_input.value;
			console.log(select_system);
		});

    	$("#select_system").html('\
    	<option selected="selected"></option>');
    	$("#select_subsystem").html('\
    	<option selected="selected"></option>');

		db.collection("cross_references").doc(user.email).collection("counts").get().then(function(querySnapshot) {
			querySnapshot.forEach(function(doc) {
				var cross_references_id = doc.id;
				$("#select_system").append('\
				<option>'+cross_references_id+'</option>');
			});
		});
    }
    else {
      window.location.replace("login.html");
    }
  });
});
