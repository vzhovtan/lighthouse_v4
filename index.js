$(document).ready(function(){
    get_collection_list();
    clear_all();
    $("#about").hide();
    $("#footer").hide();
    $("#collections").removeClass("highlight");
    $("#platform > div").removeClass("highlight");
    $("#release > div").removeClass("highlight");
    $("#component > div").removeClass("highlight");

    $( document ).ajaxStart(function() {
        $("#loading").show();
    });

    $( document ).ajaxStop(function() {
        $("#loading").hide();
        $("#about").show();
        $("#footer").show();
    });

    $('#collections').on( 'click', 'li', function() {
        clear_all();
        $("#about").empty();
        $("#platform").empty();
        $("#release").empty();
        $("#component").empty();
        $("#collections > li").removeClass("highlight");
        $(this).addClass("highlight");
        var collection_name = $( this ).text().toLowerCase();
        var inputs = {"action":"get_platform_list", "collection":collection_name};
        var post_data = {name: task_name, input: inputs};
        get_platform_list(collection_name, post_data);
    });

    $('#platform').on( 'click', 'button', function() {
        clear_all();
        $("#release").empty();
        $("#component").empty();
        $("#platform > button").removeClass("btn--highlight");
        $(this).addClass("btn btn--highlight");
        var collection_name = $( this ).attr("id").toLowerCase();
        var platform_name = $( this ).text().toLowerCase();
        if(!platform_name.includes('create')){
            var inputs = {"action":"get_release_list", "collection":collection_name, "platform":platform_name};
            var post_data = {name: task_name, input: inputs};
            get_release_list(collection_name, platform_name, post_data);
        } else {
            create_new_platform(collection_name);
        }
    });

    $('#release').on( 'click', 'button', function() {
        clear_all();
        $("#component").empty();
        $("#release > button").removeClass("btn--highlight");
        $(this).addClass("btn btn--highlight");
        var collection_name = $( this ).attr("id").toLowerCase().split("_")[0];
        var platform_name = $( this ).attr("id").toLowerCase().split("_")[1];
        var release_name = $( this ).text().toLowerCase();
        var inputs = {"action":"get_component_list", "collection":collection_name, "platform":platform_name, "release":release_name};
        var post_data = {name: task_name, input: inputs};
        get_component_list(collection_name, platform_name, release_name, post_data);
    });

    $('#component').on( 'click', 'button', function() {
        clear_all();
        $("#component > button").removeClass("btn--highlight");
        $(this).addClass("btn btn--highlight");
        var collection_name = $( this ).attr("id").toLowerCase().split("_")[0];
        var platform_name = $( this ).attr("id").toLowerCase().split("_")[1];
        var release_name = $( this ).attr("id").toLowerCase().split("_")[2];
        var component_name = $( this ).text().toLowerCase();
        if(!component_name.includes('create')){
            if (collection_name.includes('draft')){
              var inputs = {"action":"get_content_draft", "collection":collection_name, "platform":platform_name, "release":release_name, "component":component_name};
              var post_data = {name: task_name, input: inputs};
              get_content_draft(collection_name, platform_name, release_name, component_name, post_data);
            } else {
              var inputs = {"action":"get_content_admin", "collection":collection_name, "platform":platform_name, "release":release_name, "component":component_name};
              var post_data = {name: task_name, input: inputs};
              get_content_admin(collection_name, platform_name, release_name, component_name, post_data);
            }
        } else {
            create_new_component(collection_name, platform_name);
        }
    });

    $('#admin_button').on( 'click', 'button', function() {
        $("#admin_button > button").removeClass("btn--highlight");
        $(this).addClass("btn btn--highlight");
        var collection_name = $( this ).attr("id").toLowerCase().split("_")[0];
        var platform_name = $( this ).attr("id").toLowerCase().split("_")[1];
        var release_name = $( this ).attr("id").toLowerCase().split("_")[2];
        var component_name = $( this ).attr("id").toLowerCase().split("_")[3];
        var action_name = $( this ).text().toLowerCase();
        console.log(collection_name);
        console.log(platform_name);
        console.log(release_name);
        console.log(component_name);
        console.log(action_name);
        if (action_name.includes('approve')){
            //var inputs = {"action":"approve", "collection":collection_name, "platform":platform_name, "release": release_name, "component": component_name};
            //var post_data = {name: task_name, input: inputs};
            approve_content();
        } else if (action_name.includes('reject')){
            //var inputs = {"action":"reject", "collection":collection_name, "platform":platform_name, "release": release_name, "component": component_name};
            //var post_data = {name: task_name, input: inputs};
            reject_content();
        } else if (action_name.includes('result')){
            var inputs = {"action":"get_content_final", "collection":collection_name, "platform":platform_name, "release": release_name, "component": component_name};
            var post_data = {name: task_name, input: inputs};
            get_content_final(post_data);
        } else if (action_name.includes('update')){
            update_content();
        } else {
            var inputs = {"action":"get_diff", "collection":collection_name, "platform":platform_name, "release": release_name, "component": component_name};
            var post_data = {name: task_name, input: inputs};
            view_diff(post_data);
        }

    });

    $('#reload').click(function() {
        location.reload();
    });

});

