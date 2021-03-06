console.log("other.js - SEP.17")

function create_new_platform(collection_name){
  console.log("Create new platform function called " + " " + collection_name);
  clear_and_hide_containers();
  clear_and_hide_new_platform_feature_section();
  if (collection_name.includes("ios-xr")){
    $("#new_release_input").val("Release Independent");
  } else{
    $("#new_release_input").val("");
  }
  submit_buttons.forEach((item) => {
    $("#new_input_button").append("<button class='btn btn--action'id='" + collection_name + "'>" + item + "</button>")
  })
  $("#new_button_section").show();
  $("#new_form").show();
}

function create_new_feature(collection_name, platform_name) {
  console.log("Create new feature function called " + " " + collection_name + " " + platform_name);
  clear_and_hide_containers();
  clear_and_hide_new_platform_feature_section();
  $("#new_platform_input").val(platform_name);
  if (collection_name.includes("ios-xr")){
    $("#new_release_input").val("Release Independent");
  } else{
    $("#new_release_input").val("");
  }
  submit_buttons.forEach((item) => {
    $("#new_input_button").append("<button class='btn btn--action'id='" + collection_name + "'>" + item + "</button>")
  })
  $("#new_button_section").show();
  $("#new_form").show();
}

function cancel_changes_new(collection_name){
  console.log("Cancel changes new new function called " + " " + collection_name);
  clear_all();
  let inputs = {"action":"get_collection_data", "collection":collection_name}
  let post_data = {name: task_name, input: inputs}
  get_platform_list(collection_name, post_data)
}

function modify_doc(collection_name, platform_name, feature_name, release_name){
  console.log("Modify document function called " + " " + collection_name + " " + platform_name + " " + feature_name + " " + release_name)
  clear_all()
  let command_list = []
  let link_list = []
  collection_data.forEach((item) => {
    if(item.platform == platform_name && item.feature == feature_name && item.release == release_name){
      command_list.push(item.commands)
      link_list.push(item.links)
    }
  })
  console.log("Commands", command_list)
  console.log("Links", link_list)

  if (command_list[0]){
    command_list[0].forEach((item) => {
      $("#modify_commands").val($("#modify_commands").val() + item + "\n");
    })
  }
  if (link_list[0]){
    link_list[0].forEach((item) => {
      $("#modify_links").val($("#modify_links").val() + item +"\n");
    })
  }
  $("#modify_section").show()
  $("#button_section").show()
  submit_buttons.forEach((item) => {
    $("#admin_button").append("<button class='btn btn--action'id='" + collection_name + "_" + platform_name + "_" + feature_name + "_" + release_name + "_" + "modify" + "'>" + item + "</button>")
  })
}

function submit_changes_new(collection_name, platform_name, feature_name, release_name){
  $("#loading").show()
  console.log("Submit changes new function called " + " " + collection_name + " " + platform_name + " " + feature_name + " " + release_name);
  let cmd = $("#new_commands_input").val().split("\n")
  let links = $("#new_links_input").val().split("\n")
  let collection_to_submit = collection_name + "-draft"
  let inputs = {"action":"submit_changes_user", "collection":collection_to_submit, "platform":platform_name, "feature":feature_name, "release":release_name, "commands": cmd, "links": links}
  let post_data = {name: task_name, input: inputs}
  console.log("BDB input data ", post_data)
  $.post({url: link, dataType: "json", data: post_data})
    .done(function(result){
        if(result.data.variables._0){
          console.log("BDB result returned  ", result.data.variables._0)
          $("#loading").hide()
          openModal(result.data.variables._0)
          clear_all()
          let inputs = {"action":"get_collection_data", "collection":collection_name}
          let post_data = {name: task_name, input: inputs}
          get_platform_list(collection_name, post_data)
        }
    });
}

function submit_changes_user(collection_name, platform_name, feature_name, release_name, context){
  $("#loading").show()
  console.log("Submit changes for end-user function called " + " " + collection_name + " " + platform_name + " " + feature_name + " " + release_name + " " + context)
  let cmd = $("#modify_commands").val().split("\n")
  let links = $("#modify_links").val().split("\n")
  let collection_to_submit = collection_name + "-draft"
  let inputs = {"action":"submit_changes_user", "collection":collection_to_submit, "platform":platform_name, "feature":feature_name, "release":release_name, "commands": cmd, "links": links}
  let post_data = {name: task_name, input: inputs}
  console.log("BDB input data ", post_data)
  $.post({url: link, dataType: "json", data: post_data})
    .done(function(result){
        if(result.data.variables._0){
          console.log("BDB result returned  ", result.data.variables._0)
          $("#loading").hide()
          openModal(result.data.variables._0)
          clear_all()
          $("#release > button").removeClass("btn--highlight")
        }
    });
}


