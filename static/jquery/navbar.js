$(function(){ 

  $("#navbar").html('\
      <ul class="navbar-nav mr-auto">\
        <li><img src="static/images/iot-icon.png" border="0" width="37" height="37"></li>\
      </ul>\
      \
      <ul class="navbar-nav navbar-right" id="user_email" style="margin-right: 10px;"></ul>\
      <ul class="navbar-nav navbar-right" id="login_link" style="margin-right: 10px;">\
        <li class="nav-item" id = "login">\
          <a class="nav-link" href="login.html"><i class="fas fa-user"></i><i class="fas fa-sign-in-alt"></i></a>\
        </li>\
      </ul>\
      <ul class="navbar-nav navbar-right" id="e-things-name" style="margin-right: 10px;">\
        <li class="nav-item">\
          <a class="nav-link">e-things</a>\
        </li>\
      </ul>\
      \
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#mobile-nav" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation" id="mobile-button-nav"><span class="navbar-toggler-icon"></span></button>\
      \
      <div class="collapse navbar-collapse" id="mobile-nav">\
        <ul class="navbar-nav navbar-right" id="logout" style="margin-right: 10px;"></ul>\
        <ul class="navbar-nav mr-auto">\
          <li class="nav-item">\
            <a class="nav-link" href="index.html"><i class="fas fa-home"></i></a>\
          </li>\
          <li class="nav-item">\
            <a class="nav-link" href="#"><i class="fas fa-users"></i> Quienes Somos</a>\
          </li>\
          <li class="nav-item">\
            <a class="nav-link" href="#"><i class="fas fa-paper-plane"></i> Contáctanos</a>\
          </li>\
          <li class="nav-item dropdown">\
            <a class="nav-link dropdown-toggle" href="#" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">\
              <i class="fas fa-play"></i> Inténtalo\
            </a>\
            <div class="dropdown-menu" aria-labelledby="navbarDropdown">\
              <a class="dropdown-item" href="create_system.html" style="padding-left: 10px; padding-right:10px;">&nbsp<i class="fas fa-project-diagram"></i> Crear Nuevo Sistema</a>\
              <a class="dropdown-item" href="enter_system.html" style="padding-left: 10px; padding-right:10px;">&nbsp<i class="fas fa-project-diagram"></i> Ingresa a Sistema</a>\
              <a class="dropdown-item" href="qr_code.html" style="padding-left: 10px; padding-right:10px;">&nbsp&nbsp<i class="fab fa-raspberry-pi"></i>&nbsp Configurar Gateway</a>\
              <a class="dropdown-item" href="#" style="padding-left: 10px; padding-right:10px;">&nbsp <i class="fas fa-code-branch"></i>&nbsp Configurar Xbee</a>\
            </div>\
          </li>\
        </ul>\
      </div>\
      \
      <ul class="navbar-nav navbar-right" id="mobile-nav-right">\
        <li class="nav-item" id="user_email_lg"></li>\
        <li class="nav-item" id = "login_lg">\
          <a class="nav-link" href="login.html"><i class="fas fa-user"></i><i class="fas fa-sign-in-alt"></i></a>\
        </li>\
        <li class="nav-item" id="logout_lg"></li>\
        <li class="nav-item">\
          <a class="nav-link">e-things</a>\
        </li>\
      </ul>');

//<button id="logout_lg" class="btn btn-default">Logout</button>\

  if ($(window).width() < 800){
    $("#login_link").show();
    $("#e-things-name").show();
    $("#mobile-nav-right").hide();
  }
  else {
    $("#login_link").hide();
    $("#e-things-name").hide();
    $("#mobile-nav-right").show();
  }

  $(window).resize(function() {
    if ($(window).width() < 800){
      $("#login_link").show();
      $("#e-things-name").show();
      $("#mobile-nav-right").hide();
    }
    else {
      $("#login_link").hide();
      $("#e-things-name").hide();
      $("#mobile-nav-right").show();
    }
  });  


  $("#logout_lg").click(function(){
    firebase.auth().signOut().then(function() {
      console.log("check logout");
    }).catch(function(error) {
    // An error happened.
    });
    $("#login_lg").show();
    $("#login").show();
  });

  $("#logout").click(function(){
    firebase.auth().signOut().then(function() {
    // Sign-out successful.
    }).catch(function(error) {
    // An error happened.
    });
    $("#login_lg").show();
    $("#login").show();
  });

});
