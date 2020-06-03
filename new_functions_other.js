console.log("new function other - version Jun3")

function create_new_platform(collection_name){
  console.log("Create new platform function started" + collection_name)
}
  
function create_new_component(collection_name, platform_name) {
  console.log("Create new component function started" + collection_name + platform_name)
}

function approve_doc(collection_name, platform_name, component_name,release_name, post_data){
  console.log("Approve document function started" + collection_name + platform_name + component_name + release_name + post_data)
}

function delete_doc(collection_name, platform_name, component_name,release_name, post_data){
  console.log("Delete document function started" + collection_name + platform_name + component_name + release_name + post_data)
}

function modify_doc(collection_name, platform_name, component_name,release_name, post_data){
  console.log("Modify document function started" + collection_name + platform_name + component_name + release_name + post_data)
}

function submit_changes(collection_name, platform_name, component_name,release_name, post_data){
  console.log("Submit changes function started" + collection_name + platform_name + component_name + release_name + post_data)
}

function cancel_changes(collection_name, platform_name, component_name,release_name){
  console.log("Cancel changes function started" + collection_name + platform_name + component_name + release_name)
}

//init and clear functions below
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
  $("#container_release").removeClass()
  $("#container_component").removeClass()
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

function clear_and_hide_buttons(){
  $("#admin_button").empty()
  $("#button_section").hide()
}

function clear_all(){
  clear_and_hide_current_output()
  clear_and_hide_command_section()
  clear_and_hide_link_section()
  clear_and_hide_buttons()
}
  
//modal function below
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
  $("#modal-small").show()
  $("#subtitle").html(text)
}

function closeModal(){
  $("#modal-small").hide()
  $("#subtitle").empty()
}
