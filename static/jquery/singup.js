$(function(){   
  $("#create_access_button").click(function() {
    var email = $("#singup_email")[0].value;
    var password = $("#singup_pass")[0].value; 
    var repeat_password = $("#singup_repeat_pass")[0].value;

    if(password == repeat_password){

      firebase.auth().createUserWithEmailAndPassword(email, password).then(function(){
        firebase.auth().signInWithEmailAndPassword(email, password).then(function(){
          $("#alert_bad_pass").html('\
          <div class="alert alert-success" role="alert">\
            <p>Su cuenta ha sido registrada. </p>\
          </div>');
          document.getElementById("singup_email").value = "";
          document.getElementById("singup_pass").value = "";
          document.getElementById("singup_repeat_pass").value = "";

          window.location.replace("enter_system.html");
        }).catch(function(error) {
          // Handle Errors here.
          var errorCode = error.code;
          var errorMessage = error.message;

          console.log(errorMessage);
          // ...
          $("#alert_bad_pass").html('\
          <div class="alert alert-danger" role="alert">\
            <p> Ocurrió un error al ingresar, intente nuevamnete. El error es: "'+ errorMessage +'" </p>\
          </div>');
        }); 
      }).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // ...

        $("#alert_bad_pass").html('\
        <div class="alert alert-danger" role="alert">\
          <p> Ocurrió un error al registrarse, intente nuevamnete. El error es: "'+ errorMessage +'" </p>\
        </div>');

      });

    }
    else{
      $("#alert_bad_pass").html('\
        <div class="alert alert-danger" role="alert">\
          <p> Debe ingresar claves iguales </p>\
        </div>');
      document.getElementById("singup_pass").value = "";
      document.getElementById("singup_repeat_pass").value = "";
    }


  });
});
