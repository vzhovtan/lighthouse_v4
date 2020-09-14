from pymongo import MongoClient
import json

clientv4 = MongoClient(
    'mongodb://lighthouse_v41_backend:a958935c0a9a9d21709711cacf2374dfea743d5e@bdb-user-alln-2.cisco.com:27000/?authSource'
    '=task_lighthouse_v41_backend&authMechanism=MONGODB-CR')
mydb4 = clientv4["task_lighthouse_v41_backend"]

#Getting all document from MongoDB collection
collection_list = []
restricted_item_admin = ["admin", "webexbot", "event", "commander", "test", "draft", "new", "copy"]

for collection_name in mydb4.collection_names():
        collection_list.append(collection_name.lower())
result_list = [collection for collection in collection_list if all(item not in collection \
                                                                   for item in restricted_item_admin)]

print(result_list)
save_list = []

for collection in result_list:
    current_collection = mydb4[collection]
    for doc in current_collection.find():
        save_doc = {}
        save_doc["platform"] = doc.get("platform")
        save_doc["component"] = doc.get("component")
        save_doc["release"] = doc.get("release")
        save_doc["submitter"] = doc.get("sumitter")          
        save_doc["commands"] = doc.get("commands")
        save_doc["links"] = doc.get("links")
        save_list.append(save_doc)

# with open("lhv4_database.json", "w") as file:
#     file.write(json.dumps(save_list))

# for collection in result_list:
new_list = []
current_collection = mydb4['ios-xr']
new_collection = mydb4['ios-xr-new']
for doc in current_collection.find():
    new_doc = {}
    new_doc["platform"] = doc.get("platform")
    new_doc["feature"] = doc.get("component")
    new_doc["release"] = doc.get("release")
    new_doc["submitter"] = doc.get("submitter")          
    new_doc["commands"] = doc.get("commands")
    new_doc["links"] = doc.get("links")
    new_list.append(new_doc)


for item in new_list:
    print(item)
    insert_result = new_collection.insert_one(item)
    print("Inserted result is :" + str(insert_result.acknowledged))