console.log("new function getters - AUG.26")

function get_collection_list(){
  //using static list of collection
  console.log("static list is being used for collection list")
  admin_collection_list.forEach((item) => {
    $("#collections").append("<li class='sidebar__item' id='" + item + "'><a>" + item.toUpperCase() + "</a></li>")
  })
}

function get_platform_list(collection_name, post_data){
  $("#loading").show()
  console.log("get_platform_list called --> getting the entire collection data and displaying the platform list only")
  $.post({url: link, dataType: "json", data: post_data})
    .done(function(result){
    if(result.data.variables._0){
      $("#loading").hide()
      collection_data = result.data.variables._0
      let platform_list = []
      collection_data.forEach((item) => {
        if(!platform_list.includes(item.platform)){
            platform_list.push(item.platform)
        }
      })
      platform_list.sort()
      console.log("Platform list", platform_list)
      if (!collection_name.includes('draft')){
        $("#platform").append("<button class='btn btn--new' id='" + collection_name + "'>" + "Create new platform" + "</button>")
      }
      platform_list.forEach((item) => {
        $("#platform").append("<button class='btn btn--platform' id='" + collection_name + "'>" + item + "</button>")
      })
    }
    $("#container_platform").show()
  });
}

function get_component_list(collection_name, platform_name){
  console.log("get_component_list called --> using collection_data variables saved before")
  let component_list = []
  collection_data.forEach((item) => {
    if(item.platform == platform_name){
      if(!component_list.includes(item.component)){
        component_list.push(item.component)
      }
    }
  })
  component_list.sort()
  console.log("Component list", component_list)
  if (!collection_name.includes('draft')){
    $("#component").append("<button class='btn btn--new' id='" + collection_name + "_" + platform_name + "'>" + "Create new component" + "</button>")
  }
  component_list.forEach((item) => {
    $("#component").append("<button class='btn btn--component' id='" + collection_name + "_" + platform_name + "'>" + item + "</button>")
  })
}

