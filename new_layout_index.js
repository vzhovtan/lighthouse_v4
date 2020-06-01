$(document).ready(function(){
  console.log("index - version 55")
  clear_all()
  clear_and_hide_containers()
  get_collection_list()
  $("#collections").removeClass("highlight")

  $('#collections').on( 'click', 'li', function() {
    clear_all()
    clear_and_hide_containers()
    $("#about").hide()
    $("#collections > li").removeClass("highlight")
    $(this).addClass("highlight")
    let collection_name = $( this ).text().toLowerCase()
    let inputs = {"action":"get_platform_list", "collection":collection_name}
    let post_data = {name: task_name, input: inputs}
    if (collection_name.includes('draft')){
      $("#container_platform").addClass("container--draft")
      $("#container_release").addClass("container--draft")
      $("#container_component").addClass("container--draft")
    } else{
      $("#container_platform").addClass("container--platform_release_prod")
      $("#container_release").addClass("container--platform_release_prod")
      $("#container_component").addClass("container--component_prod")
    }
    $("#container_platform").show()
    get_platform_list(collection_name, post_data)
  })

  $('#platform').on( 'click', 'button', function() {
    clear_all()
    $("#about").hide()
    $("#release").empty()
    $("#container_release").hide()
    $("#component").empty()
    $("#container_component").show()
    $("#platform > button").removeClass("btn--highlight")
    $(this).addClass("btn btn--highlight")
    let collection_name = $( this ).attr("id").toLowerCase()
    let platform_name = $( this ).text().toLowerCase()
    if(!platform_name.includes('create')){
      let inputs = {"action":"get_component_list", "collection":collection_name, "platform":platform_name}
      let post_data = {name: task_name, input: inputs}
      get_component_list(collection_name, platform_name, post_data)
    } else {
      create_new_platform(collection_name)
    }
  })

  $('#component').on( 'click', 'button', function() {
      clear_all()
      $("#release").empty()
      $("#container_release").show()
      $("#component> button").removeClass("btn--highlight")
      $(this).addClass("btn btn--highlight")
      let collection_name = $( this ).attr("id").toLowerCase().split("_")[0]
      let platform_name = $( this ).attr("id").toLowerCase().split("_")[1]
      let component_name = $( this ).text().toLowerCase()
      let inputs = {"action":"get_release_list", "collection":collection_name, "platform":platform_name, "component":component_name}
      let post_data = {name: task_name, input: inputs}
      if(!component_name.includes('create')){
        get_release_list(collection_name, platform_name, component_name, post_data)
      } else {
        create_new_component(collection_name, platform_name)
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
      let inputs = {"action":"get_content_draft", "collection":collection_name, "platform":platform_name, "release":release_name, "component":component_name}
      let post_data = {name: task_name, input: inputs}
      get_content_draft(collection_name, platform_name, release_name, component_name, post_data)
  })

  $('#admin_button').on( 'click', 'button', function() {
    $("#admin_button > button").removeClass("btn--highlight")
    $(this).addClass("btn btn--highlight")
    let collection_name = $( this ).attr("id").toLowerCase().split("_")[0]
    let platform_name = $( this ).attr("id").toLowerCase().split("_")[1]
    let component_name = $( this ).attr("id").toLowerCase().split("_")[2]
    let release_name = $( this ).attr("id").toLowerCase().split("_")[3]
    let action_name = $( this ).text().toLowerCase()
    if (action_name.includes('approve')){
      console.log("Approve function")
      //let inputs = {"action":"approve", "collection":collection_name, "platform":platform_name, "release": release_name, "component": component_name}
      //let post_data = {name: task_name, input: inputs}
      //approve_content()
    } else if (action_name.includes('delete')){
      console.log("Delete function")
      // let inputs = {"action":"delete", "collection":collection_name, "platform":platform_name, "release": release_name, "component": component_name}
      // let post_data = {name: task_name, input: inputs}
      // delete_content(collection_name, platform_name, release_name, post_data)
    } else if (action_name.includes('modify')){
      console.log("Modify function")
      // let inputs = {"action":"get_diff", "collection":collection_name, "platform":platform_name, "release": release_name, "component": component_name}
      // let post_data = {name: task_name, input: inputs}
      // get_diff_data(post_data)          
    } else if (action_name.includes('submit')){
      console.log("Submit function")
      // let cmds_field = "#current_commands"
      // let lnks_field = "#current_links"
      // update_content(collection_name, platform_name, release_name, component_name, cmds_field, lnks_field)
    } else if (action_name.includes('command diff')){
      console.log("View command diff function")
      // let cmds_field = "#original_commands"
      // let lnks_field = "#original_links"
      // get_user_view(platform_name, release_name, component_name, cmds_field, lnks_field)
    } else if (action_name.includes('link diff')){
      console.log("View link diff function")
      // let cmds_field = "#original_commands"
      // let lnks_field = "#original_links"
      // get_user_view(platform_name, release_name, component_name, cmds_field, lnks_field)
    } else {
      console.log("Preview function")
      // let cmds_field = "#new_commands"
      // let lnks_field = "#new_links"
      // get_user_view(platform_name, release_name, component_name, cmds_field, lnks_field)
    }
  })

  $( document ).ajaxStart(function() {
    $("#loading").show()
  })

  $( document ).ajaxStop(function() {
    $("#loading").hide()
  })

  $('#reload').click(function() {
    location.reload()
  })

})

let link = '/api/v2/jobs/lighthouse_v41_backend'
let task_name = "lighthouse_v41_backend"
let admin_buttons = ["Preview", "View command diff", "View link diff", "Approve document", "Delete document"]
let user_buttons = ["Preview", "Modify", "Submit"]
