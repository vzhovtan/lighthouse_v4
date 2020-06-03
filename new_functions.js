$(document).ready(function(){
  //for the debugging
  $("#loading").hide()
  //remove above line after deugging
  console.log("new function - version Jun3")
  clear_all()
  clear_and_hide_containers()
  get_collection_list()

  $('#collections').on( 'click', 'li', function() {
    clear_all()
    clear_and_hide_containers()
    $("#about").hide()
    $("#collections > li").removeClass("highlight")
    $(this).addClass("highlight")
    let collection_name = $(this).text().toLowerCase()
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
    clear_all()
    $("#about").hide()
    $("#release").empty()
    $("#container_release").hide()
    $("#component").empty()
    $("#platform > button").removeClass("btn--highlight")
    $(this).addClass("btn btn--highlight")
    let collection_name = $(this).attr("id").toLowerCase()
    let platform_name = $(this).text().toLowerCase()
    $("#container_component").show()
    if(platform_name.includes('create')){
      create_new_platform(collection_name)
    } else {
      get_component_list(collection_name, platform_name)
    }
  })

  $('#component').on( 'click', 'button', function() {
    clear_all()
    $("#about").hide()
    $("#release").empty()
    $("#component > button").removeClass("btn--highlight")
    $(this).addClass("btn btn--highlight")
    let collection_name = $(this).attr("id").toLowerCase().split("_")[0]
    let platform_name = $(this).attr("id").toLowerCase().split("_")[1]
    let component_name = $(this).text().toLowerCase()
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
    let collection_name = $(this).attr("id").toLowerCase().split("_")[0]
    let platform_name = $(this).attr("id").toLowerCase().split("_")[1]
    let component_name = $(this).attr("id").toLowerCase().split("_")[2]
    let release_name = $(this).text().toLowerCase()
    get_content(collection_name, platform_name, release_name, component_name)
  })

  $('#admin_button').on( 'click', 'button', function() {
    $("#admin_button > button").removeClass("btn--highlight")
    $(this).addClass("btn btn--highlight")
    let collection_name = $(this).attr("id").toLowerCase().split("_")[0]
    let platform_name = $(this).attr("id").toLowerCase().split("_")[1]
    let component_name = $(this).attr("id").toLowerCase().split("_")[2]
    let release_name = $(this).attr("id").toLowerCase().split("_")[3]
    let action_name = $(this).text().toLowerCase()
    if (action_name.includes('preview')){
        get_preview(collection_name, platform_name, component_name,release_name)
    } else if (action_name.includes('command diff')){
        get_cmd_diff(collection_name, platform_name, component_name,release_name)
    } else if (action_name.includes('link diff')){
        get_link_diff(collection_name, platform_name, component_name,release_name)
    } else if (action_name.includes('approve')){
        let inputs = {}
        let post_data = {name: task_name, input: inputs};
        approve_doc(collection_name, platform_name, component_name,release_name, post_data)
    } else if (action_name.includes('delete')){
        let inputs = {}
        let post_data = {name: task_name, input: inputs};
        delete_doc(collection_name, platform_name, component_name,release_name, post_data)
    } else if (action_name.includes('modify')){
        let inputs = {}
        let post_data = {name: task_name, input: inputs};
        modify_doc(collection_name, platform_name, component_name,release_name, post_data)
    } else if (action_name.includes('submit')){
        let inputs = {}
        let post_data = {name: task_name, input: inputs};
        submit_changes(collection_name, platform_name, component_name,release_name, post_data)
    } else if (action_name.includes('cancel')){
        cancel_changes(collection_name, platform_name, component_name,release_name)
    }
  });

  $('#reload').click(function() {
    location.reload();
  });

  // $( document ).ajaxStart(function() {
  //   $("#loading").show()
  // })

  // $( document ).ajaxStop(function() {
  //   $("#loading").hide()
  // })

});

let link = '/api/v2/jobs/lighthouse_v4_new_functions'
let task_name = "lighthouse_v4_new_functions"
let admin_buttons = ["Preview", "View command diff", "View link diff", "Modify", "Approve document", "Delete document"]
let user_buttons = ["Preview", "Modify"]
let submit_buttons = ["Submit", "Cancel"]