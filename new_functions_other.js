console.log("new function other - rel June 10.5")

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
      $("#modify_commands").val($("#modify_commands").val() + item +"\n");
    })
  }
  if (link_list[0]){
    link_list[0].forEach(function(item){    
      $("#modify_links").val($("#modify_links").val() + item +"\n");
    })
  }
  $("#modify_section").show()
  $("#button_section").show()
  submit_buttons.forEach(function(item){
    $("#admin_button").append("<button class='btn btn--action'id='" + collection_name + "_" + platform_name + "_" + component_name + "_" + release_name + "_" + "modify" + "'>" + item + "</button>")
  })
}


function preview (collection_name, platform_name, component_name, release_name, context){
  console.log("Preview function called" + collection_name + platform_name + component_name + release_name + context)
  let cmd = []
  let links = []
  if (context.includes("modify")){
    cmd  = $("#modify_commands").val().split("\n")
    links = $("#modify_links").val().split("\n")
  } else if(context.includes("getdiffcmd")){
    cmd  = $("#new_commands").val().split("\n")
  } else if(context.includes("getdifflink")){
    links = $("#new_links").val().split("\n")
  }
  console.log(cmd)
  console.log(links)
  let content = ""
  let header = "</div><br></div><div align='left'><img src='https://i.imgur.com/f0vBigO.jpg' alt=''></div>"
  let footer = "</div><br></div><div align='left'><a href='mailto:lighthouse-csone@cisco.com?Subject=Lighthouse%20Feedback' target='_top'>comments/questions/feedbacks</a></div><br>"
  let cmd_header = "<div><br><h6>Useful commands for troubleshooting: (some commands syntax could vary according to platform or version)</h6><br><br><div style='width:98%'"
  let link_header = "<br><h6>Support links: (links can become obsolete at any time, send feedback to help maintain accuracy)</h6><br><br>"
  content += header + "<h6 style='text-align:center'>" + platform_name + " --- " + component_name + " --- " + release_name + "</h6>"

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


function submit_changes(collection_name, platform_name, component_name, release_name, context){
  console.log("Submit changes function started" + collection_name + platform_name + component_name + release_name + context)
  let cmd = []
  let links = []
  if (context.includes("modify")){
    cmd  = $("#modify_commands").val().split("\n")
    links = $("#modify_links").val().split("\n")
  } else if(context.includes("getdiffcmd")){
    cmd  = $("#new_commands").val().split("\n")
  } else if(context.includes("getdifflink")){
    links = $("#new_links").val().split("\n")
  }
  let inputs = {"action":"submit_changes", "collection":collection_name, "platform":platform_name, "component":component_name, "release":release_name}
  let post_data = {name: task_name, input: inputs}
  console.log(cmd)
  console.log(links)
  console.log(post_data)
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
  $("#modify_links").val("")
  $("#modify_commands").val("")
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
