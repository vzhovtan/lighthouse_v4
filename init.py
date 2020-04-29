from __future__ import unicode_literals, absolute_import, print_function
import pymongo
import bdblib
import logging

logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)

def task(env, action, collection="None", platform="None", release="None", component="None", commands="None", links="None"):
    """
    1-Retreive the data from MongoDB and display with Admin Portal front-end
    2-Retrive the data from MongoDB and display with BJB in CSOne front-end
    3-Update MongoDb with data from Admin Portal front-end
    """
    result = bdblib.TaskResult()

    dbaas  = get_dbaas(env)
    userid = env.user_name
    admin_status = get_admin_status(dbaas, userid)
    collection = collection.lower()
    platform = platform.lower()
    release = release.lower()
    component = component.lower()

    backend_action = action.lower()
    if backend_action == "get_admin_status":
        admin_status = get_admin_status(dbaas, userid)
        result.append(admin_status)
    elif backend_action == "get_collection_list":
        collection_list = get_collection_list(admin_status, dbaas)
        result.append(collection_list)
    elif backend_action == "get_platform_list":
        platform_list = get_platform_list(collection, dbaas)
        result.append(platform_list)
    elif backend_action == "get_release_list":
        release_list = get_release_list(collection, platform, dbaas)
        result.append(release_list)
    elif backend_action == "get_component_list":
        component_list = get_component_list(collection, platform, release, dbaas)
        result.append(component_list)
    elif backend_action == "get_content_draft":
        content = get_content_draft(collection, platform, release, component, dbaas)
        for item in content:
            result.append(item)
    elif backend_action == "get_content_admin":
        if admin_status:
            result.append("admin")
            content = get_content_draft(collection, platform, release, component, dbaas)
            for item in content:
                result.append(item)
        else:
            result.append("user")
            content = get_content_final(collection, platform, release, component, dbaas)
            result.append(content)
    elif backend_action == "get_content_final":
        content = get_content_final(collection, platform, release, component, dbaas)
        result.append(content)
    elif backend_action == "get_diff":
        content = get_diff (collection, platform, release, component, dbaas)
        for item in content:
            result.append(item)
    elif backend_action =="submit_new":
        update = submit_new(collection, platform, component, commands, links, dbaas)
        result.append(update)
    elif backend_action =="approve":
        update = approve(collection, platform, release, component, commands, links, dbaas)
        result.append(update)
    elif backend_action =="reject":
        update = reject(collection, platform, release, component, dbaas)
        result.append(update)
    else:
        result.append("Action, platform and component combination is invalid or user does not have enough privileges to complete the task")

    return result

def get_dbaas(env):
    """
    connect to MongoDB, and return pymongo object
    """
    dbaas_mongo_url = "mongodb://" + ",".join([ srv['host'] + ":" + str(srv['port']) for srv in env.task_db['mongoServers'] ]) + "/?replicaSet={}".format(env.task_db['replica'])
    dbaas = pymongo.MongoClient(dbaas_mongo_url)[env.task_db['database']]
    dbaas.authenticate(env.task_db['username'], env.task_db['password'])
    return dbaas

def get_admin_status(dbaas, user_name):
    """
    get admin status for logged user using list of admin in MongoDB
    """
    user_admin_status = False
    for doc in dbaas['admin_list'].find():
        admin_names = doc["admin"]
    if user_name in admin_names:
        user_admin_status = True

    return user_admin_status

def get_collection_list(admin_status, dbaas):
    """
    get collection list from MongoDB
    """
    collection_list = []
    if not admin_status:
        for item in dbaas.collection_names():
            if item != "admin_list" and "-draft" not in item:
                collection_list.append(item.lower())
    else:
        for item in dbaas.collection_names():
            if item != "admin_list":
                collection_list.append(item.lower())

    collection_list.sort()
    return collection_list

def get_platform_list(collection, dbaas):
    """
    get platform list from MongoDB for specific collection
    """
    platform_list = []
    for item in dbaas[collection].find():
        if item["platform"].lower() not in platform_list:
            platform_list.append(item["platform"].lower())

    platform_list.sort()
    return platform_list

def get_release_list(collection, platform, dbaas):
    """
    get release list from MongoDB for specific collection/platform
    """
    release_list = []
    dbaas_dict = {"platform": platform}
    for item in dbaas[collection].find(dbaas_dict):
        if item["release"].lower() not in release_list:
            release_list.append(item["release"].lower())

    release_list.sort()
    return release_list

