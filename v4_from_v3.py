from __future__ import unicode_literals, absolute_import, print_function
import pymongo
import bdblib
import logging
import smtplib
import datetime
import zipfile
import ast
import re

logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)

def task(env, action, collection="None", platform="None", technology="None", commands="None", links="None", owner="None"):
    """
    1-Retreive the data from MongoDB and display with Admin Portal front-end
    2-Retrive the data from MongoDB and display with BJB in CSOne front-end
    3-Update MongoDb with data from Admin Portal front-end
    """
    result = bdblib.TaskResult()
    
    dbaas  = get_dbaas(env)
    userid = env.user_name
    admin_status = get_admin_status(dbaas, userid)
    
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
    elif backend_action == "get_technology_list" and platform != "None":
        technology_list = get_technology_list(collection, platform, dbaas)
        result.append(technology_list)
    elif backend_action =="get_technology" and platform != "None" and technology != "None":
        technology_content = get_technology(collection, platform, technology, dbaas)
        for item in technology_content:
            result.append(item)
    elif backend_action =="get_technology_formatted" and platform != "None" and technology != "None":
        update = get_technology_formatted(collection, platform, technology, dbaas)
        result.append(update)        
    # elif backend_action == "get_rfa_list" and admin_status:
    #     rfa_list = get_rfa_list (dbaas)
    #     result.append(rfa_list)
    # elif backend_action =="get_rfa" and platform != "None" and technology != "None" and admin_status and owner != "None":
    #     rfa = get_rfa(platform, technology, owner, dbaas)
    #     for item in rfa:
    #         result.append(item)
    # elif backend_action == "get_diffs"and admin_status:
    #     diffs = get_diffs (platform, technology, owner, dbaas)
    #     for item in diffs:
    #         result.append(item)
    # elif backend_action == "approve_rfa" and admin_status:
    #     feedback = approve_rfa (platform, technology, owner, userid, dbaas)
    #     result.append(feedback)
    # elif backend_action == "reject_rfa" and admin_status:
    #     feedback = reject_rfa (platform, technology, owner, userid, dbaas)
    #     result.append(feedback)
    # elif backend_action =="update":
    #     update = update_db(platform, technology, commands, links, admin_status, userid, dbaas)
    #     result.append(update)
    # elif backend_action =="delete":
    #     update = delete_tech(platform, technology, admin_status, userid, dbaas)
    #     result.append(update)
    # elif backend_action =="get_backup":
    #     update = get_backup(dbaas)
    #     result.append(update)
    else:
        result.append("Action, platform and technology combination is invalid or submitter is not in admin group")

    return result

def get_dbaas(env):
    """
    connect to MongoDB, and return pymongo object
    """
    dbaas_mongo_url = "mongodb://" + ",".join([ srv['host'] + ":" + str(srv['port']) for srv in env.task_db['mongoServers'] ]) + "/?replicaSet={}".format(env.task_db['replica'])
    dbaas = pymongo.MongoClient(dbaas_mongo_url)[env.task_db['database']]
    dbaas.authenticate(env.task_db['username'], env.task_db['password'])
    return dbaas

def get_admin_status(dbaas, requestor_name):
    """
    get admin status for logged user using list of admin in MongoDB
    """
    requestor_admin_status = False
    for doc in dbaas['admin_list'].find():
        admin_names = doc["admin"]
    if requestor_name in admin_names:
        requestor_admin_status = True
        
    return requestor_admin_status

def get_collection_list(admin_status, dbaas):
    """
    get collection list from MongoDB
    """
    collection_list = []
    if not admin_status:
        for item in dbaas.collection_names():
            if item != "admin_list" and "_draft" not in item:
                collection_list.append(item.upper())
    else:
        for item in dbaas.collection_names():
            if item != "admin_list":
                collection_list.append(item.upper())
                
    collection_list.sort()
    return collection_list

def get_platform_list(collection, dbaas):
    """
    get platform list from MongoDB for specific collection
    """
    platform_list = []
    for item in dbaas[collection].find():
        platform_info = item["_id"].replace("_", " ").split()
        if platform_info[0] not in platform_list:
            platform_list.append(platform_info[0].lower())
                
    platform_list.sort()
    return platform_list

