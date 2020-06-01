console.log("others - version 53");
function clear_and_hide_containers(){
  $("#platform").empty();
  $("#container_platform").hide();
  $("#component").empty();
  $("#container_component").hide();
  $("#release").empty();
  $("#container_release").hide();
  $("#platform > div").removeClass("highlight");
  $("#component > div").removeClass("highlight");
  $("#release > div").removeClass("highlight");
}

function clear_and_hide_current_output(){
  $("#current_output").empty();
  $("#current_output_section").hide();
}

function clear_and_hide_command_section(){
  $("#new_commands").empty();
  $("#current_commands").empty();
  $("#diff_commands").empty();
  $("#command_section").hide();
}

function clear_and_hide_link_section(){
  $("#new_links").empty();
  $("#current_links").empty();
  $("#diff_links").empty();
  $("#links_section").hide();
}

function clear_and_hide_entered_data(){
  $("#entered_platform_input").empty();
  $("#entered_component").empty();
  $("#entered_commands").empty();
  $("#entered_links").empty();
  $("#entered_platform").hide();
}

function clear_new_platform_fields(){
  $("#new_platform_input").val("");
  $("#new_component_input").val("");
  $("#commands").val("");
  $("#links").val("");
}

function clear_all(){
  clear_and_hide_current_output();
  clear_and_hide_command_section();
  clear_and_hide_link_section();
  clear_and_hide_entered_data();
  clear_new_platform_fields();
}

function PaneOpen(html){
  let user_view_modal = picoModal({
      content: html,
      overlayClose: true,
      closeButton: true,
      width: "90%",
  });
  return user_view_modal;
}

function openModal(text){
    document.getElementById("modal-small").style.visibility = "visible";
    document.getElementById("subtitle").innerHTML = text;
}

function closeModal(){
    document.getElementById("subtitle").innerHTML = "";
    document.getElementById("modal-small").style.visibility = "hidden"

}