def get_component_list(collection, platform, release, dbaas):
    """
    get component list from MongoDB for specific collection/platform/release
    """
    component_list = []
    dbaas_dict = {"platform": platform, "release": release}
    for item in dbaas[collection].find(dbaas_dict):
        if item["component"].lower() not in component_list:
            component_list.append(item["component"].lower())

    component_list.sort()
    return component_list

def get_content_draft (collection, platform, release, component, dbaas):
    """
    get commands and links from MongoDB for specific collection/platform/release/component
    without formatting
    """
    content_draft = []
    dbaas_dict = {"platform": platform, "release": release, "component": component}
    doc = dbaas[collection].find_one(dbaas_dict)
    content_draft.append(doc["commands"])
    content_draft.append(doc["links"])

    return content_draft

def get_content_final (collection, platform, release, component, dbaas):
    """
    1 - get commands and links from MongoDB for specific collection/platform/release/component
    2 - format the output as html for Admin Portal and CSOne front-end
    """
    content_final = ""
    cmd = []
    lnks = []

    dbaas_dict = {"platform": platform, "release": release, "component": component}
    for item in dbaas[collection].find(dbaas_dict):
        if "commands" in item.keys():
            cmd = item["commands"]
        if "links" in item.keys():
            lnks = item["links"]

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

def get_diff (collection, platform, release, component, dbaas):
    """
    get commands and links from MongoDB for specific collection/platform/release/component
    for original and draft collections and display them together for analysis.
    """
    diff = []
    original_collection = collection.replace('-draft', '')
    dbaas_dict = {"platform": platform, "release": release, "component": component}

    if dbaas[original_collection].count(dbaas_dict) != 0:
        doc = dbaas[collection].find_one(dbaas_dict)
        diff.append(doc["commands"])
        diff.append(doc["links"])
    else:
        diff.append("There is no existing document for requested combination platform/release/component" )

    return diff

def submit_new(collection, platform, component, commands, links, dbaas):
    """
    create new document in mongoDB in appropriate collection for new platform
    release has to be Software Independent
    """
    update_result = []
    submitted_doc = {}
    document_doesnt_exist_flag = True

    if "-draft" not in collection.lower():
        target_collection = collection.lower() + "-draft"
    else:
        target_collection = collection.lower()

    dbaas_dict = {"platform": platform.lower(), "release": "software independent", "component": component.lower()}
    if dbaas[target_collection].count(dbaas_dict) != 0:
        document_doesnt_exist_flag = False

    submitted_doc["platform"], submitted_doc["release"], submitted_doc["component"], submitted_doc["commands"], submitted_doc["links"] = platform.lower(), "software independent", \
	component.lower(), commands.split("\n"), links.split("\n")

    if document_doesnt_exist_flag:
        dbaas[target_collection].insert_one(submitted_doc)
        update_result.append("{} - {} submitted for review and approval".format(platform, component))
    else:
        update_result.append("{} - {} already exist under review by admin team".format(platform, component))

    return update_result

def approve(collection, platform, release, component, commands, links, dbaas):
    """
    reject new document in MongoDB deletion of the draft document from
    draft collection
    """
    update_result = ["TBD"]

    # if "-draft" not in collection.lower():
    #     target_collection = collection.lower().replace("-draft", "")
    # else:
    #     target_collection = collection.lower()
    #
    # dbaas_dict = {"platform": platform, "release": release, "component": component}
    # submitted_doc["platform"], submitted_doc["release"], submitted_doc["component"], submitted_doc["commands"], submitted_doc["links"] = platform.lower(), release.lower(), \
	# component.lower(), commands.split("\n"), links.split("\n")
    #
    # update = dbaas[target_collection].delete_one(dbaas_dict)
    # if update.deleted_count:
    #     dbaas[target_collection].insert_one(submitted_doc)
    #     update_result.append("Document {} - {} - {} approved".format(platform, release, component))
    # else:
    #     update_result.append("Document {} - {} - {} was not deleted properly".format(platform, release, component)")

    return update_result

def reject(collection, platform, release, component, dbaas):
    """
    approve new document in MongoDB by moving draft document into
    main collection
    """
    update_result = ["TBD"]

    # if "-draft" not in collection.lower():
    #     target_collection = collection.lower() + "-draft"
    # else:
    #     target_collection = collection.lower()
    #
    # dbaas_dict = {"platform": platform, "release": release, "component": component}
    # update = dbaas[target_collection].delete_one(dbaas_dict)
    # if update.deleted_count:
    #     update_result.append("Document {} - {} - {} has been removed".format(platform, release, component))
    # else:
    #     update_result.append("Document {} - {} - {} was not deleted properly".format(platform, release, component)")

    return update_result
