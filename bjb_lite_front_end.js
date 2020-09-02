export const bjbModuleFunction = async (myDiv, loadedDeps, LOG) => {
    // By default all the module divs are hidden.  Call the following function to unhide our div.
    myDiv.bjbLiteWholeModuleToggle();
    // By default all the module body is collapsed.  Call the following function to expand our body.
    myDiv.bjbLiteCollapseModuleToggle();
    
    // This will allow you to display things to the console when dev mode is enabled.
    LOG("This is an example bjbLite Module")
    
    // Use standard jQuery functions to manipulate the div
    //myDiv.text(`Case technology is : ${loadedDeps.caseObject.caseDetails.Technology_Text__c}`);
    let technology = loadedDeps.caseObject.caseDetails.Technology_Text__c;
    if (technology.includes('XR-Routing')){
      myDiv.html('<a href="https://scripts.cisco.com/app/lighthouse_v41_backend/index.html?collection=ios-xr" target="_blank">Lighthouse portal</a>');
    } 
    else if ((technology.includes('Broadband Cable'))){
      myDiv.html('<a href="https://scripts.cisco.com/app/lighthouse_v41_backend/index.html?collection=cable" target="_blank">Lighthouse portal</a>');
    }
    else{
      myDiv.html('<a href="https://scripts.cisco.com/app/lighthouse_v41_backend/index.html" target="_blank">Lighthouse portal</a>');
    }
  };  