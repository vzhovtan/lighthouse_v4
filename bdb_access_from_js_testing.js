const { JSDOM } = require( "jsdom" );
const { window } = new JSDOM( "" );
const $ = require( "jquery" )( window );

let link = 'https://scripts.cisco.com:443/api/v2/jobs/lighthouse_v41_backend';
let task_name = "lighthouse_v41_backend";
let inputs = {"action":"get_collection_list"};
let post_data = {name: task_name, input: inputs};
//let $ = require('jquery');

$.post({url: link, dataType: "json", data: post_data})
    .done(function(result){
        if(result.data.variables._0){
            console.log(result.data.variables._0)
        }
    });    