def get_technology_list(collection, platform, dbaas):
    """
    get technology list from MongoDB for specific platform from specific collection
    """
    technology_list = []
    for doc in dbaas[collection].find():
        technology_info = doc["_id"].replace("_", " ").split()
        if technology_info[0] == platform.lower() and technology_info[1] not in technology_list:
            technology_list.append(technology_info[1].lower())
    
    technology_list.sort()
    return technology_list

def get_technology (collection, platform, technology, dbaas):
    """
    get commands and links from MongoDB for specific platform and technology from specific collection
    usefull in BDB only, for both Admin Portal and CSOne frontend formatted option is used 
    """
    tech_content = []
    tech_id = platform + "_" + technology
    doc = dbaas[collection].find_one({"_id" : tech_id})
    tech_content.append(doc["commands"])
    tech_content.append(doc["links"])

    return tech_content

def get_technology_formatted (collection, platform, technology, dbaas):
    """
    get commands and links from MongoDB for specific platform and technology
    platform and technology are keys and version has to be final, i.e. approved 
    format the output as html for Admin Portal and CSOne frontend
    """
    result_formatted = ""
    
    tech_id = platform + "_" + technology
    doc = dbaas[collection].find_one({"_id" : tech_id})
    cmd = doc["commands"]
    lnks = doc["links"]
    
    #result_formatted += "<div style='text-align:right'><span class='thumbs-down' style='color:red' title='Not so much'><img src='https://i.imgur.com/ny0MElN.jpg' alt=''></span>&emsp;<span class='thumbs-up' style='color:green' title='Like'><img src='https://i.imgur.com/ZCPRCLc.jpg' alt=''></span>&emsp;</div>"
    result_formatted += "</div><br></div><div align='left'><img src='https://i.imgur.com/f0vBigO.jpg' alt=''></div>"
    result_formatted += "<div style='text-align:center'><h4>" + platform.upper() + " --- " + technology.upper() + "</h4></div>"
    result_formatted += "<div><br><h4>" + "Useful Commands For Troubleshooting: (some commands syntax could vary according to platform or version)" + "</h4><br><br><div style='width:98%'"
    
    for item in cmd:
        if "//" in item:
            command, comment = item.split("//", 1)
            newItem = "<span>" + command + "</span>" + "<span style='color:blue; float:right'>" + comment + "</span>"
            result_formatted += newItem + "<br>"
        elif "Traces" in item:
            result_formatted += "<br><span><h4>" + item + "</h4></span><br>"
        elif "Debugs" in item:
            result_formatted += "<br><span><h4>" + item + "</h4></span><br>"
        elif "Techs:" in item:
            result_formatted += "<br><span><h4>" + item + "</h4></span><br>"
        else:
            result_formatted += "<span>" + item + "</span>" + "<br>"
    
    result_formatted += "<br><h4>" + "Support Links: (links can become obsolete at any time, send feedback to help maintain accuracy)" + "</h4><br><br>"
    
    for item in lnks:
        if "http" in item:
            if ">" in item:
                text, link = item.split(">", 1)
                result_formatted  += "<li><a href='" + link.strip() + "'target='_blank'>" + text + "</a></li>"
            else:
                result_formatted  += "<li><a href='" + item + "'target='_blank'>" + item + "</a></li>"
        elif "@" in item:
            result_formatted  += "<li><a href='mailto:" + item + "' target='_top'>Mailer : " + item + "</a></li>"

    
    result_formatted += "</div><br></div><div align='left'><a href='mailto:lighthouse-csone@cisco.com?Subject=Lighthouse%20Feedback' target='_top'>Comments/questions</a></div><br>"
    
    return result_formatted

# def get_rfa_list (dbaas):
#     # retrieve the list of combination platform+feature_creatorid from MongoDB 
#     # for non final version, i.e. Request for Approval list
#     retrieve_result = []
#     retrieve_set = []
#     for doc in dbaas["lighthouse"].find():
#         if "_final" not in doc["_id"]:
#             rfa_item = doc["_id"].replace("_", " ").split()
#             retrieve_set.append (rfa_item[0].lower() + "_" + rfa_item[1].lower() + "_" + rfa_item[2].lower())
    
