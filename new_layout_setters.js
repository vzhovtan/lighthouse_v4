console.log("setters - version 55")

// function create_new_platform(collection_name){
//     clear_new_platform_fields()
//     $("#platform").empty()
//     $("#component").empty()
//     $("#release").empty()
//     $("#platform").hide()
//     $("#component").hide()
//     $("#release").hide()
//     $("#platform > button").removeClass("btn--highlight")
//     $("#new_platform").show()
//     $('#new_platform').on( 'click', 'button', function() {
//         let new_platform = $("#new_platform_input").val()
//         let new_component = $("#new_comp_input").val()
//         let new_commands = $("#commands").val()
//         let new_links = $("#links").val()
//         if (new_platform === "" || new_component === "" || new_commands === "" || new_links === ""){
//             user_view_modal = PaneOpen("Some required fields are empty. Please fill all required fields")
//             user_view_modal.show()
//         } else {
//             let inputs = {"action":"submit_new", "collection":collection_name, "platform":new_platform, "release":"Software Independent", "component":new_component, "commands":new_commands, "links":new_links}
//             let post_data = {name: task_name, input: inputs}
//             submit_new_content(post_data)
//         }
//     })
// }

// function create_new_component(collection_name, platform_name){
//     clear_new_platform_fields()
//     $("#component").empty()
//     $("#release").empty()
//     $("#component").hide()
//     $("#release").hide()
//     $("#component> button").removeClass("btn--highlight")
//     $("#new_platform_input").val(platform_name)
//     $("#new_platform").show()
//     $('#new_platform').on( 'click', 'button', function() {
//         let new_component = $("#new_comp_input").val()
//         let new_commands = $("#commands").val()
//         let new_links = $("#links").val()
//         if (new_component === "" || new_commands === "" || new_links === ""){
//             user_view_modal = PaneOpen("Some required fields are empty. Please fill all required fields")
//             user_view_modal.show()
//         } else {
//             let inputs = {"action":"submit_new", "collection":collection_name, "platform":platform_name, "release":"Software Independent", "component":new_component, "commands":new_commands, "links":new_links}
//             let post_data = {name: task_name, input: inputs}
//             submit_new_content(post_data)
//         }
//     })
// }

// function submit_new_content(post_data){
//     $.post({url: link, dataType: "json", data: post_data})
//     .done(function(result){
//         if(result.data.variables._0){
//           $("#platform").show()
//           $("#component").show()
//           $("#release").show()
//           user_view_modal = PaneOpen(result.data.variables._0)
//           user_view_modal.show()
//           clear_new_platform_fields()
//         }
//     })
// }

// function approve_content(){
//   user_view_modal = PaneOpen("Function approve called and executed")
//   user_view_modal.show()
// }

// function delete_content(collection_name, platform_name, release_name, post_data){
//     $.post({url: link, dataType: "json", data: post_data})
//     .done(function(result){
//         if(result.data.variables._0){
//           clear_all()
//           $("#component").empty()
//           let inputs = {"action":"get_component_list", "collection":collection_name, "platform":platform_name, "release":release_name}
//           let comp_post_data = {name: task_name, input: inputs}
//           get_component_list(collection_name, platform_name, release_name, comp_post_data)
//           user_view_modal = PaneOpen(result.data.variables._0)
//           user_view_modal.show()
//         }
//     })
// }

// function update_content (collection_name, platform_name, release_name, component_name, cmds_field, lnks_field){
//     let command = $(cmds_field).val()
//     let links = $(lnks_field).val()
//     let inputs = {"action":"update", "collection":collection_name, "platform":platform_name, "release":release_name, "component":component_name, "commands":command, "links":links}
//     let post_data = {name: task_name, input: inputs}
//     $.post({url: link, dataType: "json", data: post_data})
//     .done(function(result){
//         if(result.data.variables._0){
//            $("#component > button").removeClass("btn--highlight")
//            $("#release > button").removeClass("btn--highlight")
//            openModal(result.data.variables._0)
//            clear_all()
//          }
//      })
// }
