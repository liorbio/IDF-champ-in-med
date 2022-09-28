# IDF Championship in Medicine App

This app is to be used on the annual IDF championship in medicine to facilitate the workflow during rounds and the subsequent summation of competitors grades.

## Instructions for Medical Engineering Department

To add new questions, add JSON objects in the questions JSON file (may be later migrated to a Mongo database and used via a GUI).

Please make sure to write device name correctly and consistently since all device names inserted are used to create a list of devices to pick from upon station setup - e.g. having a question with "ECG" and a question with "EKG" will cause two different devices to appear, each containing its respective question, instead of one "ECG" module.
