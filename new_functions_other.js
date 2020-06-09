console.log("new function other - rel June 9")

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

function modify_doc(collection_name, platform_name, component_name, release_name){
  console.log("Modify document function called" + collection_name + platform_name + component_name + release_name)
  clear_and_hide_current_output()
  clear_and_hide_command_section()
  clear_and_hide_link_section()
  clear_and_hide_modify_section()
  clear_and_hide_buttons()
  let command_list = []
  let link_list = []
  collection_data.forEach(function(item){
    if(item.platform == platform_name && item.component == component_name && item.release == release_name){
      command_list.push(item.commands)
      link_list.push(item.links)
    }  
  })
  console.log("Commands", command_list)
  console.log("Links", link_list)

  if (command_list[0]){
    command_list[0].forEach(function(item){    
      $("#modify_commands").text($("#modify_commands").text() + item +"\n");
    })
  }
  if (link_list[0]){
    link_list[0].forEach(function(item){    
      $("#modify_links").text($("#modify_links").text() + item +"\n");
    })
  }
  $("#modify_section").show()
  $("#button_section").show()
  submit_buttons.forEach(function(item){
    $("#admin_button").append("<button class='btn btn--action'id='" + collection_name + "_" + platform_name + "_" + component_name + "_" + release_name + "'>" + item + "</button>")
  })
}

function submit_changes(collection_name, platform_name, component_name,release_name, post_data){
  console.log("Submit changes function started" + collection_name + platform_name + component_name + release_name + post_data)
}

function cancel_changes(collection_name, platform_name, component_name,release_name){
  console.log("Cancel changes function started" + collection_name + platform_name + component_name + release_name)
  clear_and_hide_current_output()
  clear_and_hide_command_section()
  clear_and_hide_link_section()
  clear_and_hide_modify_section()
  clear_and_hide_buttons()
  $("#release > button").removeClass("btn--highlight")
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

function clear_and_hide_modify_section(){
  $("#modify_links").empty()
  $("#modify_commands").empty()
  $("#modify_section").hide()
}

function clear_all(){
  clear_and_hide_current_output()
  clear_and_hide_command_section()
  clear_and_hide_link_section()
  clear_and_hide_modify_section()
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

//custom functions below

function array_diff (a1, a2) {
  var a = [], diff = [];
  for (var i = 0; i < a1.length; i++) {
    a[a1[i]] = true;
  }
  for (var i = 0; i < a2.length; i++) {
    if (a[a2[i]]) {
      delete a[a2[i]];
    }
  }
  for (var k in a) {
    diff.push(k);
  }
  return diff;
}
