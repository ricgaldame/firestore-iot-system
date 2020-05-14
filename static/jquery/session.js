$(function(){
  var location = window.location;
  var system_access = location.href.split('?')[1].split('=')[1];
  var subsystem_access = location.href.split('?')[2].split('=')[1];

  system_access =  system_access.split('%20').join(' ');
  subsystem_access = subsystem_access.split('%20').join(' ');

  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {

      var db = firebase.firestore();

      // db.collection("cross_references").doc('carmenbeatriz.tj@gmail.com').set({})
      // .then(function(){
      //   db.collection("cross_references").doc('carmenbeatriz.tj@gmail.com/counts/'+'ricgaldame@gmail.com').set({  });
      // })
      // .catch(function(error) {
      //   db.collection("cross_references").doc('carmenbeatriz.tj@gmail.com/counts/'+'ricgaldame@gmail.com').set({  });
      // });

      //db.collection("cross_references").doc('carmenbeatriz.tj@gmail.com/counts/'+'ricgaldame@gmail.com').set({  });

      //db.collection("cross_references").doc('carmenbeatriz.tj@gmail.com/counts/'+'ricgaldame@gmail.com').update({ 'Casa2' : true });

      // db.collection("cross_references").doc('carmenbeatriz.tj@gmail.com/counts/'+'ricgaldame@gmail.com').update({ 'Casa2' : firebase.firestore.FieldValue.delete() }).
      // then(function(){
      //  db.collection("cross_references").doc('carmenbeatriz.tj@gmail.com').collection('counts').doc('ricgaldame@gmail.com').delete();
      // });

      //db.collection("cross_references").doc('carmenbeatriz.tj@gmail.com').delete();

      var get_select_value = '';
      var delete_user = '';
      var edit_user = '';
      var edit_user_value = '';
      var add_new_user = '';
      var level_user = '';
      var raspberry_id_add = '';
      var raspberry_id_delete = '';
      var access_user = ''

      $("#delete_system").click(function(){
        var delete_system = $("#id_contente_delete_s").attr('id_contente_delete_system');
        console.log(delete_system);
        //db.collection(user.email).doc("system").update({
        db.collection(system_access).doc(subsystem_access).update({
          [delete_system]: firebase.firestore.FieldValue.delete()
        });
      });

      $("#delete_principal_system").click(function(){
        var count_diferents_gatways_delete = 0;
        db.collection("gateway").get().then(function(querySnapshot) {
          querySnapshot.forEach(function(doc) {
              var gateway = doc.data();
              //console.log(gateway);
              if(gateway['count'] == system_access && gateway['system'] == subsystem_access){
                count_diferents_gatways_delete = count_diferents_gatways_delete + 1;
              }
          });

          //console.log(count_diferents_gatways_delete);

          if(count_diferents_gatways_delete == 0){
            db.collection(system_access).doc(subsystem_access).delete()
            .then(function() {
              $("#session_ok").html('\
                <div class="alert alert-success" role="alert">\
                  <p>El sistema '+subsystem_access+' se borró correctamente</p>\
                </div>');
              db.collection(system_access).doc(subsystem_access).collection('privileges').get().then(function(querySnapshot) {
              querySnapshot.forEach(function(doc) {
                  // doc.data() is never undefined for query doc snapshots
                  var access =  doc.data();
                  //console.log(doc.id, " => ",access['access']);
                  db.collection(system_access).doc(subsystem_access+'/privileges/'+doc.id).delete()
                  .then(function() {

                    db.collection("cross_references").doc(doc.id+'/counts/'+system_access).update({ [''+subsystem_access+''] : firebase.firestore.FieldValue.delete() })
                    .then(function(){
                      $("#session_ok").html('\
                      <div class="alert alert-success" role="alert">\
                        <p>El sistema '+subsystem_access+'/privileges se borró correctamente</p>\
                      </div>');
                      window.location.replace("enter_system.html");
                    });
                  })
                  .catch(function(error) {
                    var errorCode = error.code;
                    var errorMessage = error.message;

                    console.log(errorMessage);
                    // ...
                    $("#session_ok").html('\
                      <div class="alert alert-danger" role="alert">\
                        <p> Ocurrió un error al borrar el sistema '+subsystem_access+'. Error: "'+ errorMessage +'" </p>\
                      </div>');
                  });
                });
              });
            })
            .catch(function(error) {
              var errorCode = error.code;
              var errorMessage = error.message;

              console.log(errorMessage);
              // ...
              $("#session_ok").html('\
                <div class="alert alert-danger" role="alert">\
                  <p> Ocurrió un error al borrar el sistema '+subsystem_access+'. Error: "'+ errorMessage +'" </p>\
                </div>');
            });
          }
          else{
            alert("Primero debes eliminar todas las configuraciones que tienes para el gateway");
          }

        });         
      });

      $("#delete_subsystem").click(function(){
        var delete_system = $("#id_contente_delete_sub").attr('id_contente_delete_system');
        var delete_subsystem = $("#id_contente_delete_sub").attr('id_contente_delete_subsystem');

        db.collection(system_access).doc(subsystem_access).update({
          [delete_system+'.' +delete_subsystem]: firebase.firestore.FieldValue.delete()
        });

      });

      $("#delete_raspberry_button").click(function(){
        console.log(raspberry_id_delete);
        if(raspberry_id_delete.split('/').length == 1){
            db.collection('gateway').doc(raspberry_id_delete).delete();
            document.getElementById('close_set_raspberry').click();
        }
      });

      $("#add_edit_raspberry_button").click(function(){
        var count_diferents_gatways_delete = 0;
        db.collection("gateway").get()
        .then(function(querySnapshot) {
          querySnapshot.forEach(function(doc) {
              var gateway = doc.data();
              //console.log(gateway);
              if(gateway['count'] == system_access && gateway['system'] == subsystem_access){
                count_diferents_gatways_delete = count_diferents_gatways_delete + 1;
              }
          });

          if(count_diferents_gatways_delete == 0){
            console.log(raspberry_id_add);
            if(raspberry_id_add.split('/').length == 1){
                db.collection('gateway').doc(raspberry_id_add).set({
                user: user.email,
                count: system_access,
                system: subsystem_access
              });
              document.getElementById('close_set_raspberry').click();
            }
          }
          else{
            alert("Primero debes eliminar todas las configuraciones que tienes para el gateway");
          }

        });
      });

      $("#delete_users_button").click(function(){
        console.log(delete_user);
        db.collection(system_access).doc(subsystem_access).collection('privileges').doc(delete_user).delete()
        .then(function() {
            db.collection("cross_references").doc(delete_user+'/counts/'+system_access).update({ [''+subsystem_access+''] : firebase.firestore.FieldValue.delete() })
            .then(function(){
             document.getElementById('admin_users').click();
            });
          })
          .catch(function(error) {
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log(errorMessage);
        });
      });

      $("#edit_users_button").click(function(){
        db.collection(system_access).doc(subsystem_access).collection('privileges').doc(edit_user).set({
          access: edit_user_value
        })
        .then(function() {
            document.getElementById('admin_users').click();
          })
          .catch(function(error) {
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log(errorMessage);
        });
      });

      $("#add_new_users_button").click(function(){
        //console.log(add_new_user);
        //console.log(level_user);
        db.collection(system_access).doc(subsystem_access+'/privileges/'+add_new_user).set({ access: level_user})
        .then(function() {
            db.collection("cross_references").doc(add_new_user).set({})
            .then(function(){
              db.collection("cross_references").doc(add_new_user+'/counts/'+system_access).update({ [''+subsystem_access+''] : true })
              .then(function(){
                document.getElementById('admin_users').click();
              })
              .catch(function(error){

                var errorCode = error.code;
                var errorMessage = error.message;

                console.log(errorMessage);

                db.collection("cross_references").doc(add_new_user+'/counts/'+system_access).set({  })
                .then(function(){
                  db.collection("cross_references").doc(add_new_user+'/counts/'+system_access).update({ [''+subsystem_access+''] : true })
                  .then(function(){
                    document.getElementById('admin_users').click();
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
              db.collection("cross_references").doc(add_new_user+'/counts/'+system_access).update({ [''+subsystem_access+''] : true })
              .then(function(){
                document.getElementById('admin_users').click();
              })
              .catch(function(error){

                var errorCode = error.code;
                var errorMessage = error.message;

                console.log(errorMessage);

                db.collection("cross_references").doc(add_new_user+'/counts/'+system_access).set({  })
                .then(function(){
                  db.collection("cross_references").doc(add_new_user+'/counts/'+system_access).update({ [''+subsystem_access+''] : true })
                  .then(function(){
                    document.getElementById('admin_users').click();
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
        });
      }); 

      $(document).on('change','#raspberry_code',function(){
        var raspberry_code = document.getElementById("raspberry_code");
        raspberry_id_add = raspberry_code.value;
      });
      $(document).on('change','#raspberry_code_delete',function(){
        var raspberry_code_delete = document.getElementById("raspberry_code_delete");
        raspberry_id_delete = raspberry_code_delete.value;
      });

      $(document).on('change','#add_users_input',function(){
        var user_input = document.getElementById("add_users_input");
        add_new_user = user_input.value;
      });

      $(document).on('change','#level_user',function(){
        var level_user_input = document.getElementById("level_user");
        level_user = level_user_input.value;
      });

      $(document).on('change','#select_edit',function(){
        var selected = document.getElementById("select_edit");
        var value = selected.value;
        get_select_value = value;
      }); 

      $(document).on('change','#select_edit_user',function(){
        var edit_user_input_value = document.getElementById("select_edit_user");
        edit_user_value = edit_user_input_value.value;
      });

      

      $(document).on('change','#enter_add_subsystem',function(){
        var selected = document.getElementById("enter_add_subsystem");
        var subsystem = selected.value;
        var system = $("#enter_add_subsystem").attr('system_id');
        console.log(subsystem);

        //db.collection(user.email).doc("system").update({
        db.collection(system_access).doc(subsystem_access).update({
          [system+'.'+subsystem]: 
          {
            io: "output",
            point: "D0",
            state: 0,
            type: "digital",
            //xbee: "---------"
            direction: "---------",
            command: "---------",
            endpoint: "xbee"
          }
        });

      });

      $(document).on('change','#enter_add_system',function(){
        var selected = document.getElementById("enter_add_system");
        var system = selected.value;

        //db.collection(user.email).doc("system").update({
        db.collection(system_access).doc(subsystem_access).update({
          [system]: ""
        });

      });

      $("#edit_subsubsystem").click(function(){
        var edit_system = $("#select_edit").attr('system_id');
        var edit_subsystem = $("#select_edit").attr('subsystem_id');
        var edit_subsubsystem = $("#select_edit").attr('subsubsystem_id');
        var edit_value = get_select_value;

        console.log(edit_system);
        console.log(edit_subsystem);
        console.log(edit_subsubsystem);
        console.log(edit_value);

        if(edit_value == 'on'){edit_value = 1;}
        if(edit_value == 'off'){edit_value = 0;}

        //db.collection(user.email).doc("system").update({
        db.collection(system_access).doc(subsystem_access).update({
          [edit_system +'.' + edit_subsystem + '.' + edit_subsubsystem]: edit_value
        });

      });

      $("#edit_system_div").html('\
        <div class="row" style="margin: 0px 20px;">\
          <div class="col-lg-6">\
            <div class="row" id="configure_delete_system">\
              <div class="col-ms-2">\
                <h5 style="margin-left:5px;"><strong>Cuenta asociada a:</strong> '+system_access+'</h5>\
              </div>\
              <div class="col-lg-12"></div>\
              <div class="col-ms-2">\
                <h5 style="margin-left:5px;"><strong>Sistema:</strong> '+subsystem_access+'</h5>\
              </div>\
            </div>\
          </div>\
          <div class="col-lg-6">\
            <div class="row" id="configure_system_subsystem">\
            </div>\
          </div>\
        </div>');

      if(user.email == system_access){
        $("#configure_delete_system").append('\
        <div class="col-lg-12"></div>\
        <div class="col-ms-4">\
          <button class="btn btn-lg" data-toggle="modal" data-target="#modal_delete_principal_system" id="delete_principal_system" style="background-color:transparent;margin:0;padding:0;font-size: 17px;color:red;"><i class="far fa-trash-alt"></i> Eliminar Sistema</button>\
        </div>');
      }

      db.collection(system_access).doc(subsystem_access).collection('privileges').doc(user.email).get()
      .then(function(doc) {
          if (doc.exists) {
              //console.log("Document data:", doc.data());
              access_user = doc.data()['access'];
              if(doc.data()['access'] == 'admin'){
                $("#configure_system_subsystem").append('\
                  <div class="col-lg-12"></div>\
                  <div class="col-ms-4">\
                    <button class="btn btn-lg" data-toggle="modal" data-target="#modal_add_system" id="add_new_system" style="background-color:transparent;margin:0;padding:0;font-size: 17px;"><i class="fas fa-plus-circle"></i> Agregar Subsistema</button>\
                  </div>\
                  <div class="col-lg-12"></div>\
                  <div class="col-ms-4">\
                    <button class="btn btn-lg" data-toggle="modal" data-target="#modal_edit" id="edit_system" style="background-color:transparent;margin:0;padding:0;font-size: 17px;"><i class="fas fa-cog"></i> Configuración Básica del Sistema</button>\
                  </div>\
                  <div class="col-lg-12"></div>\
                  <div class="col-ms-4">\
                    <button class="btn btn-lg" data-toggle="modal" data-target="#modal_admin_users" id="admin_users" style="background-color:transparent;margin:0;padding:0;font-size: 17px;"><i class="fas fa-users"></i> Administrar Usuarios</button>\
                  </div>\
                  <div class="col-ms-4" style="margin-left: 10px;"></div>\
                  <div class="col-ms-4">\
                    <button class="btn btn-lg" data-toggle="modal" data-target="#modal_set_raspberry" id="configure_raspberry" style="background-color:transparent;margin:0;padding:0;font-size: 17px;"><i class="fab fa-raspberry-pi"></i> Configurar Gateway</button>\
                  </div>\
                  '); 

                $("#admin_users").click(function() {
                  $("#content_admin_users").html('\
                    <h5 style="margin-left: 10px;">Usuarios:</h5>\
                    <table class="table table-responsive table-hover" id="table_users" style="margin-bottom: 0px;">\
                      <tr>\
                        <td style="padding: .8rem;"><i data-toggle="modal" data-target="#modal_add_users" id="add_new_users" class="fas fa-plus-circle"></i></td>\
                        <td colspan="2" style="padding: .8rem;"></td>\
                      </tr>\
                      <tr>\
                        <td style="padding: .8rem;">Usuario</td>\
                        <td colspan="2" style="padding: .8rem;">Nivel</td>\
                      </tr>\
                    </table>\
                    ');

                  $("#add_new_users").click(function(){
                    $("#content_add_users").html('\
                      <h5>Escribe el nombre del usuario, selecciona el nivel de usuario y luego presiona Agregar de lo contrario presiona Cerrar</h5>\
                      <table class="table table-responsive table-hover" style="margin-bottom: 0px;">\
                      <tr>\
                        <td style="padding: .8rem;"><input id="add_users_input" class="form-control" placeholder="Ej: usuario@mail.com"></td>\
                        <td style="padding: .8rem;">\
                          <select id="level_user" class="custom-select">\
                            <option></option>\
                            <option>admin</option>\
                            <option>user</option>\
                          </select>\
                        </td>\
                      </tr>\
                     </table>');
                  });

                  var data_users = db.collection(system_access).doc(subsystem_access).collection('privileges');
                  data_users.get().then(function(querySnapshot) {
                      querySnapshot.forEach(function(doc) {
                          // doc.data() is never undefined for query doc snapshots
                          var access =  doc.data();
                          //console.log(doc.id, " => ",access['access']);
                          $("#table_users").append('\
                            <tr>\
                              <td style="padding: .8rem;">'+doc.id+'</td>\
                              <td style="padding: .8rem;">'+access['access']+'</td>\
                              <td style="padding: .8rem;"><i style="font-size: 12px;" data-toggle="modal" data-target="#modal_delete_users" id="delete_users_'+doc.id.split('.').join('puntoxxx').split('@').join('arrobaxxx')+'" class="fas fa-minus-circle"></i></td>\
                              <td style="padding: .8rem;"><i style="font-size: 12px;" data-toggle="modal" data-target="#modal_edit_users" id="edit_users_'+doc.id.split('.').join('puntoxxx').split('@').join('arrobaxxx')+'" class="far fa-edit"></i></td>\
                            </tr>');

                          $("#delete_users_"+doc.id.split('.').join('puntoxxx').split('@').join('arrobaxxx')).click(function(){
                            delete_user = $(this).attr('id').split('delete_users_').join('').split('arrobaxxx').join('@').split('puntoxxx').join('.');
                            //console.log(delete_user);
                            $("#content_delete_users").html('\
                              <h5>Si está seguro que desea eliminar el usuario <strong>"'+delete_user+'"</strong> presiona Eliminar de lo contrario presiona Cerrar</h5>');
                          });

                          $("#edit_users_"+doc.id.split('.').join('puntoxxx').split('@').join('arrobaxxx')).click(function(){
                            edit_user = $(this).attr('id').split('edit_users_').join('').split('arrobaxxx').join('@').split('puntoxxx').join('.');
                            //console.log(delete_user);
                            $("#content_edit_users").html('\
                              <h5>Seleccione el nivel de acceso del usuario <strong>'+edit_user+'</strong> y luego presione Aceptar de lo contrario presiona Cerrar</h5>\
                              <select id="select_edit_user" class="custom-select">\
                                <option></option>\
                                <option>admin</option>\
                                <option>user</option>\
                              </select>');
                          });
                      });
                  });
                });

                $("#configure_raspberry").click(function() {
                  var count_diferents_gatways = 0;
                  db.collection("gateway").get()
                  .then(function(querySnapshot) {
                      querySnapshot.forEach(function(doc) {
                          var gateway = doc.data();

                          // console.log('count_link', " => ",system_access);
                          // console.log('system_link', " => ",subsystem_access);
                          // console.log('gateway', " => ",raspberry_id_add);
                          // console.log('user', " => ",gateway['user']);
                          // console.log('count', " => ",gateway['count']);
                          // console.log('system', " => ",gateway['system']);

                          if(gateway['count'] == system_access && gateway['system'] == subsystem_access && count_diferents_gatways == 0){
                            raspberry_id_add = doc.id;
                            raspberry_code_delete = doc.id;
                            count_diferents_gatways = count_diferents_gatways + 1;
                          }
                          else{
                            if(gateway['count'] == system_access && gateway['system'] == subsystem_access && count_diferents_gatways > 0){
                              raspberry_id_add = doc.id + '/' + raspberry_id_add;
                              raspberry_code_delete = doc.id + '/' + raspberry_code_delete;

                              count_diferents_gatways = count_diferents_gatways + 1;
                            }
                          }
                      });
                      var warning_id = '';
                      if(count_diferents_gatways > 1){
                        warning_id = '<strong style="color:red">(* Solo debería tener un id asociado, por favor elimine los que no está utilizando en su sistema)</strong>';
                        $("#content_set_raspberry").html('\
                          <table class="table table-responsive table-hover">\
                            <tr>\
                              <td colspan=2><h6><strong>Gateway(s) Id</strong>: '+raspberry_id_add+'</h6></td>\
                            </tr>\
                            <tr>\
                              <td colspan=2><h6>'+warning_id+'</h6></td>\
                            </tr>\
                            <tr>\
                              <td>Configurar Gateway</td>\
                              <td><i data-toggle="modal" data-target="#modal_add_edit_raspberry" id="add_edit_raspberry" style="font-size:15px;" class="fas fa-cog"></i></td>\
                            </tr>\
                            <tr>\
                              <td>Eliminar Gateway</td>\
                              <td><i data-toggle="modal" data-target="#modal_delete_raspberry" id="delete_raspberry" style="font-size:15px;" class="far fa-trash-alt"></i></td>\
                            </tr>\
                          </table>');
                      }
                      if(count_diferents_gatways == 1){
                        $("#content_set_raspberry").html('\
                          <table class="table table-responsive table-hover">\
                            <tr>\
                              <td colspan=2><h6><strong>Gateway(s) Id</strong>: '+raspberry_id_add+'</h6></td>\
                            </tr>\
                            <tr>\
                              <td>Configurar Gateway</td>\
                              <td><i data-toggle="modal" data-target="#modal_add_edit_raspberry" id="add_edit_raspberry" style="font-size:15px;" class="fas fa-cog"></i></td>\
                            </tr>\
                            <tr>\
                              <td>Eliminar Gateway</td>\
                              <td><i data-toggle="modal" data-target="#modal_delete_raspberry" id="delete_raspberry" style="font-size:15px;" class="far fa-trash-alt"></i></td>\
                            </tr>\
                          </table>');
                      }
                      if(count_diferents_gatways == 0){
                        $("#content_set_raspberry").html('\
                          <table class="table table-responsive table-hover">\
                            <tr>\
                              <td colspan=2><h6><strong>Gateway(s) Id</strong>: </h6></td>\
                            </tr>\
                            <tr>\
                              <td>Configurar Gateway</td>\
                              <td><i data-toggle="modal" data-target="#modal_add_edit_raspberry" id="add_edit_raspberry" style="font-size:15px;" class="fas fa-cog"></i></td>\
                            </tr>\
                            <tr>\
                              <td>Eliminar Gateway</td>\
                              <td><i data-toggle="modal" data-target="#modal_delete_raspberry" id="delete_raspberry" style="font-size:15px;" class="far fa-trash-alt"></i></td>\
                            </tr>\
                          </table>');
                      }

                      $("#delete_raspberry").click(function() {
                        $("#content_delete_raspberry").html('\
                          <h6>Si está seguro que desea eliminar un gateway (Raspberry) escriba el Id que lo identifica y presione el botón Eliminar, de lo contrario presione Cerrar</h6>\
                          <input id="raspberry_code_delete" class="form-control" placeholder="Ej: 0123456">');
                      });

                      $("#add_edit_raspberry").click(function() {
                        $("#content_add_edit_raspberry").html('\
                          <h6>Si está seguro que desea agregar un gateway (Raspberry) escriba el código que aparece en su equipo y presione el botón Agregar, de lo contrario presione Cerrar</h6>\
                          <input id="raspberry_code" class="form-control" placeholder="Ej: 0123456">');
                      });
                  });
                });
              }


          } else {
              console.log("No such document!");
          }
      }).catch(function(error) {
          console.log("Error getting document:", error);
      });        



      var check_tab = '';
      var check_element = '';
      var check_tab_element = '';

      //db.collection(user.email).doc("system")
      db.collection(system_access).doc(subsystem_access)
        .onSnapshot(function(doc) {

          //console.log(check_tab);

          $("#session_ok").html('\
            <ul id="navs_tab_id" class="nav nav-tabs" style="padding-top: 1%;"></ul>\
            <div id="tabs_content_id" class="tab-content" style="padding-top: 1%;"></div>');

          $("#content_edit").html('\
            <table class="table table-responsive table-hover" style="margin-bottom: 0px;">\
              <tr>\
                <td><i data-toggle="modal" data-target="#modal_add_system" id="add_new_system" class="fas fa-plus-circle"></i></td>\
                <td colspan="5"></td>\
              </tr>\
            </table>\
            <table class="table table-responsive table-hover" id="system_treeview"></table>');

          $("#add_new_system").click(function() {
            $("#content_add_system").html('\
              <h6>Si está seguro que desea agregar un subsistema escriba el nombre y presione el botón Agregar, de lo contrario presione Cerrar</h6>\
              <input id="enter_add_system" class="form-control" placeholder="Ej: Luces">');
          });

          $("#delete_principal_system").click(function() {
            $("#content_delete_principal_system").html('\
              <h6>Si está seguro que desea eliminar el sistema <strong>"'+subsystem_access+'"</strong> presione el botón Eliminar, de lo contrario presione Cerrar</h6>');
          });




          //console.log("Current data: ", doc.data());
          var data = doc.data();
          var systems = Object.keys(data);
          var system_val = Object.values(data);
          //console.log(data["luces"]);
          var check_first_time = 0;
          for(var i = 0; i < systems.length; i++){
            if(systems[i] != "admin"){
              //console.log(systems[i]);

              var active = '';

              if(check_tab == ''){
                if(check_first_time == 0){
                  active = 'active';
                }
                else{
                  active = '';
                }
              }
              else{
                if(check_tab == systems[i]){
                  active = 'active';
                }
                else{
                  active = '';
                }
              }

              $("#navs_tab_id").append('<li id="li_'+systems[i].split(' ').join('_') +'" class="nav-item" style="padding-top: 1%;"><a href="" data-target="#'+systems[i].split(' ').join('_') +'" data-toggle="tab" class="nav-link small text-uppercase '+active+'" style="color:rgba(2, 171, 169, 1);">'+systems[i]+'</a></li>');

              var active_show = '';

              if(check_tab == ''){
                if(check_first_time == 0){
                  check_tab = systems[i];
                  active_show = 'active show';
                }
                else{
                  active_show = '';
                }
              }
              else{
                if(check_tab == systems[i]){
                  active_show = 'active show';
                }
                else{
                  active_show = '';
                }
              }
              
              $("#tabs_content_id").append('<div class="tab-pane '+active_show+'" id="'+systems[i].split(' ').join('_')+'"><div class="row" id="2'+systems[i].split(' ').join('_')+'"></div></div>');

              $("#system_treeview").append('\
                   <tr>\
                     <td><i style="font-size:12px;" id="plus_system_'+systems[i].split(' ').join('_')+'" data-toggle="collapse" data-target="#subsystem_'+systems[i].split(' ').join('_')+'" class="far fa-plus-square clickable"></i></td>\
                     <td colspan="3">'+systems[i]+'</td>\
                     <td><i data-toggle="modal" data-target="#modal_delete_system" system_id ="'+systems[i]+'" id="trush_system_'+systems[i].split(' ').join('_')+'" class="far fa-trash-alt" style="font-size:12px;"></i></td>\
                     <td><i data-toggle="modal" data-target="#modal_add_subsystem" system_id ="'+systems[i]+'" id="add_subsystem_'+systems[i].split(' ').join('_')+'" class="fas fa-plus-circle" style="font-size:12px;"></i></td>\
                  </tr>\
                ');

              //console.log(access_user);

              if(access_user == 'admin'){
                $("#2"+systems[i].split(' ').join('_')).append('\
                  <div class="col-lg-12">\
                    <i data-toggle="modal" data-target="#modal_add_subsystem" system_id ="'+systems[i]+'" id="add_subsystem_'+systems[i].split(' ').join('_')+'" class="fas fa-plus-circle" style="font-size:18px;"></i>\
                    &nbsp\
                    <i data-toggle="modal" data-target="#modal_delete_system" system_id ="'+systems[i]+'" id="trush_system_'+systems[i].split(' ').join('_')+'" class="far fa-trash-alt" style="font-size:18px;"></i>\
                  </div>');
              }

              $("#system_treeview").append('\
                <tbody id="subsystem_'+systems[i].split(' ').join('_')+'" class="collapse"></tbody>\
                ');

              $("#add_subsystem_"+systems[i].split(' ').join('_')).click(function() {
                //console.log($(this).attr('id'));
                //console.log($(this).attr('system_id'));
                var system = $(this).attr('system_id');

                $("#content_add_subsystem").html('\
                  <h6 id="id_contente_add_subsystem" id_contente_add_subsystem="'+system+'">Si está seguro que desea agregar un elemento al subsistema <strong>"'+system+'"</strong> escriba el nombre del elemento y presione el botón Agregar, de lo contrario presione Cerrar</h6>\
                  <input id="enter_add_subsystem" system_id="'+system+'" class="form-control" placeholder="Ej: Luces Dormitorio">');
              });

              $("#trush_system_"+systems[i].split(' ').join('_')).click(function() {
                //console.log($(this).attr('id'));
                //console.log($(this).attr('system_id'));
                var system = $(this).attr('system_id');

                $("#content_delete_system").html('\
                  <h6 id="id_contente_delete_s" id_contente_delete_system="'+system+'">Si está seguro que desea eliminar el subsistema <strong>"'+system+'"</strong> presione el botón Eliminar, de lo contrario presione Cerrar</h6>');
              });

              $("#plus_system_"+systems[i].split(' ').join('_')).click(function() {
                if($(this).attr('class') == 'far fa-plus-square clickable' || $(this).attr('class') == 'far fa-plus-square clickable collapsed'){
                  $(this).attr({
                    "class" : "far fa-minus-square clickable"
                  })
                }
                else{
                  $(this).attr({
                    "class" : "far fa-plus-square clickable"
                  })
                }
              });  

              $("#li_"+systems[i].split(' ').join('_')).click(function() {
                check_tab = $(this).text();
                //alert($(this).text());
              });

              var subsystem =  Object.keys(system_val[i]);
              var subsystem_val = Object.values(system_val[i]);
              for(var j = 0; j < subsystem.length; j++){
                //console.log(subsystem[j]);
                //console.log("state: " + data[systems[i]][subsystem[j]]["state"]);

                var color_state = "";

                if(data[systems[i]][subsystem[j]]["state"]){
                  color_state = "color:white;background-color: rgba(2, 171, 169, 1)";
                }
                else{
                  color_state = "color:white;background-color: rgba(5, 119, 170, 1)";
                }

                if(access_user == 'admin'){
                  $("#2"+systems[i].split(' ').join('_')).append('\
                    <div class="col-lg-6" style="margin-top:10px;">\
                      <table class="table table-responsive table-hover" style="margin:0;padding:0;width:100%;">\
                        <tr style="margin:0;padding:0;width:100%;">\
                          <td colspan=11 style="margin:0;padding:0;width:100%;"><button type="button" class="btn btn-default" id="'+systems[i].split(' ').join('_')+'_'+subsystem[j].split(' ').join('_')+'" style="'+color_state+';padding: 10px 15px 10px 15px; border-radius: 4px; margin-top: 0px;width: 100%;">'+subsystem[j]+'</button></td>\
                          <td><i data-toggle="modal" data-target="#modal_delete_subsystem" system_id="'+systems[i]+'" subsystem_id="'+subsystem[j]+'" id="trush_subsystem_'+systems[i].split(' ').join('_')+'_'+subsystem[j].split(' ').join('_')+'" style="font-size:22px;padding-top: 0px;" class="far fa-trash-alt"></i></td>\
                        </tr>\
                      </table>\
                    </div>');
                }
                else{
                  $("#2"+systems[i].split(' ').join('_')).append('\
                    <div class="col-lg-6" style="margin-top:10px;">\
                      <button type="button" class="btn btn-default" id="'+systems[i].split(' ').join('_')+'_'+subsystem[j].split(' ').join('_')+'" style="'+color_state+';padding: 10px 15px 10px 15px; border-radius: 4px; margin-top: 0px;width: 100%;">'+subsystem[j]+'</button>\
                    </div>');
                }

                $("#subsystem_"+systems[i].split(' ').join('_')).append('\
                    <tr>\
                      <td></td>\
                      <td><i id="plus_subsystem_'+systems[i].split(' ').join('_')+'_'+subsystem[j].split(' ').join('_')+'" style="font-size:12px;" data-toggle="collapse" data-target=".element_'+systems[i].split(' ').join('_')+'_'+subsystem[j].split(' ').join('_')+'" class="far fa-plus-square clickable"></i></td>\
                      <td colspan="2">'+subsystem[j]+'</td>\
                      <td><i data-toggle="modal" data-target="#modal_delete_subsystem" system_id="'+systems[i]+'" subsystem_id="'+subsystem[j]+'" id="trush_subsystem_'+systems[i].split(' ').join('_')+'_'+subsystem[j].split(' ').join('_')+'" style="font-size:12px;" class="far fa-trash-alt"></i></td>\
                    </tr>\
                    ');

                $("#trush_subsystem_"+systems[i].split(' ').join('_')+'_'+subsystem[j].split(' ').join('_')).click(function() {
                  //console.log($(this).attr('id'));
                  //console.log($(this).attr('system_id'));
                  //console.log($(this).attr('subsystem_id'));
                  var system = $(this).attr('system_id');
                  var subsystem = $(this).attr('subsystem_id');
                  $("#content_delete_subsystem").html('\
                    <h6 id="id_contente_delete_sub" id_contente_delete_system="'+system+'" id_contente_delete_subsystem="'+subsystem+'">Si está seguro que desea eliminar el elemento <strong>"'+subsystem+'"</strong> del subsistema <strong>"'+system+'"</strong> presione el botón Eliminar, de lo contrario presione Cerrar</h6>');
                });

                $("#plus_subsystem_"+systems[i].split(' ').join('_')+'_'+subsystem[j].split(' ').join('_')).click(function() {
                  if($(this).attr('class') == 'far fa-plus-square clickable' || $(this).attr('class') == 'far fa-plus-square clickable collapsed'){
                    $(this).attr({
                      "class" : "far fa-minus-square clickable"
                    })
                  }
                  else{
                    $(this).attr({
                      "class" : "far fa-plus-square clickable"
                    })
                  }
                }); 

                var subsubsystem = Object.keys(subsystem_val[j]);
                
                for(var n = 0; n < subsubsystem.length; n++){
                  //id="data_expanded_'+systems[i].split(' ').join('_')+'_'+subsystem[j].split(' ').join('_')+'_'+subsubsystem[n].split(' ').join('_')+'"

                  var value_n = data[systems[i]][subsystem[j]][subsubsystem[n]];

                  if(value_n.toString()=='1'){value_n = 'on';}
                  if(value_n.toString()=='0'){value_n = 'off';}

                  $("#subsystem_"+systems[i].split(' ').join('_')).append('\
                    <tr class="element_'+systems[i].split(' ').join('_')+'_'+subsystem[j].split(' ').join('_')+' collapse">\
                      <td colspan="2"></td>\
                      <td>&nbsp;</td> \
                      <td>'+subsubsystem[n]+': '+value_n+'</td>\
                      <td><i data-toggle="modal" data-target="#modal_edit_subsubsystem" system_id="'+systems[i]+'" subsystem_id="'+subsystem[j]+'" subsubsystem_id="'+subsubsystem[n]+'" id="edit_element_'+systems[i].split(' ').join('_')+'_'+subsystem[j].split(' ').join('_')+'_'+subsubsystem[n].split(' ').join('_')+'" style="font-size:12px;" class="far fa-edit"></i></td>\
                    </tr>');
                  $("#edit_element_"+systems[i].split(' ').join('_')+'_'+subsystem[j].split(' ').join('_')+'_'+subsubsystem[n].split(' ').join('_')).click(function() {
                    var system = $(this).attr('system_id');
                    var subsystem = $(this).attr('subsystem_id');
                    var subsubsystem = $(this).attr('subsubsystem_id');
                    var value = data[system][subsystem][subsubsystem];
                    get_select_value = value;

                    var list_options = '';

                    if(subsubsystem == 'io'){
                      if(value=='input'){
                        list_options = '\
                        <select id="select_edit" system_id="'+system+'" subsystem_id="'+subsystem+'" subsubsystem_id="'+subsubsystem+'" class="custom-select custom-select-sm">\
                          <option selected="selected">input</option>\
                          <option>output</option>\
                        </select>';
                      }
                      else{
                        list_options = '\
                        <select id="select_edit" system_id="'+system+'" subsystem_id="'+subsystem+'" subsubsystem_id="'+subsubsystem+'" class="custom-select custom-select-sm">\
                          <option>input</option>\
                          <option selected="selected">output</option>\
                        </select>';
                      }
                    }
                    if(subsubsystem == 'point'){
                      var select = '';
                      list_options = '<select id="select_edit" system_id="'+system+'" subsystem_id="'+subsystem+'" subsubsystem_id="'+subsubsystem+'" class="custom-select custom-select-sm">';
                      for(var k = 0; k < 9; k ++){
                        if(parseInt(value[1]) == k){
                          select = 'selected="selected"';
                        }
                        else{
                          select = '';
                        }
                        list_options = list_options + '<option value= "D'+k+'" '+select+'>D'+k+'</option>';
                      }
                      list_options = list_options + '</select>';
                    }
                    if(subsubsystem == 'state'){
                      if(value==1){
                        list_options = '\
                        <select id="select_edit" system_id="'+system+'" subsystem_id="'+subsystem+'" subsubsystem_id="'+subsubsystem+'" class="custom-select custom-select-sm">\
                          <option selected="selected">on</option>\
                          <option>off</option>\
                        </select>';
                      }
                      else{
                        list_options = '\
                        <select id="select_edit" system_id="'+system+'" subsystem_id="'+subsystem+'" subsubsystem_id="'+subsubsystem+'" class="custom-select custom-select-sm">\
                          <option>on</option>\
                          <option selected="selected">off</option>\
                        </select>';
                      }
                    }
                    if(subsubsystem == 'type'){
                      if(value=='digital'){
                        list_options = '\
                        <select id="select_edit" system_id="'+system+'" subsystem_id="'+subsystem+'" subsubsystem_id="'+subsubsystem+'" class="custom-select custom-select-sm">\
                          <option selected="selected">digital</option>\
                          <option>analog</option>\
                        </select>';
                      }
                      else{
                        list_options = '\
                        <select id="select_edit" system_id="'+system+'" subsystem_id="'+subsystem+'" subsubsystem_id="'+subsubsystem+'" class="custom-select custom-select-sm">\
                          <option>digital</option>\
                          <option selected="selected">analog</option>\
                        </select>';
                      }
                    }
                    if(subsubsystem == 'endpoint'){
                      if(value=='XBEE'){
                        list_options = '\
                        <select id="select_edit" system_id="'+system+'" subsystem_id="'+subsystem+'" subsubsystem_id="'+subsubsystem+'" class="custom-select custom-select-sm">\
                          <option selected="selected">XBEE</option>\
                          <option>RF</option>\
                        </select>';
                      }
                      else{
                        list_options = '\
                        <select id="select_edit" system_id="'+system+'" subsystem_id="'+subsystem+'" subsubsystem_id="'+subsubsystem+'" class="custom-select custom-select-sm">\
                          <option>XBEE</option>\
                          <option selected="selected">RF</option>\
                        </select>';
                      }
                    }
                    if(subsubsystem == 'direction'){
                      list_options = '<input id="select_edit" system_id="'+system+'" subsystem_id="'+subsystem+'" subsubsystem_id="'+subsubsystem+'" class="form-control" placeholder="'+value+'">';
                    }
                    if(subsubsystem == 'command'){
                      list_options = '<input id="select_edit" system_id="'+system+'" subsystem_id="'+subsystem+'" subsubsystem_id="'+subsubsystem+'" class="form-control" placeholder="'+value+'">';
                    }

                    $("#content_edit_subsubsystem").html('\
                      <div class="col-md-1"></div>\
                      <div class="col-md-10">\
                        <table class="table table-responsive table-hover">\
                          <tr>\
                            <td><i style="font-size:12px;" class="far fa-minus-square"></i></td>\
                            <td colspan="4">'+system+'</td>\
                          </tr>\
                          <tr>\
                            <td></td>\
                            <td><i style="font-size:12px;" class="far fa-minus-square"></i></td>\
                            <td colspan="3">'+subsystem+'</td>\
                          </tr>\
                          <tr>\
                            <td></td>\
                            <td></td>\
                            <td><i style="font-size:12px;" class="far fa-minus-square"></i></td>\
                            <td colspan="2">'+subsubsystem+'</td>\
                          </tr>\
                          <tr>\
                            <td></td>\
                            <td></td>\
                            <td></td>\
                            <td><i style="font-size:12px;" class="far fa-minus-square"></i></td>\
                            <td>'+list_options+'</td>\
                          </tr>\
                        </table>\
                      </div>');
                  });
                }
                $("#"+systems[i].split(' ').join('_')+'_'+subsystem[j].split(' ').join('_')).click(function(){
                  check_element = $(this).text();
                  check_tab_element = check_tab.split(' ').join('_') + '_' + check_element.split(' ').join('_');
                  //alert(check_tab_element);
                  var value = 0;
                  if(data[check_tab.split('_').join(' ')][check_element.split('_').join(' ')]["state"] == 0){
                    value = 1;
                  }
                  else{
                    value = 0;
                  }
                  //db.collection(user.email).doc("system").update({
                  db.collection(system_access).doc(subsystem_access).update({
                      [check_tab.split('_').join(' ') +'.' + check_element.split('_').join(' ') + '.state']: value
                  }).catch(function(error) {
                    // Handle Errors here.
                    var errorCode = error.code;
                    var errorMessage = error.message;

                    console.log(errorMessage);
                    // ...
                  });
                });
              }
              check_first_time = check_first_time + 1;
            }
          }
        },function(error) {
          var errorCode = error.code;
          var errorMessage = error.message;

          console.log(errorMessage);


            $("#session_ok").html('\
            <div class="alert alert-danger" role="alert">\
              <p> Error: "'+ errorMessage +'" </p>\
            </div>');

            //window.location.replace("enter_create_system.html");
          });

    } else {
    $("#session_ok").hide(); 
      window.location.replace("login.html");
    }
  });
});