#     for i in retrieve_set:
#         retrieve_result.append(i)

#     return retrieve_result

#     def get_rfa (platform, technology, owner, dbaas):
#         # retrieve the specific combination for platform_feature_creatorid from MongoDB 
#         # for non final version, i.e. Request for Approval list
#         rfa_result = []
#         rfa_id = platform + "_" + technology + "_" + owner
#         doc = dbaas["lighthouse"].find_one({"_id" : rfa_id})
#         rfa_result.append(doc["commands"])
#         rfa_result.append(doc["links"])

#         return rfa_result
                
#     def get_diffs (platform, technology, userid, dbaas):
#         diff_cmd = []
#         diff_lnks =[]
#         rfa_cmd =[]
#         rfa_lnk = []
#         fin_cmd = []
#         fin_lnk = []
#         rfa_id = platform + "_" + technology + "_" + userid
#         final_id = platform + "_" + technology + "_final"
#         rfa_data = dbaas["lighthouse"].find_one({"_id" : rfa_id})
#         fin_data = dbaas["lighthouse"].find_one({"_id" : final_id})
#         if fin_data:
#             for item in rfa_data["commands"]:
#                 if item:
#                     rfa_cmd.append(item)
#             for item in rfa_data["links"]:
#                 if item:
#                     rfa_lnk.append(item)
#             for item in fin_data["commands"]:
#                 if item:
#                     fin_cmd.append(item)
#             for item in fin_data["links"]:
#                 if item:
#                     fin_lnk.append(item)
                    
#             diff_1 = difflib.Differ().compare(fin_cmd, rfa_cmd)
#             for item in diff_1:
#                 #print(item)
#                 if item.startswith("+"):
#                     diff_cmd.append(item)
#                 if item.startswith("-"):
#                     diff_cmd.append(item)
#             diff_2 = difflib.Differ().compare(fin_lnk, rfa_lnk)
#             for item in diff_2:
#                 #print(item)
#                 if item.startswith("+"):
#                     diff_lnks.append(item)
#                 if item.startswith("-"):
#                     diff_lnks.append(item)
        
#         return diff_cmd, diff_lnks
        
#     def reject_rfa (platform, technology, owner, userid, dbaas):
#         #delete the selected RfA from mongoDB
#         update_result = []
#         rfa_id = platform.lower() + "_" + technology.lower() + "_" + owner
#         dbaas["lighthouse"].delete_one({"_id" : rfa_id})
#         result = "RfA for the {} and {} submitted by {} is rejected. Updated by {}.".format(platform.upper(), technology.upper(), owner, userid)
#         update_result.append(result)
#         email_output (result, result)
        
#         return update_result

#     def approve_rfa (platform, technology, owner, userid, dbaas):
#         #update the tag for selected RfA from mongoDB
#         update_result = []
#         rfa_id = platform.lower() + "_" + technology.lower() + "_" + owner
#         final_id = platform.lower() + "_" + technology.lower() + "_final"
#         doc = dbaas["lighthouse"].find_one({"_id" : rfa_id})
#         doc["_id"] = final_id
#         dbaas["lighthouse"].delete_one({"_id" : rfa_id})
#         dbaas["lighthouse"].delete_one({"_id" : final_id})
#         dbaas["lighthouse"].insert_one(doc)
#         result = "RfA for the {} and {} submitted by {} is approved. Updated by {}.".format(platform.upper(), technology.upper(), owner, userid)
#         update_result.append(result)
        
#         updated_doc = str(dbaas["lighthouse"].find_one({"_id" : final_id}))
#         email_output (result+"Final document", pretty_email(updated_doc))

#         #email_output (result, result)
        
#         return update_result