var link = '/api/v2/jobs/lighthouse_v41_backend';
var task_name = "lighthouse_v41_backend";
var adm_draft_btns = ["Approve", "Reject", "View diff", "View final result"];
var adm_btns = ["Update", "View final result"];

function get_collection_list(){
    var inputs = {"action":"get_collection_list"};
    var post_data = {name: task_name, input: inputs};
    $.post({url: link, dataType: "json", data: post_data})
    .done(function(result){
       if(result.data.variables._0){
         result.data.variables._0.forEach(function(item){
            $("#collections").append("<li class='sidebar__item' id='" + item + "'><a>" + item.toUpperCase() + "</a></li>");
            });
        }
    });
}

function get_platform_list(collection_name, post_data){
    $.post({url: link, dataType: "json", data: post_data})
        .done(function(result){
        if(result.data.variables._0){
            if (!collection_name.includes('-draft')){
              $("#platform").append("<button class='btn btn--new' id='" + collection_name + "'>" + "Create new" + "</button>");
            }
            result.data.variables._0.forEach(function(item){
                $("#platform").append("<button class='btn btn--platform' id='" + collection_name + "'>" + item + "</button>");
            });
        }
    });
}

function get_release_list(collection_name, platform_name, post_data){
    $.post({url: link, dataType: "json", data: post_data})
        .done(function(result){
        if(result.data.variables._0){
            result.data.variables._0.forEach(function(item){
                $("#release").append("<button class='btn btn--release' id='" + collection_name + "_" + platform_name + "'>" + item.toLowerCase() + "</button>");
            });
        }
    });
}

function get_component_list(collection_name, platform_name, release_name, post_data){
    $.post({url: link, dataType: "json", data: post_data})
        .done(function(result){
        if(result.data.variables._0){
            if (release_name.toLowerCase().includes('independent') && !collection_name.toLowerCase().includes('-draft')){
              $("#component").append("<button class='btn btn--new' id='" + collection_name + "_" + platform_name + "_" + release_name + "'>" + "Create new" + "</button>");
            }
            result.data.variables._0.forEach(function(item){
                $("#component").append("<button class='btn btn--release' id='" + collection_name + "_" + platform_name + "_" + release_name + "'>" + item.toUpperCase() + "</button>");
            });
        }
    });
}

function get_content_final(post_data){
    $.post({url: link, dataType: "json", data: post_data})
        .done(function(result){
        if(result.data.variables._0){
            user_view_modal = PaneOpen(result.data.variables._0);
            user_view_modal.show();
        }
    });
}

function get_content_admin(collection_name, platform_name, release_name, component_name, post_data){
    $.post({url: link, dataType: "json", data: post_data})
        .done(function(result){
        if(result.data.variables._0.includes("admin")){
            $("#label_new_links").show();
            $("#label_new_commands").show();
            $("#new_links").show();
            $("#new_commands").show();
            $.each(result.data.variables._1, function(val, text) {
                $('#new_commands').val($('#new_commands').val() + text + "\n")
            });
            $.each(result.data.variables._2, function(val, text) {
                $('#new_links').val($('#new_links').val() + text + "\n")
            });
            $("#admin_button").show();
              adm_btns.forEach(function(item){
                 $("#admin_button").append("<button class='btn btn--release'id='" + collection_name + "_" + platform_name + "_" + release_name + "_" + component_name + "'>" + item + "</button>");
              });
           } else {
            user_view_modal = PaneOpen(result.data.variables._1);
            user_view_modal.show();
           }
     });
}

function get_content_draft(collection_name, platform_name, release_name, component_name, post_data){
    $.post({url: link, dataType: "json", data: post_data})
        .done(function(result){
        if(result.data.variables._0 || result.data.variables._1){
          $("#label_new_links").show();
          $("#label_new_commands").show();
          $("#new_links").show();
          $("#new_commands").show();
          $.each(result.data.variables._0, function(val, text) {
              $('#new_commands').val($('#new_commands').val() + text + "\n")
          });
          $.each(result.data.variables._1, function(val, text) {
              $('#new_links').val($('#new_links').val() + text + "\n")
          });
          $("#admin_button").show();
          adm_draft_btns.forEach(function(item){
            $("#admin_button").append("<button class='btn btn--release'id='" + collection_name + "_" + platform_name + "_" + release_name + "_" + component_name + "'>" + item + "</button>");
          });
      }
  });
}