function submit_changes_admin(collection_name, platform_name, feature_name, release_name, context){
  $("#loading").show()
  console.log("Submit changes for admin function called " + " " + collection_name + " " + platform_name + " " + feature_name + " " + release_name + " " + context)
  if (context.include("modify")){
    console.log("context "+ context)
    let cmd = $("#modify_commands").val().split("\n")
    let links = $("#modify_links").val().split("\n")
  } else if (context.includes("getdiff")){
    console.log("context "+ context)
    let cmd = $("#new_commands").val().split("\n")
    let links = $("#new_links").val().split("\n")
  }
  let collection_to_submit = collection_name.replace('-draft','')
  let inputs = {"action":"submit_changes_admin", "collection":collection_to_submit, "platform":platform_name, "feature":feature_name, "release":release_name, "commands": cmd, "links": links}
  let post_data = {name: task_name, input: inputs}
  console.log("BDB input data ", post_data)
  $.post({url: link, dataType: "json", data: post_data})
    .done(function(result){
        if(result.data.variables._0){
          console.log("BDB result returned  ", result.data.variables._0)
          clear_all()
          clear_and_hide_containers()
          $("#platform > button").removeClass("btn--highlight")
          $("#feature > button").removeClass("btn--highlight")
          $("#release > button").removeClass("btn--highlight")
          $("#loading").hide()
          openModal(result.data.variables._0)
          let inputs = {"action":"get_collection_data", "collection":collection_name}
          let post_data = {name: task_name, input: inputs}
          get_platform_list(collection_name, post_data)
        }
    });
}


function cancel_changes(collection_name, platform_name, feature_name,release_name){
  console.log("Cancel changes function called " + " " + collection_name + " " + platform_name + " " + feature_name + " " + release_name + " ")
  clear_all()
  $("#release > button").removeClass("btn--highlight")
}


function approve_doc(collection_name, platform_name, feature_name, release_name){
  $("#loading").show()
  console.log("Approve document function called " + " " + collection_name + " " + platform_name + " " + feature_name + " " + release_name + " ")
  let collection_to_submit = collection_name.replace('-draft','')
  let inputs = {"action":"approve_document", "collection":collection_to_submit, "platform":platform_name, "feature":feature_name, "release":release_name}
  let post_data = {name: task_name, input: inputs}
  console.log("BDB input data ", post_data)
  $.post({url: link, dataType: "json", data: post_data})
    .done(function(result){
      if(result.data.variables._0){
        console.log("BDB result returned  ", result.data.variables._0)
        clear_all()
        clear_and_hide_containers()
        $("#platform > button").removeClass("btn--highlight")
        $("#feature > button").removeClass("btn--highlight")
        $("#release > button").removeClass("btn--highlight")
        $("#loading").hide()
        openModal(result.data.variables._0)
        let inputs = {"action":"get_collection_data", "collection":collection_name}
        let post_data = {name: task_name, input: inputs}
        get_platform_list(collection_name, post_data)
      }
  });
}


function delete_doc(collection_name, platform_name, feature_name, release_name){
  $("#loading").show()
  console.log("Delete document function called " + " " + collection_name + " " + platform_name + " " + feature_name + " " + release_name + " ")
  let inputs = {"action":"delete_document", "collection":collection_name, "platform":platform_name, "feature":feature_name, "release":release_name}
  let post_data = {name: task_name, input: inputs}
  $.post({url: link, dataType: "json", data: post_data})
    .done(function(result){
      if(result.data.variables._0){
        clear_all()
        clear_and_hide_containers()
        $("#platform > button").removeClass("btn--highlight")
        $("#feature > button").removeClass("btn--highlight")
        $("#release > button").removeClass("btn--highlight")
        $("#loading").hide()
        openModal(result.data.variables._0)
        let inputs = {"action":"get_collection_data", "collection":collection_name}
        let post_data = {name: task_name, input: inputs}
        get_platform_list(collection_name, post_data)
      }
  });
}


