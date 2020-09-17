from __future__ import unicode_literals, absolute_import, print_function
import bdblib
import pymongo
from datetime import datetime

def task(env, action, collection="None", platform="None", release="None", feature="None", commands="None", links="None"):
    """
    Update this docsrting later - TBD
    """
    result = bdblib.TaskResult()

    userid = env.user_name
    collection = collection.lower()
    platform = platform.lower()
    feature = feature.lower()
    release = release.lower()
    mydb4  = get_dbaas(env)

    backend_action = action.lower()
    if backend_action  == "get_admin_status":
        admin_status = get_admin_status(mydb4, userid)
        result.append(admin_status)
    elif backend_action == "get_collection_list":
        collection_list = get_collection_list(mydb4,userid)
        result.append(collection_list)
    elif backend_action == "get_collection_data":
        collection_data = get_collection_data(collection, mydb4)
        result.append(collection_data) 
    elif backend_action == "get_content_raw":
        content_data = get_content_raw (collection, platform, feature, release, mydb4)
        result.append(content_data)
    elif backend_action == "get_content_final":
        content_data = get_content_final (collection, platform, feature, release, mydb4)
        result.append(content_data)
    elif backend_action == "submit_changes_user":
        change_result = submit_changes_user (collection, platform, feature, release, commands, links, userid, mydb4)
        result.append(change_result)
    elif backend_action == "submit_changes_admin":
        change_result = submit_changes_admin (collection, platform, feature, release, commands, links, userid, mydb4)
        result.append(change_result)    
    elif backend_action == "delete_document":
        del_result = delete_doc (collection, platform, feature, release, userid, mydb4)
        result.append(del_result) 
    elif backend_action == "approve_document":
        aprv_result = approve_doc (collection, platform, feature, release, userid, mydb4)
        result.append(aprv_result)
    elif backend_action == "update_stats":
        stats_result = update_stats (collection, platform, feature, release, userid, mydb4)
        result.append(stats_result)    
    else:
        result.append("Action is invalid")

    return result

def get_dbaas(env):
    # connect to MongoDB, and return pymongo object
    dbaas_mongo_url = "mongodb://" + ",".join([ srv['host'] + ":" + str(srv['port']) for srv in env.task_db['mongoServers'] ]) + "/?replicaSet={}".format(env.task_db['replica'])
    dbaas = pymongo.MongoClient(dbaas_mongo_url)[env.task_db['database']]
    dbaas.authenticate(env.task_db['username'], env.task_db['password'])
    return dbaas

def get_admin_status(mydb4, userid):
    # get the admin status using list of admin in MongoDB
    db_dict = {"_id": "admins"}
    doc = mydb4["admin_list"].find_one(db_dict)
    admin_list = doc.get("admin")
    if userid in admin_list:
        admin_status = True
    else:
        admin_status = False
    
    return admin_status

def get_collection_list(mydb4, userid):
    """
    get collection list from MongoDB
    """
    admin_status = get_admin_status(mydb4, userid)
    restricted_item_admin = ["admin", "webexbot", "event", "commander", "test"]
    restricted_item_user = ["admin", "webexbot", "event", "commander", "test", "draft"]
    collection_list = []
    result_list = []

    for collection_name in mydb4.collection_names():
        collection_list.append(collection_name.lower())
    
    if admin_status:
        result_list = [collection for collection in collection_list if all(item not in collection for item in restricted_item_admin)]
    else:
        result_list = [collection for collection in collection_list if all(item not in collection for item in restricted_item_user)]   
    
    result_list.sort()
    return result_list

def get_collection_data(collection, mydb4):
    """
    get entire collection data for specific collection to process further
    """
    collection_data = []

    for doc in mydb4[collection].find():
        item_dict = {}
        item_dict["platform"] = doc.get("platform")
        item_dict["feature"] = doc.get("feature")
        item_dict["release"] = doc.get("release")
        item_dict["commands"] = doc.get("commands")
        item_dict["links"] = doc.get("links")
        collection_data.append(item_dict)

    return collection_data

def get_content_raw (collection, platform, feature, release, mydb4):
    """
    get commands and links from MongoDB for specific collection/platform/release/feature
    without formatting, can be used for specific request only
    """
    content_db = []
    db_dict = {"platform": platform, "release": release, "feature": feature}
    doc = mydb4[collection].find_one(db_dict)
    if doc:
        content_db.append(doc.get("commands", ""))
        content_db.append(doc.get("links", ""))

    return content_db

