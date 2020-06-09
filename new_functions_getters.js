console.log("new function getters - rel June 9")

function get_collection_list(){
  //fusing static list of collection
  console.log("static list is being used for collection list")
  static_list.forEach(function(item){
    $("#collections").append("<li class='sidebar__item' id='" + item + "'><a>" + item.toUpperCase() + "</a></li>")
  })
  //BDB call to get collection list
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
  $("#loading").show()
  console.log("get_platform_list called --> getting the entire collection data")
  $.post({url: link, dataType: "json", data: post_data})
    .done(function(result){
    if(result.data.variables._0){
      $("#loading").hide()
      collection_data = result.data.variables._0
      let platform_list = []
      collection_data.forEach(function(item){
        if(!platform_list.includes(item.platform)){
            platform_list.push(item.platform)
        }
      })
      platform_list.sort()
      console.log("Platform list", platform_list) 
      if (!collection_name.includes('draft')){
        $("#platform").append("<button class='btn btn--new' id='" + collection_name + "'>" + "Create new platform" + "</button>")
      }
      platform_list.forEach(function(item){
        $("#platform").append("<button class='btn btn--platform' id='" + collection_name + "'>" + item + "</button>")
      }) 
    }
    $("#container_platform").show()
  });
}
  
function get_component_list(collection_name, platform_name){
  console.log("get_component_list called --> using collection_data")
  let component_list = []
  collection_data.forEach(function(item){
    if(item.platform == platform_name){
      if(!component_list.includes(item.component)){
        component_list.push(item.component)
      }
    }  
  })
  component_list.sort()
  console.log("Component list", component_list)
  if (!collection_name.includes('draft')){
    $("#component").append("<button class='btn btn--new' id='" + collection_name + "_" + platform_name + "'>" + "Create new platform" + "</button>")
  }
  component_list.forEach(function(item){
    $("#component").append("<button class='btn btn--component' id='" + collection_name + "_" + platform_name + "'>" + item + "</button>")
  })
}
  
function get_release_list(collection_name, platform_name, component_name){
  console.log("get_release_list called --> using collection_data")
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
  console.log("Release list", release_list)
  release_list.forEach(function(item){
    if (item.includes("independent")){
      $("#release").append("<button class='btn btn--independent' id='" + collection_name + "_" + platform_name + "_" + component_name + "'>" + "Release Independent" + "</button>")
    }
  })
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
  console.log("Commands", command_list)
  console.log("Links", link_list)
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
  console.log("get_preview called --> using collection_data")
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
  console.log("get_cmd_diff started - calling BDB")
  clear_and_hide_current_output()
  clear_and_hide_command_section()
  clear_and_hide_link_section()
  clear_and_hide_modify_section()
  let new_command_list = []
  let current_command_list = []
  //taking data from draft collection
  let temp_list = []
  collection_data.forEach(function(item){
    if(item.platform == platform_name && item.component == component_name && item.release == release_name){
      temp_list.push(item.commands)
    }  
  })
  new_command_list = temp_list[0]
  if (new_command_list){
    new_command_list.forEach(function(item){
      $("#new_commands").text($("#new_commands").text() + item +"\n");
    });
  }  
  //taking the same data from non-draft collection
  let original_collection_name = collection_name.replace('-draft','')
  let inputs = {"action":"get_command_diff", "collection":original_collection_name, "platform":platform_name, "platform":platform_name, "component":component_name, "release":release_name}
  let post_data = {name: task_name, input: inputs}
  $("#loading").show()
  $.post({url: link, dataType: "json", data: post_data})
    .done(function(result){
      if(result.data.variables._0){
        current_command_list = result.data.variables._0
        if (current_command_list){
          current_command_list.forEach(function(item){
            $("#current_commands").text($("#current_commands").text() + item +"\n");
          });
        }
        console.log("New commands", new_command_list)
        console.log("Current commands", current_command_list)

        console.log("+++ current cmd   --- new cmd")
        let current_new = array_diff(current_command_list, new_command_list)
        console.log(current_new)
        console.log("+++ new cmd   --- current cmd")
        let new_current = array_diff(new_command_list, current_command_list)
        console.log(new_current)

        if (current_new){
          $("#diff_commands").text($("#diff_commands").text() + "+++ Current command --- New command" + "\n");
          current_new.forEach(function(item){
            $("#diff_commands").text($("#diff_commands").text() + item +"\n");
          });
        }
        if (new_current){
          $("#diff_commands").text($("#diff_commands").text() + "+++ New command --- Current command" +"\n");
          new_current.forEach(function(item){
            $("#diff_commands").text($("#diff_commands").text() + item +"\n");
          });
        }

        $("#loading").hide()
        $("#command_section").show()
      }
  });
}

function get_link_diff(collection_name, platform_name, component_name,release_name){
  console.log("get_link_diff started - calling BDB")
  clear_and_hide_current_output()
  clear_and_hide_command_section()
  clear_and_hide_link_section()
  clear_and_hide_modify_section()
  let new_link_list = []
  let current_link_list = []
  //taking data from draft collection
  let temp_list = []
  collection_data.forEach(function(item){
    if(item.platform == platform_name && item.component == component_name && item.release == release_name){
      temp_list.push(item.links)
    }  
  })
  new_link_list = temp_list[0]
  if (new_link_list){
    new_link_list.forEach(function(item){
      $("#new_links").text($("#new_links").text() + item +"\n");
    });
  }  
  //taking the same data from non-draft collection
  let original_collection_name = collection_name.replace('-draft','')
  let inputs = {"action":"get_link_diff", "collection":original_collection_name, "platform":platform_name, "platform":platform_name, "component":component_name, "release":release_name}
  let post_data = {name: task_name, input: inputs}
  $("#loading").show()
  $.post({url: link, dataType: "json", data: post_data})
    .done(function(result){
      if(result.data.variables._0){
        current_link_list = result.data.variables._0
        if (current_link_list){
          current_link_list.forEach(function(item){
            $("#current_links").text($("#current_links").text() + item +"\n");
          });
        }
        console.log("New Links", new_link_list)
        console.log("Current links", current_link_list)

        console.log("+++ current links   --- new links")
        let current_new = array_diff(current_link_list, new_link_list)
        console.log(current_new)
        console.log("+++ new links   --- current links")
        let new_current = array_diff(new_link_list, current_link_list)
        console.log(new_current)

        if (current_new){
          $("#diff_links").text($("#diff_links").text() + "+++ Current command --- New command" + "\n");
          current_new.forEach(function(item){
            $("#diff_links").text($("#diff_links").text() + item +"\n");
          });
        }
        if (new_current){
          $("#diff_links").text($("#diff_links").text() + "+++ New command --- Current command" +"\n");
          new_current.forEach(function(item){
            $("#diff_links").text($("#diff_links").text() + item +"\n");
          });
        }

        $("#loading").hide()
        $("#link_section").show()
      }
  });
}
