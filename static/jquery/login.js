$(function(){
  // Initialize Firebase
  var config = {
    apiKey: "XxxxxXxxxxXxxxxX",
    authDomain: "projectId.firebaseapp.com",
    //databaseURL: "https://projectId.firebaseio.com",
    projectId: "projectId",
    //storageBucket: "projectId.appspot.com",
    //messagingSenderId: "yyyyyyyyyyyyyyy"
  };
  firebase.initializeApp(config);

  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      //console.log(user.email);

      if ($(window).width() < 800){
        $("#user_email").html('\
        <li class="nav-item">\
          <a class="nav-link"><strong>'+user.email.split("@")[0]+'</strong></a>\
        </li>');
        $("#logout").html('\
        <li class="nav-item">\
          <a class="nav-link"><i class="fas fa-user"></i><i class="fas fa-sign-out-alt"></i></a>\
        </li>');
        $("#user_email").show();
        $("#user_email_lg").hide();
        $("#logout").show();
        $("#logout_lg").hide();
        $("#login_lg").hide();
        $("#login").hide();
      }
      else {
        $("#user_email_lg").html('<a class="nav-link"><strong>'+user.email.split("@")[0]+'</strong></a>');
        $("#logout_lg").html('<a class="nav-link"><i class="fas fa-user"></i><i class="fas fa-sign-out-alt"></i></a>');
        $("#user_email").hide();
        $("#user_email_lg").show();
        $("#logout").hide();
        $("#logout_lg").show();
        $("#login_lg").hide();
        $("#login").hide();
      }   
    } else {
      //console.log("no user");
      $("#user_email").hide();
      $("#user_email_lg").hide();
      $("#logout").hide();
      $("#logout_lg").hide();
      $("#login_lg").show();
      $("#login").show();
    }
  });

  //Log in
  $("#login_button").click(function() {
    var email = $("#id_email")[0].value;
    var password = $("#id_pass")[0].value; 
    //var select_system = $("#select_system")[0].value;
    //var select_subsystem = $("#select_subsystem")[0].value; 

    firebase.auth().signInWithEmailAndPassword(email, password).then(function(){
      $("#alert_error").html('\
        <div class="alert alert-success" role="alert">\
          <p>Ha ingresado a su cuenta correctamente. </p>\
        </div>');
      document.getElementById("id_email").value = "";
      document.getElementById("id_pass").value = "";
      //document.getElementById("select_system").value = "";
      //document.getElementById("select_subsystem").value = "";

      //window.location.replace("session.html?system="+select_system+"?subsystem="+select_subsystem);
      window.location.replace("enter_system.html");
    }).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;

      console.log(errorMessage);
      // ...
      $("#alert_error").html('\
        <div class="alert alert-danger" role="alert">\
          <p> Ocurrió un error al ingresar, intente nuevamnete. El error es: "'+ errorMessage +'" </p>\
        </div>');
    }); 
  });

  $("#enter_system_button").click(function() {
    var select_system = $("#select_system")[0].value;
    var select_subsystem = $("#select_subsystem")[0].value; 
    document.getElementById("select_system").value = "";
    document.getElementById("select_subsystem").value = "";

    if(select_system!='' && select_subsystem!=''){
      window.location.replace("session.html?count="+select_system+"?system="+select_subsystem);
    }
    else{
      $("#alert_error_enter_system").html('\
        <div class="alert alert-danger" role="alert">\
          <p> Debe llenar todos los campos.</p>\
        </div>');
    }    
  });
  $("#create_system_button").click(function() {
    var create_system = $("#create_system")[0].value;
    document.getElementById("create_system").value = "";

    if(create_system!=''){
      firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
          var db = firebase.firestore();
          db.collection(user.email).doc(create_system).set({});
          db.collection(user.email).doc(create_system+'/privileges/'+user.email).set({ access: 'admin'})
          .then(function() {

            $("#alert_error_enter_system").html('\
            <div class="alert alert-success" role="alert">\
              <p>El sistema '+create_system+' se creó correctamente</p>\
            </div>');
            db.collection("cross_references").doc(user.email).set({})
            .then(function(){
              db.collection("cross_references").doc(user.email+'/counts/'+user.email).update({ [''+create_system+''] : true })
              .then(function(){
                window.location.replace("session.html?count="+user.email+"?system="+create_system);
              })
              .catch(function(error){

                var errorCode = error.code;
                var errorMessage = error.message;

                console.log(errorMessage);

                db.collection("cross_references").doc(user.email+'/counts/'+user.email).set({  })
                .then(function(){
                  db.collection("cross_references").doc(user.email+'/counts/'+user.email).update({ [''+create_system+''] : true })
                  .then(function(){
                    window.location.replace("session.html?count="+user.email+"?system="+create_system);
                  });
                })
                .catch(function(error) {

                  var errorCode = error.code;
                  var errorMessage = error.message;

                  console.log(errorMessage);
                });
              });
            })
            .catch(function(error){
              db.collection("cross_references").doc(user.email+'/counts/'+user.email).update({ [''+create_system+''] : true })
              .then(function(){
                window.location.replace("session.html?count="+user.email+"?system="+create_system);
              })
              .catch(function(error){

                var errorCode = error.code;
                var errorMessage = error.message;

                console.log(errorMessage);

                db.collection("cross_references").doc(user.email+'/counts/'+user.email).set({  })
                .then(function(){
                  db.collection("cross_references").doc(user.email+'/counts/'+user.email).update({ [''+create_system+''] : true })
                  .then(function(){
                    window.location.replace("session.html?count="+user.email+"?system="+create_system);
                  });
                })
                .catch(function(error) {

                  var errorCode = error.code;
                  var errorMessage = error.message;

                  console.log(errorMessage);
                });
              });
            });

          })
          .catch(function(error) {
            var errorCode = error.code;
            var errorMessage = error.message;

            console.log(errorMessage);
            // ...
            $("#alert_error_enter_system").html('\
              <div class="alert alert-danger" role="alert">\
                <p> Ocurrió un error al crear el sistema '+create_system+'. Error: "'+ errorMessage +'" </p>\
              </div>');
        });         
        }
      }); 
    }
    else{
      $("#alert_error_enter_system").html('\
        <div class="alert alert-danger" role="alert">\
          <p> Debe llenar todos los campos.</p>\
        </div>');
    } 
  });

  $(window).resize(function() {
    var user = firebase.auth().currentUser;
    if (user) {
      if ($(window).width() < 800){
        $("#user_email").html('\
        <li class="nav-item">\
          <a class="nav-link"><strong>'+user.email.split("@")[0]+'</strong></a>\
        </li>');
        $("#logout").html('\
        <li class="nav-item">\
          <a class="nav-link"><i class="fas fa-user"></i><i class="fas fa-sign-out-alt"></i></a>\
        </li>');
        $("#user_email").show();
        $("#user_email_lg").hide();
        $("#logout").show();
        $("#logout_lg").hide();
        $("#login_lg").hide();
        $("#login").hide();
      }
      else {
        $("#user_email_lg").html('<a class="nav-link"><strong>'+user.email.split("@")[0]+'</strong></a>');
        $("#logout_lg").html('<a class="nav-link"><i class="fas fa-user"></i><i class="fas fa-sign-out-alt"></i></a>');
        $("#user_email").hide();
        $("#user_email_lg").show();
        $("#logout").hide();
        $("#logout_lg").show();
        $("#login_lg").hide();
        $("#login").hide();
      }
    } 
    else {
      console.log("no user");
      $("#user_email").hide();
      $("#user_email_lg").hide();
      $("#logout").hide();
      $("#logout_lg").hide();
      $("#login_lg").show();
      $("#login").show();
    }
  });
});