def get_content_final (collection, platform, feature, release, mydb4):
    """
    1 - get commands and links from MongoDB for specific collection/platform/release/feature
    2 - format the output as html for CSOne/Lightning front-end
    3 - Admin Portal has to use formatting in JS
    """
    content_final = ""
    cmd = []
    lnks = []

    db_dict = {"platform": platform, "release": release, "feature": feature}
    doc = mydb4[collection].find_one(db_dict)
    cmd = doc.get("commands")
    lnks = doc.get("links")

    content_final += "</div><br></div><div align='left'><img src='https://i.imgur.com/f0vBigO.jpg' alt=''></div>"
    content_final += "<div style='text-align:center'><h6>" + platform.upper() + " - " + release + " - " + feature.upper() + "</h6></div>"

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

def submit_changes_user (collection, platform, feature, release, commands, links, userid, mydb4):
    """
    Update MongoDB draft collection with command and list for specific collection/platform/release/feature
    submitted by regular user
    """
    content = ""
    submitted_doc = {}
    db_dict = {"platform": platform, "feature": feature, "release": release}
    
    submitted_doc["platform"], submitted_doc["feature"], submitted_doc["release"], submitted_doc["commands"], submitted_doc["links"], submitted_doc["submitter"] = \
    platform, feature, release, commands, links, userid
    
    doc_exist_flag = mydb4[collection].find_one(db_dict)
    if not doc_exist_flag:
        new_doc = mydb4[collection].insert_one(submitted_doc)
        if new_doc.acknowledged:
            content = "New document submitted with id " + str(new_doc.inserted_id) + " by " + userid + " for review and approval"
        else:
            content = "Error with submitting new document"    
    else:
        content = "Similar document for the same platform/feature/release is under review already"

    return content

def submit_changes_admin (collection, platform, feature, release, commands, links, userid, mydb4):
    """
    Update MongoDB production collection with command and list for specific collection/platform/release/feature
    submitted by admin and deletion of draft documetn for the same platform/release/feature
    """
    content = ""
    submitted_doc = {}
    db_dict = {"platform": platform, "feature": feature, "release": release}
    
    submitted_doc["platform"], submitted_doc["feature"], submitted_doc["release"], submitted_doc["commands"], submitted_doc["links"], submitted_doc["submitter"] = \
    platform, feature, release, commands, links, userid

    replaced_doc = mydb4[collection].replace_one(db_dict, submitted_doc, True)
    if replaced_doc.acknowledged:
        content = "Document updated by " + userid + " in production collection"
    else:
        content = "Error with updating production document"
    
    content += "\n"
    
    draft_collection = collection + "-draft"
    removed_doc = mydb4[draft_collection].delete_one(db_dict)
    if removed_doc.acknowledged:
        content += "Draft version of the document has been deleted"
    else:
        content += "Error with deletion of the draft document"    
    
    return content

def delete_doc (collection, platform, feature, release, userid, mydb4):
    """
    Delete MongoDB document for specific collection/platform/release/feature
    """
    content = ""
    db_dict = {"platform": platform, "feature": feature, "release": release}
    removed_doc = mydb4[collection].delete_one(db_dict)
    if removed_doc.acknowledged:
        content = "Document removed by " + userid
    else:
        content = "There was an error with document removal"

    return content

def approve_doc (collection, platform, feature, release, userid, mydb4):
    """
    Approve the entire document form draft colleciton without editing
    """
    content = ""
    draft_collection = collection + "-draft"
    submitted_doc = {}
    db_dict = {"platform": platform, "feature": feature, "release": release}
    draft_doc = mydb4[draft_collection].find_one(db_dict)
    if draft_doc:
        submitted_doc["platform"], submitted_doc["feature"], submitted_doc["release"], submitted_doc["commands"], submitted_doc["links"], submitted_doc["submitter"] = \
            draft_doc.get("platform"), draft_doc.get("feature"), draft_doc.get("release"), draft_doc.get("commands", " "), draft_doc.get("links", " "), userid

    replaced_doc = mydb4[collection].replace_one(db_dict, submitted_doc, True)
    if replaced_doc.acknowledged:
        content = "Document updated by " + userid + " in production collection"
    else:
        content = "Error with updating production document"
    
    content += "\n"
    
    removed_doc = mydb4[draft_collection].delete_one(db_dict)
    if removed_doc.acknowledged:
        content += "Draft version of the document has been deleted"
    else:
        content += "Error with deletion of the draft document"   

    return content

def update_stats (collection, platform, feature, release, userid, mydb4):
    """
    Update stats in MongoDB
    """
    content = ""
    dateTimeStr = str(datetime.now())
    submitted_doc = {}
    submitted_doc["collection"], submitted_doc["platform"], submitted_doc["feature"], submitted_doc["release"], submitted_doc["userid"], submitted_doc["request_time"] = \
            collection, platform, feature, release, userid, dateTimeStr

    inserted_doc = mydb4["usage-event"].insert_one(submitted_doc)
    if inserted_doc.acknowledged:
        content = "stats updated"
    else:
        content = "" 

    return content