function create_new_platform(collection_name){
    clear_new_platform_fields();
    $("#new_platform").show();
    $('#new_platform').on( 'click', 'button', function() {
        var new_platform = $("#new_platform_input").val();
        var new_component = $("#new_comp_input").val();
        var new_commands = $("#commands").val();
        var new_links = $("#links").val();
        if (new_platform === "" || new_component === "" || new_commands === "" || new_links === ""){
            user_view_modal = PaneOpen("Some required fields are empty. Please fill all required fields");
            user_view_modal.show();
        } else {
            var inputs = {"action":"submit_new", "collection":collection_name, "platform":new_platform, "release":"Software Independent", "component":new_component, "commands":new_commands, "links":new_links};
            var post_data = {name: task_name, input: inputs};
            submit_new_content(post_data)
        }
    });
}

function create_new_component(collection_name, platform_name){
    clear_new_platform_fields();
    $("#new_platform_input").val(platform_name);
    $("#new_platform").show();
    $('#new_platform').on( 'click', 'button', function() {
        var new_component = $("#new_comp_input").val();
        var new_commands = $("#commands").val();
        var new_links = $("#links").val();
        if (new_component === "" || new_commands === "" || new_links === ""){
            user_view_modal = PaneOpen("Some required fields are empty. Please fill all required fields");
            user_view_modal.show();
        } else {
            var inputs = {"action":"submit_new", "collection":collection_name, "platform":platform_name, "release":"Software Independent", "component":new_component, "commands":new_commands, "links":new_links};
            var post_data = {name: task_name, input: inputs};
            submit_new_content(post_data)
        }
    });
}

function submit_new_content(post_data){
    $.post({url: link, dataType: "json", data: post_data})
        .done(function(result){
        if(result.data.variables._0){
            user_view_modal = PaneOpen(result.data.variables._0);
            user_view_modal.show();
            clear_new_platform_fields();
        }
    });
}

function approve_content(){
  user_view_modal = PaneOpen("Function approve called and executed");
  user_view_modal.show();
}

function reject_content(){
  user_view_modal = PaneOpen("Function reject called and executed");
  user_view_modal.show();
}

function update_content(){
  user_view_modal = PaneOpen("Function update called and executed");
  user_view_modal.show();
}

function view_diff(post_data){
    $.post({url: link, dataType: "json", data: post_data})
        .done(function(result){
        if(result.data.variables._0.includes('existing document')){
          user_view_modal = PaneOpen(result.data.variables._0);
          user_view_modal.show();
        } else {
          $("#label_original_links").show();
          $("#label_original_commands").show();
          $("#original_links").show();
          $("#original_commands").show();
          $.each(result.data.variables._0, function(val, text) {
              $('#original_commands').val($('#original_commands').val() + text + "\n")
          });
          $.each(result.data.variables._1, function(val, text) {
              $('#original_links').val($('#original_links').val() + text + "\n")
            });
        }
    });
}

function clear_all(){
    clear_new_platform_fields()
    clear_new_content()
    $("#new_platform").hide();
    $("#new_commands").hide();
    $("#new_commands").val("")
    $("#original_commands").hide();
    $("#original_commands").val("")
    $("#new_links").hide();
    $("#new_links").val("");
    $("#original_links").hide();
    $("#original_links").val("");
    $("#label_new_links").hide();
    $("#label_original_links").hide();
    $("#label_new_commands").hide();
    $("#label_original_commands").hide();
    $("#admin_button").hide();
    $("#admin_button").empty();
}

function clear_new_platform_fields(){
    $("#new_platform_input").val("");
    $("#new_comp_input").val("");
    $("#commands").val("");
    $("#links").val("");
}

function clear_new_content(){
    $("#new_content").hide();
    $("#new_content").empty();
    $("#new_content_diff").hide();
    $("#new_content_diff").empty();
    $("#original_content_diff").hide();
    $("#original_content_diff").empty();
}

function PaneOpen(html){
  var user_view_modal = picoModal({
      content: html,
      overlayClose: true,
      closeButton: true,
      width: "90%",
  });
  return user_view_modal;
}

function openModal(text){
    document.getElementById("modal-small").style.visibility = "visible";
    document.getElementById("subtitle").innerHTML = text;
}

function closeModal(){
    document.getElementById("subtitle").innerHTML = "";
    document.getElementById("modal-small").style.visibility = "hidden"

}
