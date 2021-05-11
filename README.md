### Lighthouse V4

Lighthouse is developed by Cisco TAC engineers for engineers providing common resource of useful commands and support links to help in troubleshooting.


Lighthouse is internal project and has been created with idea to use BDB as a backend and JS as frontend on CSOne. V1 and V2 were created purely with JS and all information has been saved in .txt files.
V3 has been created to overcome the limitation with scalability and maintainability. However, V4 is needed to accommodate multiple platforms and technology as project is gaining popularity.

 BDB aka Big Data Broker is internal Cisco backend to run custom Python and JS scripts and using MongoDB as database. This version of Lighthouse utilizes MongoDB and saves data in different collections for different platforms. Each entry in DB represents particular feature as a key and contains troubleshooting information as value.

BDB supports REST API and so Lighthouse backend built with Python using REST API to BDB for ingesting data into MongoDB or retrieving the data from database.

There are two frontends are created with JS. Admin one includes functions to update DB, get usage statistics and so on.
This one built with:

* `index.js`

which is main JS file and the entire JS code is distributed among different JS files to make maintenance easier:

* `index.html`

and

* `index.css`

Are for the admin frontend HTML file. The functionality of the admin frontend has not been changed comparing with V3, it is just updated view.
Second frontend designed to run in Salesforce Lightning CSOne platform and using Greasemonkey and Tampermonkey (since new version of CSOne app has been released):

* `lbjb_lite_front_end.js`

Backend file is (the name has been changed to align with internalBDB requirements:

* `init.py`


There is complete DB file taken from MongoDB and saved in JSON format for local testing and further development.

* `lhv4_database.json`
