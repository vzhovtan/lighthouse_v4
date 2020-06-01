console.log("getters - version 55")

function get_collection_list(){
  console.log("get_collection_list started")
  let inputs = {"action":"get_collection_list"}
  let post_data = {name: task_name, input: inputs}
  $.post({url: link, dataType: "json", data: post_data})
  .done(function(result){
    if(result.data.variables._0){
      result.data.variables._0.forEach(function(item){
        $("#collections").append("<li class='sidebar__item' id='" + item + "'><a>" + item.toUpperCase() + "</a></li>")
      })
    }
  });
}

function get_platform_list(collection_name, post_data){
  console.log("get_platform_list started")
  $.post({url: link, dataType: "json", data: post_data})
    .done(function(result){
    if(result.data.variables._0){
      console.log(result.data.variables._0)
      if (!collection_name.includes('-draft')){
        $("#platform").append("<button class='btn btn--new' id='" + collection_name + "'>" + "Create new platform" + "</button>")
      }
      result.data.variables._0.forEach(function(item){
        $("#platform").append("<button class='btn btn--platform' id='" + collection_name + "'>" + item + "</button>")
      })
    }
  });
}

function get_component_list(collection_name, platform_name, post_data){
  console.log("get_component_list started")
  $.post({url: link, dataType: "json", data: post_data})
    .done(function(result){
    if(result.data.variables._0){
      console.log(result.data.variables._0)
      if (!collection_name.toLowerCase().includes('draft')){
        $("#component").append("<button class='btn btn--new' id='" + collection_name + "_" + platform_name + "'>" + "Create new component" + "</button>")
      }
      result.data.variables._0.forEach(function(item){
        $("#component").append("<button class='btn btn--component' id='" + collection_name + "_" + platform_name + "'>" + item.toLowerCase() + "</button>")
      })
    }
  });
}

function get_release_list(collection_name, platform_name, component_name, post_data){
  console.log("get_release_list started")
  $.post({url: link, dataType: "json", data: post_data})
    .done(function(result){
    if(result.data.variables._0){
      console.log(result.data.variables._0)
      result.data.variables._0.forEach(function(item){
        $("#release").append("<button class='btn btn--release' id='" + collection_name + "_" + platform_name + "_" + component_name + "'>" + item.toLowerCase() + "</button>")
      })
    }
  });
}