function get_release_list(collection_name, platform_name, component_name){
  console.log("get_release_list called --> using collection_data variables saved before")
  let release_list = []
  collection_data.forEach((item) => {
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
  release_list.forEach((item) => {
    if (item.includes("independent")){
      $("#release").append("<button class='btn btn--independent' id='" + collection_name + "_" + platform_name + "_" + component_name + "'>" + "Release Independent" + "</button>")
    }
  })
  release_list.forEach((item) => {
    if (!item.includes("independent")){
      $("#release").append("<button class='btn btn--release' id='" + collection_name + "_" + platform_name + "_" + component_name + "'>" + item + "</button>")
    }
  })
  document.getElementById("release").scrollIntoView();
}

function get_content(collection_name, platform_name, release_name, component_name){
  console.log("get_content called --> using collection_data variables saved before")
  console.log(collection_name, platform_name, release_name, component_name)
  let command_list = []
  let link_list = []
  collection_data.forEach((item) => {
    if(item.platform == platform_name && item.component == component_name && item.release == release_name){
      command_list = item.commands
      link_list = item.links
    }
  })
  $("#current_output").empty()
  $("#current_output_section").show()
  let output= "<br><h6>" + platform_name + " - " + component_name + " - " + release_name + "</h6><br>"
  if (command_list){
    output += "<br><h6>Command list</h6><br>"
    command_list.forEach((item) => {
      output += item + "<br>"
    })
  }
  if (link_list){
    output += "<br><h6>Link list</h6><br>"
    link_list.forEach((item) => {
      output += item + "<br>"
    })
  }
  $("#current_output").html(output)
  if (collection_name.toLowerCase().includes('draft')){
    $("#button_section").show()
    admin_buttons.forEach((item) => {
      $("#admin_button").append("<button class='btn btn--action'id='" + collection_name + "_" + platform_name + "_" + component_name + "_" + release_name + "_" + "draftcollection" + "'>" + item + "</button>")
    })
  } else {
    if (release_name.toLowerCase().includes('independent')){
      $("#button_section").show()
      user_buttons_rel_independent.forEach((item) => {
        $("#admin_button").append("<button class='btn btn--action'id='" + collection_name + "_" + platform_name + "_" + component_name + "_" + release_name + "_" + "independentrelease" + "'>" + item + "</button>")
      })
    } else {
      $("#button_section").show()
      user_buttons_all_releases.forEach((item) => {
        $("#admin_button").append("<button class='btn btn--action'id='" + collection_name + "_" + platform_name + "_" + component_name + "_" + release_name + "_" + "regularrelease" + "'>" + item + "</button>")
      })
    }
  }
  let inputs = {"action":"update_stats", "collection":collection_name, "platform":platform_name, "release":release_name, "component":component_name}
  let post_data = {name: task_name, input: inputs}
  $.post({url: link, dataType: "json", data: post_data})
    .done(function(result){
    if (result.data.variables._0.includes("Error")){
      console.log("There are some error with updaing stats");
    } else {
      console.log("Stats updated")
    }
  });
  document.getElementById("current_output_section").scrollIntoView();
}

function get_final_view(collection_name, platform_name, component_name,release_name){
  console.log("get_final_view called --> using collection_data variables saved before")
  let content = ""
  let header = "</div><br></div><div align='left'><img src='https://i.imgur.com/f0vBigO.jpg' alt=''></div>"
  let footer = "</div><br></div><div align='left'><a href='mailto:lighthouse-csone@cisco.com?Subject=Lighthouse%20Feedback' target='_top'>comments/questions/feedbacks</a></div><br>"
  let cmd_header = "<div><br><h6>Useful commands for troubleshooting: (some commands syntax could vary according to platform or version)</h6><br><br><div style='width:98%'"
  let link_header = "<br><h6>Support links: (links can become obsolete at any time, send feedback to help maintain accuracy)</h6><br><br>"
  content += header + "<h6 style='text-align:center'>" + platform_name + " --- " + component_name + " --- " + release_name + " --- " + collection_name  + "</h6>"

  let command_list = []
  let link_list = []
  collection_data.forEach((item) => {
    if(item.platform == platform_name && item.component == component_name && item.release == release_name){
      command_list = item.commands
      link_list = item.links
    }
  })
  if (command_list){
    content += cmd_header
    for (item of command_list) {
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

  if(link_list){
    content += link_header
    for (item of link_list) {
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


function get_diff(collection_name, platform_name, component_name,release_name){
  console.log("get_diff called - using collection_data variables saved before from draft colleciton and taking similar collection data from production one")
  $("#loading").show()
  clear_all()
  let new_command_list = []
  let new_link_list = []

  //taking data from draft collection
  collection_data.forEach((item) => {
    if(item.platform == platform_name && item.component == component_name && item.release == release_name){
      new_command_list = item.commands
    }
  })
  collection_data.forEach((item) => {
    if(item.platform == platform_name && item.component == component_name && item.release == release_name){
      new_link_list = item.links
    }
  })

  console.log("New command list " + new_command_list)
  console.log("New link list " + new_link_list)

  if (new_command_list){
    new_command_list.forEach((item) => {
      $("#new_commands").text($("#new_commands").text() + item +"\n");
    });
  }
  if (new_link_list){
    new_link_list.forEach((item) => {
      $("#new_links").text($("#new_links").text() + item +"\n");
    });
  }

  //taking the same data from non-draft collection
  if (collection_data_diff === undefined){
    let original_collection_name = collection_name.replace('-draft','')
    let inputs = {"action":"get_collection_data", "collection":original_collection_name}
    let post_data = {name: task_name, input: inputs}
    $.post({url: link, dataType: "json", data: post_data})
      .done(function(result){
      if(result.data.variables._0){
        collection_data_diff = result.data.variables._0
        let current_new_cmd = []
        let new_current_cmd = []
        let current_new_lnk = []
        let new_current_lnk = []
        let current_command_list = []
        let current_link_list = []
        collection_data_diff.forEach((item) => {
        if(item.platform == platform_name && item.component == component_name && item.release == release_name){
          current_command_list = item.commands
          }
        })
        collection_data_diff.forEach((item) => {
        if(item.platform == platform_name && item.component == component_name && item.release == release_name){
          current_link_list = item.links
          }
        })

        console.log("Current command list "+ current_command_list)
        console.log("Current link list " + current_link_list)
        if (current_command_list){
          current_command_list.forEach((item) => {
            $("#current_commands").text($("#current_commands").text() + item +"\n");
          });
        }
        if (current_link_list){
          current_link_list.forEach((item) => {
            $("#current_links").text($("#current_links").text() + item +"\n");
          });
        }
        current_new_cmd = array_diff(current_command_list, new_command_list)
        new_current_cmd = array_diff(new_command_list, current_command_list)
        current_new_lnk = array_diff(current_link_list, new_link_list)
        new_current_lnk = array_diff(new_link_list, current_link_list)

        if (current_new_cmd){
          $("#diff_commands").text($("#diff_commands").text() + "+++ Current command --- New command" + "\n");
          current_new_cmd.forEach((item) => {
            $("#diff_commands").text($("#diff_commands").text() + item +"\n");
          });
        }
        if (new_current_cmd){
          $("#diff_commands").text($("#diff_commands").text() + "+++ New command --- Current command" +"\n");
          new_current_cmd.forEach((item) => {
            $("#diff_commands").text($("#diff_commands").text() + item +"\n");
          });
        }
        if (current_new_lnk){
          $("#diff_links").text($("#diff_links").text() + "+++ Current links --- New links" + "\n");
          current_new_lnk.forEach((item) => {
            $("#diff_links").text($("#diff_links").text() + item +"\n");
          });
        }
        if (new_current_lnk){
          $("#diff_links").text($("#diff_links").text() + "+++ New links --- Current links" +"\n");
          new_current_lnk.forEach((item) => {
            $("#diff_links").text($("#diff_links").text() + item +"\n");
          });
        }

        $("#loading").hide()
        $("#command_section").show()
        $("#link_section").show()
        $("#button_section").show()
        submit_buttons.forEach((item) => {
          $("#admin_button").append("<button class='btn btn--action'id='" + collection_name + "_" + platform_name + "_" + component_name + "_" + release_name + "_" + "getdiff" + "'>" + item + "</button>")
        });
      }
    });
  } else {
    let current_new_cmd = []
    let new_current_cmd = []
    let current_new_lnk = []
    let new_current_lnk = []
    let current_command_list = []
    let current_link_list = []
    collection_data_diff.forEach((item) => {
    if(item.platform == platform_name && item.component == component_name && item.release == release_name){
      current_command_list = item.commands
      }
    })
    collection_data_diff.forEach((item) => {
    if(item.platform == platform_name && item.component == component_name && item.release == release_name){
      current_link_list = item.links
      }
    })

    console.log("Current command list "+ current_command_list)
    console.log("Current link list " + current_link_list)
    if (current_command_list){
      current_command_list.forEach((item) => {
        $("#current_commands").text($("#current_commands").text() + item +"\n");
      });
    }
    if (current_link_list){
      current_link_list.forEach((item) => {
        $("#current_links").text($("#current_links").text() + item +"\n");
      });
    }
    current_new_cmd = array_diff(current_command_list, new_command_list)
    new_current_cmd = array_diff(new_command_list, current_command_list)
    current_new_lnk = array_diff(current_link_list, new_link_list)
    new_current_lnk = array_diff(new_link_list, current_link_list)

    if (current_new_cmd){
      $("#diff_commands").text($("#diff_commands").text() + "+++ Current command --- New command" + "\n");
      current_new_cmd.forEach((item) => {
        $("#diff_commands").text($("#diff_commands").text() + item +"\n");
      });
    }
    if (new_current_cmd){
      $("#diff_commands").text($("#diff_commands").text() + "+++ New command --- Current command" +"\n");
      new_current_cmd.forEach((item) => {
        $("#diff_commands").text($("#diff_commands").text() + item +"\n");
      });
    }
    if (current_new_lnk){
      $("#diff_links").text($("#diff_links").text() + "+++ Current links --- New links" + "\n");
      current_new_lnk.forEach((item) => {
        $("#diff_links").text($("#diff_links").text() + item +"\n");
      });
    }
    if (new_current_lnk){
      $("#diff_links").text($("#diff_links").text() + "+++ New links --- Current links" +"\n");
      new_current_lnk.forEach((item) => {
        $("#diff_links").text($("#diff_links").text() + item +"\n");
      });
    }

    $("#loading").hide()
    $("#command_section").show()
    $("#link_section").show()
    $("#button_section").show()
    submit_buttons.forEach((item) => {
      $("#admin_button").append("<button class='btn btn--action'id='" + collection_name + "_" + platform_name + "_" + component_name + "_" + release_name + "_" + "getdiff" + "'>" + item + "</button>")
    });
  }
}
