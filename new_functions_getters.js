console.log("new function getters - version 10")
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
  console.log("get_platform_list started --> getting collection data first")
  $.post({url: link, dataType: "json", data: post_data})
    .done(function(result){
    if(result.data.variables._0){
      collection_data = result.data.variables._0
      let platform_list = []
      collection_data.forEach(function(item){
        if(!platform_list.includes(item.platform)){
            platform_list.push(item.platform)
        }
      })
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
  console.log(release_list)
  release_list.forEach(function(item){
    $("#release").append("<button class='btn btn--release' id='" + collection_name + "_" + platform_name + "_" + component_name + "'>" + item + "</button>")
  })
}

function get_content(collection_name, platform_name, release_name, component_name){
  console.log("get_content started --> using collection_data")
  console.log(collection_name, platform_name, release_name, component_name)
  let command_list = []
  let link_list = []
  collection_data.forEach(function(item){
    if(item.platform == platform_name){
      if(item.component == component_name){
        if (item.release == release_name){
          command_list.push(item.commands)
          link_list.push(item.links)
        }
      }
    }  
  })
  console.log(command_list)
  console.log(link_list)
  $("#current_output").empty()
  $("#current_output_section").show()
  let links = ""
  link_list[0].forEach(function(item){    
    links += item + "<br>"
  })
  console.log(links)
  $("#current_output").html(links)
}