#     def delete_tech(platform, technology, admin_status, userid, dbaas):
#         update_result = []
#         doc_id = platform.lower() + "_" + technology.lower() + "_final"
#         if admin_status:
#             deleted_doc = str(dbaas["lighthouse"].find_one({"_id" : doc_id}))
#             dbaas["lighthouse"].delete_one({"_id" : doc_id})
#             result = "Document for the {} and {} removed by {}.".format(platform.upper(), technology.upper(), userid)
#             update_result.append(result)
#             email_output (result, deleted_doc)
#         else:
#             update_result.append("Document for the {} and {} removal is denied.".format(platform.upper(), technology.upper()))
        
#         return update_result

    def update_db (platform, technology, commands, links, admin_status, userid, dbaas):
        # create new document in mongoDB with 'final' tag for admin group and without such tag for non-admin group
        # or update exisitng group with keep the tag for admin group and changing the tag for non admin group
        update_result = []
        final_doc = {}
        rfa_doc = {}
        
        final_flag = False
        
        final_id = platform.lower() + "_" + technology.lower() + "_final"
        rfa_id = platform.lower() + "_" + technology.lower() + "_" + userid
        
        final_doc["_id"], final_doc["commands"], final_doc["links"] = final_id, commands.split("\n"), links.split("\n")
        rfa_doc["_id"], rfa_doc["commands"], rfa_doc["links"] = rfa_id, commands.split("\n"), links.split("\n")
        
        doc = dbaas["lighthouse"].find_one({"_id" : final_id})
        if doc:
            if doc["_id"] == final_id:
                final_flag = True

        if admin_status and final_flag:
            result = "Combination {} and {} is already in DB. Updated by {}.".format(platform.upper(), technology.upper(), userid)
            deleted_doc = str(dbaas["lighthouse"].find_one({"_id" : final_id}))
            update_result.append(result)
            email_output (result+"Original documnet", pretty_email(deleted_doc))
            
            dbaas["lighthouse"].delete_one({"_id" : final_id})
            dbaas["lighthouse"].insert_one(final_doc)
            
            updated_doc = str(dbaas["lighthouse"].find_one({"_id" : final_id}))
            email_output (result+"Final documnet", pretty_email(updated_doc))
                
        if admin_status and not final_flag:
            result = "Combination {} and {} is new. Added by {}.".format(platform.upper(), technology.upper(), userid)
            update_result.append(result)
            email_output (result, result)
            dbaas["lighthouse"].insert_one(final_doc)

        if not admin_status:
            result = "Combination {} and {} combination updated or added by {}.".format(platform.upper(), technology.upper(), userid)
            update_result.append(result)
            email_output (result, result)
            dbaas["lighthouse"].insert_one(rfa_doc)

        return update_result

#     def get_backup(dbaas):
#         # backup data from MongoDB and save the file in local BDB folder with today's timestamp
#         today = datetime.date.today()
#         file_name_txt = "lighthouse_backup_file_" + str(today) + ".txt"
#         file_name_zip = "lighthouse_backup_file_" + str(today) + ".zip"
#         with open (file_name_txt, "w") as file:
#             for item in dbaas["lighthouse"].find():
#                 file.write(str(item))
#         with zipfile.ZipFile(file_name_zip, 'w') as myzip:
#             myzip.write(file_name_txt)
            
#         return file_name_zip

#     def email_output(email_subject, email_content):
#         email_to = "lighthouse-csone@cisco.com"
#         smtp_server = '173.37.113.194'
#         email_from_name = 'Lighthouse V3 backend'
#         email_from_address = 'no-reply@cisco.com'
#         msg = "From: " + email_from_name + " <" + email_from_address + ">\nTo: " + email_to + "\nSubject: " + email_subject + "\n\n" + email_content
#         try:
#             server = smtplib.SMTP(smtp_server, 25)
#             server.sendmail(email_from_address, email_to, msg)
#             server.close()
#         except:
#             raise
#             logger.info("email failed")

#     def pretty_email(email_content): #convert string representation of a dictionary to a dictionary; to arrange content in a readable fashion in email
#         Commands_sec = "\t\n".join(ast.literal_eval(email_content)['commands']).strip()
#         links_sec =  "\t\n".join(ast.literal_eval(email_content)['links']).strip()
#         pretty_email_result = "Commands:\n"+Commands_sec+"\n\n"+"Links:\n"+links_sec

#         return pretty_email_result
    