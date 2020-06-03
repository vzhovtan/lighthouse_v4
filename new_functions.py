from __future__ import unicode_literals, absolute_import, print_function
import bdblib
from pymongo import MongoClient

def task(env, action, collection="None", platform="None", release="None", component="None", commands="None", links="None"):
    """
    Test BORG module for LHv4.1, trying to improve perfomance by loading entire collection in advance
    """
    result = bdblib.TaskResult()
    
    clientv4 = MongoClient(
        'mongodb://lighthouse_v41_backend:a958935c0a9a9d21709711cacf2374dfea743d5e@bdb-dbaas-alln-1:27000/?authSource'
        '=task_lighthouse_v41_backend&authMechanism=MONGODB-CR')
    mydb4 = clientv4["task_lighthouse_v41_backend"]

    userid = env.user_name
    collection = collection.lower()
    platform = platform.lower()
    component = component.lower()
    release = release.lower()

    backend_action = action.lower()
    if backend_action == "get_collection_list":
        collection_list = get_collection_list(mydb4)
        result.append(collection_list)
    elif backend_action == "get_collection_data":
        collection_data = get_collection_data(collection, mydb4)
        result.append(collection_data)
    elif backend_action == "get_release_list":
        release_list = get_release_list(collection, platform, component, mydb4)
        result.append(release_list)    
    elif backend_action == "get_content_raw":
        content_data = get_content_raw (collection, platform, release, component, mydb4)
        result.append(content_data)
    elif backend_action == "get_content_final":
        content_data = get_content_final (collection, platform, release, component, mydb4)
        result.append(content_data)        
    else:
        result.append("Action is invalid")

    return result

def get_collection_list(mydb4):
    """
    get collection list from MongoDB
    """
    restricted_item = ["admin", "webexbot", "event", "commander"]
    collection_list = []
    result_list = []

    for collection_name in mydb4.collection_names():
        collection_list.append(collection_name.lower())

    result_list = [collection for collection in collection_list if all(item not in collection for item in restricted_item)]
    result_list.sort()
    return result_list

def get_collection_data(collection, mydb4):
    """
    get entire collection data fo=ro specific collection to process further
    """
    collection_data = []

    for doc in mydb4[collection].find():
        item_dict = {}
        item_dict["platform"] = doc.get("platform")
        item_dict["component"] = doc.get("component")
        item_dict["release"] = doc.get("release")
        item_dict["commands"] = doc.get("commands")
        item_dict["links"] = doc.get("links")
        collection_data.append(item_dict)

    return collection_data

def get_release_list(collection, platform, component, mydb4):
    """
    get release list from MongoDB for specific collection/platform/component
    can be used for specific request only, such as reload the collection list after update
    """
    release_list = []
    db_dict = {"platform": platform, "component": component}
    for item in mydb4[collection].find(db_dict):
        if item["release"].lower() not in release_list:
            release_list.append(item["release"].lower())

    release_list.sort()
    return release_list

def get_content_raw (collection, platform, release, component, mydb4):
    """
    get commands and links from MongoDB for specific collection/platform/release/component
    without formatting
    can be used for specific request only
    """
    content_db = []
    db_dict = {"platform": platform, "release": release, "component": component}
    doc = mydb4[collection].find_one(db_dict)
    content_db.append(doc.get("commands"))
    content_db.append(doc.get("links"))

    return content_db

def get_content_final (collection, platform, release, component, mydb4):
    """
    1 - get commands and links from MongoDB for specific collection/platform/release/component
    2 - format the output as html for CSOne/Lightning front-end
    3 - Admin Portal has to use formatting in JS
    """
    content_final = ""
    cmd = []
    lnks = []

    db_dict = {"platform": platform, "release": release, "component": component}
    doc = mydb4[collection].find_one(db_dict)
    cmd = doc.get("commands")
    lnks = doc.get("links")

    content_final += "</div><br></div><div align='left'><img src='https://i.imgur.com/f0vBigO.jpg' alt=''></div>"
    content_final += "<div style='text-align:center'><h6>" + platform.upper() + " - " + release + " - " + component.upper() + "</h6></div>"

    if cmd:
        content_final += "<div><br><h6>" + "Useful Commands For Troubleshooting: (some commands syntax could vary according to platform or version)" + "</h6><br><br><div style='width:98%'"
        for command_item in cmd:
            if "//" in command_item:
                command, comment = command_item.split("//", 1)
                newItem = "<span>" + command + "</span>" + "<span style='color:blue; float:right'>" + comment + "</span>"
                content_final += newItem + "<br>"
            elif "Traces" in command_item:
                content_final += "<br><span><h6>" + command_item + "</h6></span><br>"
            elif "Debugs" in command_item:
                content_final += "<br><span><h6>" + command_item + "</h6></span><br>"
            elif "Techs:" in command_item:
                content_final += "<br><span><h6>" + command_item + "</h6></span><br>"
            else:
                content_final += "<span>" + command_item + "</span>" + "<br>"

    if lnks:
        content_final += "<br><h6>" + "Support Links: (links can become obsolete at any time, send feedback to help maintain accuracy)" + "</h6><br><br>"
        for link_item in lnks:
            if "http" in link_item:
                if ">" in link_item:
                    text, link = link_item.split(">", 1)
                    content_final  += "<li><a href='" + link.strip() + "'target='_blank'>" + text + "</a></li>"
                else:
                    content_final  += "<li><a href='" + link_item + "'target='_blank'>" + link_item + "</a></li>"
            elif "@" in link_item:
                content_final  += "<li><a href='mailto:" + link_item + "' target='_top'>Mailer : " + link_item + "</a></li>"

    content_final += "</div><br></div><div align='left'><a href='mailto:lighthouse-csone@cisco.com?Subject=Lighthouse%20Feedback' target='_top'>comments/questions/feedbacks</a></div><br>"

    return content_final