function preview (collection_name, platform_name, feature_name, release_name, context){
  console.log("Preview function called " + " " + collection_name + " " + platform_name + " " + feature_name + " " + release_name + " " + context)
  let cmd = []
  let links = []
  if (context.includes("modify")){
    cmd  = $("#modify_commands").val().split("\n")
    links = $("#modify_links").val().split("\n")
  } else if(context.includes("getdiff")){
    cmd  = $("#new_commands").val().split("\n")
    links = $("#new_links").val().split("\n")
  } else if(context.includes("newdata")){
    cmd  = $("#new_commands_input").val().split("\n")
    links = $("#new_links_input").val().split("\n")
  }
  console.log(cmd)
  console.log(links)
  let content = ""
  let header = "</div><br></div><div align='left'><img src='https://i.imgur.com/f0vBigO.jpg' alt=''></div>"
  let footer = "</div><br></div><div align='left'><a href='mailto:lighthouse-csone@cisco.com?Subject=Lighthouse%20Feedback' target='_top'>comments/questions/feedbacks</a></div><br>"
  let cmd_header = "<div><br><h6>Useful commands for troubleshooting: (some commands syntax could vary according to platform or version)</h6><br><br><div style='width:98%'"
  let link_header = "<br><h6>Support links: (links can become obsolete at any time, send feedback to help maintain accuracy)</h6><br><br>"
  content += header + "<h6 style='text-align:center'>" + platform_name + " --- " + feature_name + " --- " + release_name + "</h6>"

  if (cmd){
    content += cmd_header
    const cmds = Object.values(cmd)
    for (const item of cmds) {
      if (item.includes("//")) {
          command_comment = item.split("//")
          newItem = "<span>" + command_comment[0] + "</span>" + "<span style='color:blue float:right'>" + command_comment[1] + "</span>"
          content += newItem + "<br>"
      } else if (item.includes("Traces")) {
          content += "<br><span><h6>" + item + "</h6></span><br>"
      } else if (item.includes("Debugs")) {
          content += "<br><span><h6>" + item + "</h6></span><br>"
      } else if (item.includes("Techs:")) {
          content += "<br><span><h6>" + item + "</h6></span><br>"
      } else {
          content += "<span>" + item + "</span>" + "<br>"
      }
    }
  }

  if(links){
    content += link_header
    const lnks = Object.values(links)
    for (const item of lnks) {
      if (item.includes("http")|| item.includes("https")) {
        if (item.includes (">")) {
            text_link = item.split(">")
            content  += "<li><a href='" + text_link[1].trim() + "'target='_blank'>" + text_link[0] + "</a></li>"
        } else {
            content  += "<li><a href='" + item + "'target='_blank'>" + item + "</a></li>"
        }
      } else if (item.includes("@")) {
          content  += "<li><a href='mailto:" + item + "' target='_top'>Mailer : " + item + "</a></li>"
      } else {
          content += "<span>" + item + "</span>" + "<br>"
      }
    }
  }

  content += footer
  $("#admin_button > button").removeClass("btn--highlight")
  user_view_modal = PaneOpen(content)
  user_view_modal.show()
}

function update_stats(collection_name, platform_name, feature_name, release_name){
  console.log("Update stats function called " + " " + collection_name + " " + platform_name + " " + feature_name + " " + release_name + " ")
  let inputs = {"action":"update_stats", "collection":collection_name, "platform":platform_name, "feature":feature_name, "release":release_name}
  let post_data = {name: task_name, input: inputs}
  console.log("BDB input data ", post_data)
  $.post({url: link, dataType: "json", data: post_data})
    .done(function(result){
      if(result.data.variables._0){
        console.log("BDB result returned  ", result.data.variables._0)
      }
  });
}

//init and clear functions below
function clear_and_hide_containers(){
  $("#platform").empty()
  $("#container_platform").hide()
  $("#feature").empty()
  $("#container_feature").hide()
  $("#release").empty()
  $("#container_release").hide()
  $("#platform > div").removeClass("highlight")
  $("#feature > div").removeClass("highlight")
  $("#release > div").removeClass("highlight")
  $("#container_platform").removeClass()
  $("#container_release").removeClass()
  $("#container_feature").removeClass()
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
  $("#new_input_button").empty();
  $("#new_button_section").hide();
}


function clear_and_hide_modify_section(){
  $("#modify_links").val("")
  $("#modify_commands").val("")
  $("#modify_section").hide()
}


function clear_and_hide_new_platform_feature_section(){
  $("#new_platform_input").val("")
  $("#new_feature_input").val("")
  $("#new_release_input").val("")
  $("#new_commands_input").val("")
  $("#new_links_input").val("")
  $("#new_form").hide()
}


function clear_all(){
  clear_and_hide_current_output()
  clear_and_hide_command_section()
  clear_and_hide_link_section()
  clear_and_hide_modify_section()
  clear_and_hide_buttons()
  clear_and_hide_new_platform_feature_section()
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