function get_content_draft(collection_name, platform_name, release_name, component_name, post_data){
  console.log("get_content_draft started")
  $.post({url: link, dataType: "json", data: post_data})
    .done(function(result){
    if(result.data.variables._0){
      $("#content_output").html(result.data.variables._0)
      $("#current_output_section").show()
      if (!collection_name.toLowerCase().includes('draft')){
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
  });
}

// function get_content_final(post_data){
//   $.post({url: link, dataType: "json", data: post_data})
//     .done(function(result){
//     if(result.data.variables._0){
//       user_view_modal = PaneOpen(result.data.variables._0)
//       user_view_modal.show()
//     }
//   })
// }



// function get_content_admin(collection_name, platform_name, release_name, component_name, post_data){
//     $.post({url: link, dataType: "json", data: post_data})
//         .done(function(result){
//         if(result.data.variables._0.includes("admin")){
//             if(result.data.variables._1){
//                 $("#label_original_commands").show()
//                 $("#original_commands").show()
//                 $.each(result.data.variables._1, function(val, text) {
//                     $('#original_commands').val($('#original_commands').val() + text + "\n")
//                 })
//             }
//             if (result.data.variables._2){
//                 $("#label_original_links").show()
//                 $("#original_links").show()
//                 $.each(result.data.variables._2, function(val, text) {
//                     $('#original_links').val($('#original_links').val() + text + "\n")
//                 })
//             }
//             $("#admin_button").show()
//               adm_btns.forEach(function(item){
//                  $("#admin_button").append("<button class='btn btn--release'id='" + collection_name + "_" + platform_name + "_" + component_name + "_" + release_name + "'>" + item + "</button>")
//               })
//         } else {
//             user_view_modal = PaneOpen(result.data.variables._1)
//             user_view_modal.show()
//            }
//      })
// }

// function get_content_draft(collection_name, platform_name, release_name, component_name, post_data){
//     $.post({url: link, dataType: "json", data: post_data})
//     .done(function(result){
//         if(result.data.variables._0){
//           $("#label_new_commands").show()
//           $("#new_commands").show()
//           $.each(result.data.variables._0, function(val, text) {
//               $('#new_commands').val($('#new_commands').val() + text + "\n")
//           })
//         }
//         if(result.data.variables._1) {
//           $("#label_new_links").show()
//           $("#new_links").show()
//           $.each(result.data.variables._1, function(val, text) {
//               $('#new_links').val($('#new_links').val() + text + "\n")
//           })
//         }
//         $("#admin_button").show()
//         adm_draft_btns.forEach(function(item){
//           $("#admin_button").append("<button class='btn btn--release'id='" + collection_name + "_" + platform_name + "_" + component_name + "_" + release_name + "'>" + item + "</button>")
//         })
//     })
// }



// function get_user_view(platform, release, component, cmds_field, lnks_field){
//     let content = ""
//     let header = "</div><br></div><div align='left'><img src='https://i.imgur.com/f0vBigO.jpg' alt=''></div>"
//     let footer = "</div><br></div><div align='left'><a href='mailto:lighthouse-csone@cisco.com?Subject=Lighthouse%20Feedback' target='_top'>comments/questions/feedbacks</a></div><br>"
//     let cmd_header = "<div><br><h6>Useful Commands For Troubleshooting: (some commands syntax could lety according to platform or version)</h6><br><br><div style='width:98%'"
//     let link_header = "<br><h6>Support Links: (links can become obsolete at any time, send feedback to help maintain accuracy)</h6><br><br>"
//     let cmd  = $(cmds_field).val().split("\n")
//     let links = $(lnks_field).val().split("\n")
//     content += header + "<div style='text-align:center'><h6>" + platform.toUpperCase() + " - " + release.toUpperCase() + " - " + component.toUpperCase() + "</h6></div>"

//     if (cmd){
//       content += cmd_header
//       const cmds = Object.values(cmd)
//       for (const item of cmds) {
//           if (item.includes("//")) {
//               command_comment = item.split("//")
//               newItem = "<span>" + command_comment[0] + "</span>" + "<span style='color:blue float:right'>" + command_comment[1] + "</span>"
//               content += newItem + "<br>"
//         } else if (item.includes("Traces")) {
//               content += "<br><span><h6>" + item + "</h6></span><br>"
//         } else if (item.includes("Debugs")) {
//               content += "<br><span><h6>" + item + "</h6></span><br>"
//         } else if (item.includes("Techs:")) {
//               content += "<br><span><h6>" + item + "</h6></span><br>"
//         } else {
//               content += "<span>" + item + "</span>" + "<br>"
//         }
//       }
//     }

//     if(links){
//       content += link_header
//       const lnks = Object.values(links)
//       for (const item of lnks) {
//           if (item.includes("http")|| item.includes("https")) {
//               if (item.includes (">")) {
//                   text_link = item.split(">")
//                   content  += "<li><a href='" + text_link[1].trim() + "'target='_blank'>" + text_link[0] + "</a></li>"
//               } else {
//                   content  += "<li><a href='" + item + "'target='_blank'>" + item + "</a></li>"
//               }
//         } else if (item.includes("@")) {
//             content  += "<li><a href='mailto:" + item + "' target='_top'>Mailer : " + item + "</a></li>"
//         } else {
//             content += "<span>" + item + "</span>" + "<br>"
//         }
//       }
//     }

//       content += footer
//       $("#admin_button > button").removeClass("btn--highlight")
//       user_view_modal = PaneOpen(content)
//       user_view_modal.show()
// }

// function get_diff_data(post_data){
//     $.post({url: link, dataType: "json", data: post_data})
//     .done(function(result){
//         if(result.data.variables._0.includes('existing document')){
//           user_view_modal = PaneOpen(result.data.variables._0)
//           user_view_modal.show()
//         } else {
//           $("#label_original_links").show()
//           $("#label_original_commands").show()
//           $("#original_links").show()
//           $("#original_commands").show()
//           $.each(result.data.variables._0, function(val, text) {
//               $('#original_commands').val($('#original_commands').val() + text + "\n")
//           })
//           $.each(result.data.variables._1, function(val, text) {
//               $('#original_links').val($('#original_links').val() + text + "\n")
//             })
//         }
//     get_diff_view()
//     })
// }

// function get_diff_view(){
//     let orig_command = $("#original_commands").val().split("\n")
//     let orig_links = $("#original_links").val().split("\n")
//     let new_command = $("#new_commands").val().split("\n")
//     let new_links = $("#new_links").val().split("\n")
//     console.log("+++ original cmd   --- new cmd")
//     console.log(array_diff(orig_command, new_command))
//     console.log("+++ original links   --- new links")
//     console.log(array_diff(orig_links, new_links))
//     console.log("+++ new cmd   --- original cmd")
//     console.log(array_diff(new_command, orig_command))
//     console.log("+++ new links   --- original links")
//     console.log(array_diff(new_links, orig_links))
// }

// function array_diff (a1, a2) {
//   let a = [], diff = []
//   for (let i = 0 i < a1.length i++) {
//     a[a1[i]] = true
//   }
//   for (let i = 0 i < a2.length i++) {
//     if (a[a2[i]]) {
//       delete a[a2[i]]
//     }
//   }
//   for (let k in a) {
//     diff.push(k)
//   }
//   return diff
//   }