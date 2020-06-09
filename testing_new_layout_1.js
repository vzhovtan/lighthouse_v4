$(document).ready(function(){
  init();

  $('#1').click(function() {
      $('#about').hide();
      $("#container_platform").addClass("container--platform_release")
      $("#container_platform").show();
      $("#container_component").show();
      $("#container_release").show();
      adm_btns.forEach(function(item){
         $("#container_platform").append("<button class='btn btn--platform'>" + item + "</button>");
      });
      adm_btns.forEach(function(item){
         $("#container_component").append("<button class='btn btn--component'>" + item + "</button>");
      });
      adm_btns.forEach(function(item){
         $("#container_release").append("<button class='btn btn--release'>" + item + "</button>");
      });
  });

  $('#2').click(function() {
      $('#about').hide();
      $("#container_platform").show();
      $("#container_component").show();
      $("#current_output_section").show();
  });

  $('#3').click(function() {
      $('#about').hide();
      $("#command_section").show();
      $("#link_section").show();
      $("#button_section").show();
      test_array.forEach(function(item){
        $("#current_commands").text($("#current_commands").text() + item +"\n");
      });
      $("#new_commands").text(test_array)
  });

  $('#4').click(function() {
    $('#about').hide();
    $("#current_output").empty();
    $("#current_output_section").show();
    $("#current_output").show();
    console.log(test_array)
    let test = ""
    test_array.forEach(function(item){ 
        test += item + "<br>"
      })
    console.log(test)
    $("#current_output").html(test) 
});

  $('#5').click(function() {
      $('#about').show();
      init();
  });

});

let adm_btns = ["222", "222","222","222","222","222","222","222","222","222","222","222","222","222","222","222","222","222",
"222","222","222","222","222","222","222","222","222","222","222","222","222","222","222","222","222","222","222","222","222","222",
"222","222","222","222","222","222","222","222","222","222","222","222","222","222","222","222","222","222","222","222","222","222"];

let test_array = ["show logging", "show im database location all", "show interfaces", "show platform vm // ( Check if VM is up )"]