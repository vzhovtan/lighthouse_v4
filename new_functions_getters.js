console.log("new function getters - version Jun5")

function get_collection_list(){
  //for the debugging, applying the static list of collection to save time yet
  console.log("static list is being used for collection list")
  static_list.forEach(function(item){
    $("#collections").append("<li class='sidebar__item' id='" + item + "'><a>" + item.toUpperCase() + "</a></li>")
  })
  // console.log("get_collection_list started")
  // let inputs = {"action":"get_collection_list"}
  // let post_data = {name: task_name, input: inputs}
  // $.post({url: link, dataType: "json", data: post_data})
  // .done(function(result){
  //   if(result.data.variables._0){
  //     result.data.variables._0.forEach(function(item){
  //       $("#collections").append("<li class='sidebar__item' id='" + item + "'><a>" + item.toUpperCase() + "</a></li>")
  //     })
  //   }
  // });
  }
   
function get_platform_list(collection_name, post_data){
  //for the debugging
  $("#loading").show()
  //remove above line after deugging
  console.log("get_platform_list started --> getting collection data first")
  $.post({url: link, dataType: "json", data: post_data})
    .done(function(result){
    if(result.data.variables._0){
      //for the debugging
      $("#loading").hide()
      //remove above line after deugging
      collection_data = result.data.variables._0
      let platform_list = []
      collection_data.forEach(function(item){
        if(!platform_list.includes(item.platform)){
            platform_list.push(item.platform)
        }
      })
      platform_list.sort()
      console.log(platform_list) 
      if (!collection_name.includes('draft')){
        $("#platform").append("<button class='btn btn--new' id='" + collection_name + "'>" + "Create new platform" + "</button>")
      }
      platform_list.forEach(function(item){
        $("#platform").append("<button class='btn btn--platform' id='" + collection_name + "'>" + item + "</button>")
      }) 
    }
  });
}
  
function get_component_list(collection_name, platform_name){
  console.log("get_component_list started --> using collection_data")
  let component_list = []
  collection_data.forEach(function(item){
    if(item.platform == platform_name){
      if(!component_list.includes(item.component)){
        component_list.push(item.component)
      }
    }  
  })
  component_list.sort()
  console.log(component_list)
  if (!collection_name.includes('draft')){
    $("#component").append("<button class='btn btn--new' id='" + collection_name + "_" + platform_name + "'>" + "Create new platform" + "</button>")
  }
  component_list.forEach(function(item){
    $("#component").append("<button class='btn btn--component' id='" + collection_name + "_" + platform_name + "'>" + item + "</button>")
  })
}
  
function get_release_list(collection_name, platform_name, component_name){
  console.log("get_release_list started --> using collection_data")
  let release_list = []
  collection_data.forEach(function(item){
    if(item.platform == platform_name){
      if(item.component == component_name){
        if (!release_list.includes(item.release)){
        release_list.push(item.release)
        }
      }
    }  
  })
  release_list.sort()
  console.log(release_list)
  $("#release").append("<button class='btn btn--release' id='" + collection_name + "_" + platform_name + "_" + component_name + "'>" + "Release Independent" + "</button>")
  release_list.forEach(function(item){
    if (!item.includes("independent")){
      $("#release").append("<button class='btn btn--release' id='" + collection_name + "_" + platform_name + "_" + component_name + "'>" + item + "</button>")
    }
  })
}

function get_content(collection_name, platform_name, release_name, component_name){
  console.log("get_content started --> using collection_data")
  console.log(collection_name, platform_name, release_name, component_name)
  let command_list = []
  let link_list = []
  collection_data.forEach(function(item){
    if(item.platform == platform_name && item.component == component_name && item.release == release_name){
      command_list.push(item.commands)
      link_list.push(item.links)
    }  
  })
  console.log(command_list)
  console.log(link_list)
  $("#current_output").empty()
  $("#current_output_section").show()
  let output= "<br><h6>" + platform_name + " - " + component_name + " - " + release_name + "</h6><br>"
  if (command_list[0]){
    output += "<br><h6>Command list</h6><br>"
    command_list[0].forEach(function(item){    
      output += item + "<br>"
    })
  }
  if (link_list[0]){
    output += "<br><h6>Link list</h6><br>"
    link_list[0].forEach(function(item){    
      output += item + "<br>"
    })
  }
  console.log(output)
  $("#current_output").html(output)
  if (collection_name.toLowerCase().includes('draft')){
    $("#button_section").show()
    admin_buttons.forEach(function(item){
      $("#admin_button").append("<button class='btn btn--action'id='" + collection_name + "_" + platform_name + "_" + component_name + "_" + release_name + "'>" + item + "</button>")
    })
  } else {
    $("#button_section").show()
    user_buttons.forEach(function(item){
      $("#admin_button").append("<button class='btn btn--action'id='" + collection_name + "_" + platform_name + "_" + component_name + "_" + release_name + "'>" + item + "</button>")
    })
  }
}

function get_preview(collection_name, platform_name, component_name,release_name){
  console.log("get_preview started --> using collection_data")
  console.log(collection_name, platform_name, release_name, component_name)
  let content = ""
  let header = "</div><br></div><div align='left'><img src='https://i.imgur.com/f0vBigO.jpg' alt=''></div>"
  let footer = "</div><br></div><div align='left'><a href='mailto:lighthouse-csone@cisco.com?Subject=Lighthouse%20Feedback' target='_top'>comments/questions/feedbacks</a></div><br>"
  let cmd_header = "<div><br><h6>Useful commands for troubleshooting: (some commands syntax could vary according to platform or version)</h6><br><br><div style='width:98%'"
  let link_header = "<br><h6>Support links: (links can become obsolete at any time, send feedback to help maintain accuracy)</h6><br><br>"
  content += header + "<h6 style='text-align:center'>" + platform_name + " - " + component_name + " - " + release_name + "</h6>"

  let command_list = []
  let link_list = []
  collection_data.forEach(function(item){
    if(item.platform == platform_name && item.component == component_name && item.release == release_name){
      command_list.push(item.commands)
      link_list.push(item.links)
    }  
  })
  if (command_list[0]){
    content += cmd_header
    for (item of command_list[0]) {
      if (item.includes("//")) {
          command_comment = item.split("//")
          newItem = "<span>" + command_comment[0] + "</span>" + "<span style='color:blue; float:right'>" + command_comment[1] + "</span>"
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

  if(link_list[0]){
    content += link_header
    for (item of link_list[0]) {
      if (item.includes("http")|| item.includes("https")) {
        if (item.includes (">")) {
          text_link = item.split(">");
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
  content += footer;
  $("#admin_button > button").removeClass("btn--highlight");
  user_view_modal = PaneOpen(content);
  user_view_modal.show();
}  

function get_cmd_diff(collection_name, platform_name, component_name,release_name){
  console.log("get_cmd_diff started")
}

function get_link_diff(collection_name, platform_name, component_name,release_name){
  console.log("get_link_diff started")
}
