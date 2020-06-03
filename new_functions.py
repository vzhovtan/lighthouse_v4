from __future__ import unicode_literals, absolute_import, print_function
import bdblib
from pymongo import MongoClient

def task(env, action, collection="None"):
    """
    Test BORG module for LHv4.1, trying to improve perfomance by loading entire collection in advance
    """
    result = bdblib.TaskResult()

    backend_action = action.lower()
    if backend_action == "get_collection_list":
        collection_list = get_collection_list()
        result.append(collection_list)
    elif backend_action == "get_collection_data":
        collection_data = get_collection_data(collection)
        result.append(collection_data)
    else:
        result.append("Action is invalid")

    return result

def get_collection_list():
    """
    get collection list from MongoDB
    """
    clientv4 = MongoClient('mongodb://lighthouse_v41_backend:a958935c0a9a9d21709711cacf2374dfea743d5e@bdb-dbaas-alln-1:27000/?authSource'
                           '=task_lighthouse_v41_backend&authMechanism=MONGODB-CR')
    mydb4 = clientv4["task_lighthouse_v41_backend"]

    restricted_item = ["admin", "webexbot", "event", "commander"]
    collection_list = []
    result_list = []

    for collection_name in mydb4.collection_names():
        collection_list.append(collection_name.lower())

    result_list = [collection for collection in collection_list if all(item not in collection for item in restricted_item)]
    result_list.sort()
    return result_list

def get_collection_data(collection):
    """
    get platform list from MongoDB for specific collection
    """
    clientv4 = MongoClient('mongodb://lighthouse_v41_backend:a958935c0a9a9d21709711cacf2374dfea743d5e@bdb-dbaas-alln-1:27000/?authSource'
                           '=task_lighthouse_v41_backend&authMechanism=MONGODB-CR')
    mydb4 = clientv4["task_lighthouse_v41_backend"]
    
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