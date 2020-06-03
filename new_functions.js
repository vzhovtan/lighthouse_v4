$(document).ready(function(){
  console.log("new function - version 10")
  clear_all()
  clear_and_hide_containers()
  get_collection_list()

  $('#collections').on( 'click', 'li', function() {
    clear_and_hide_containers()
    $("#about").hide()
    $("#collections > li").removeClass("highlight")
    $(this).addClass("highlight")
    let collection_name = $( this ).text().toLowerCase()
    if (collection_name.includes('draft')){
      $("#container_platform").addClass("container--draft")
      $("#container_release").addClass("container--draft")
      $("#container_component").addClass("container--draft")
    } else{
      $("#container_platform").addClass("container--platform_release_prod")
      $("#container_release").addClass("container--platform_release_prod")
      $("#container_component").addClass("container--component_prod")
    }
    let inputs = {"action":"get_collection_data", "collection":collection_name}
    let post_data = {name: task_name, input: inputs}
    $("#container_platform").show()
    get_platform_list(collection_name, post_data)
  })

  $('#platform').on( 'click', 'button', function() {
    $("#about").hide()
    $("#release").empty()
    $("#container_release").hide()
    $("#component").empty()
    $("#platform > button").removeClass("btn--highlight")
    $(this).addClass("btn btn--highlight")
    let collection_name = $( this ).attr("id").toLowerCase()
    let platform_name = $( this ).text().toLowerCase()
    $("#container_component").show()
    if(platform_name.includes('create')){
      create_new_platform(collection_name)
    } else {
      get_component_list(collection_name, platform_name)
    }
  })

  $('#component').on( 'click', 'button', function() {
    $("#about").hide()
    $("#release").empty()
    $("#component > button").removeClass("btn--highlight")
    $(this).addClass("btn btn--highlight")
    let collection_name = $( this ).attr("id").toLowerCase().split("_")[0]
    let platform_name = $( this ).attr("id").toLowerCase().split("_")[1]
    let component_name = $( this ).text().toLowerCase()
    $("#container_release").show()
    if(component_name.includes('create')){
      create_new_component(collection_name, platform_name)
    } else {
      get_release_list(collection_name, platform_name, component_name)
    }
  })

  $('#release').on( 'click', 'button', function() {
    clear_all()
    $("#release > button").removeClass("btn--highlight")
    $(this).addClass("btn btn--highlight")
    let collection_name = $( this ).attr("id").toLowerCase().split("_")[0]
    let platform_name = $( this ).attr("id").toLowerCase().split("_")[1]
    let component_name = $( this ).attr("id").toLowerCase().split("_")[2]
    let release_name = $( this ).text().toLowerCase()
    get_content(collection_name, platform_name, release_name, component_name)
  })

  $( document ).ajaxStart(function() {
    $("#loading").show()
  })

  $( document ).ajaxStop(function() {
    $("#loading").hide()
  })

});

let link = '/api/v2/jobs/lighthouse_v4_new_functions'
let task_name = "lighthouse_v4_new_functions"
let admin_buttons = ["Preview", "View command diff", "View link diff", "Approve document", "Delete document"]
let user_buttons = ["Preview", "Modify", "Submit"]

function create_new_platform(collection_name){
  console.log("Create new platform function started" + collection_name)
}

function create_new_component(collection_name, platform_name) {
  console.log("Create new component function started" + collection_name + platform_name)
}

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