$(document).ready(function(){
  init();

  $('#1').click(function() {
      $('#about').hide();
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
  });

  $('#5').click(function() {
      $('#about').show();
      init();
  });

});

var adm_btns = ["222", "222","222","222","222","222","222","222","222","222","222","222","222","222","222","222","222","222",
"222","222","222","222","222","222","222","222","222","222","222","222","222","222","222","222","222","222","222","222","222","222",
"222","222","222","222","222","222","222","222","222","222","222","222","222","222","222","222","222","222","222","222","222","222"];
