console.log("others - version 55")
function clear_and_hide_containers(){
  $("#platform").empty()
  $("#container_platform").hide()
  $("#component").empty()
  $("#container_component").hide()
  $("#release").empty()
  $("#container_release").hide()
  $("#platform > div").removeClass("highlight")
  $("#component > div").removeClass("highlight")
  $("#release > div").removeClass("highlight")
  $("#container_platform").removeClass()
  $("#container_component").removeClass()
  $("#container_release").removeClass()
}

function clear_and_hide_current_output(){
  $("#current_output").empty()
  $("#current_output_section").hide()
}

function clear_and_hide_command_section(){
  $("#new_commands").empty()
  $("#current_commands").empty()
  $("#diff_commands").empty()
  $("#command_section").hide()
}

function clear_and_hide_link_section(){
  $("#new_links").empty()
  $("#current_links").empty()
  $("#diff_links").empty()
  $("#link_section").hide()
}

function clear_and_hide_entered_data(){
  $("#entered_platform_input").empty()
  $("#entered_component").empty()
  $("#entered_commands").empty()
  $("#entered_links").empty()
  $("#entered_platform").hide()
}

function clear_and_hide_buttons(){
  $("#admin_button").empty()
  $("#button_section").hide()
}

function clear_all(){
  clear_and_hide_current_output()
  clear_and_hide_command_section()
  clear_and_hide_link_section()
  clear_and_hide_entered_data()
  clear_and_hide_buttons()
}

function PaneOpen(html){
  let user_view_modal = picoModal({
      content: html,
      overlayClose: true,
      closeButton: true,
      width: "90%",
  })
  return user_view_modal
}

function openModal(text){
    document.getElementById("modal-small").style.visibility = "visible"
    document.getElementById("subtitle").innerHTML = text
}

function closeModal(){
    document.getElementById("subtitle").innerHTML = ""
    document.getElementById("modal-small").style.visibility = "hidden"

}
