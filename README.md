# IDF Championship in Medicine App

This app is for the annual IDF championship in medicine to facilitate the workflow during rounds and the subsequent summation of competitors grades.

## Link to the app: [IDF-Med-Champ](https://idf-med-champ.web.app/)

To see entire app functionality, use pincode 1111. First press on קבלת נתונים מהענן and enter a nickname for the phone.  
Then, go to הגדרת מכשירים עבור תחנה to define which devices are to be tested on in a given station.

## App use explanation

The real version of this app was used (and will be re-used every year) in the annual championship in medicine. Among the stations of the championship was the Medical Engineering station which tested soldiers on knowledge and operation of medical devices.  
Each group of soldiers entered a classroom with stations - in each station a different medical device to be tested on. There were four types of soldier groups (called בית), each specializing in their own devices, therefore requiring us to define the appropriate device for each group type in each station.  
Once a group (each containing 3 competitors - and in total 30 groups) entered our classrooms, we checked which type they are and right away had the relevant exam ready on every station phone. It should be noted that my team was made up of 15 staff members, and I had to build the app in such a way that minimized any room for confusion - the process of pre-defining the devices per station (aka per phone) was done by the station commander, leaving the testing crew having to only choose the group type and unit name and to oversee the soldier as they take the test.  
The tests included 5 types of questions: multiple choice (one correct, many correct), drag question (drag stickers onto the appropriate place), order question (put steps in the right order), and operation assessment (operate the medical device and have the overseeing staff member mark whether each step was done or not).  
Upon submission of exam, scores were calculated automatically and shown in table form in טבלת ניקוד.  
It should be noted that whenever we were required to report the scoretable status we had the staff members press on the top-left side and upload scores to the cloud. The station commander sat outside the 3 classrooms and consumed all scores from all 15 phones via קבלת נתונים מהענן. Thereafter, all scores showed up in the consuming phone's scoretable in a well-organized manner.  
At the end of the championship a winning group from each group type was easily reported since it was automatically calculated for us by the app. Also, all scores and answers were extracted from the Mongo database and put in Excel form for later analysis. Such analysis gives the Medical Corps a picture about soldier competence in medical device operation and allows for pinpointing any knowledge gaps in every unit such that the Medical Engineering branch can come and do training programs accordingly.

## App influence

It is important to note that before I built this app, the IDF Championship in Medicine was done completely manually with papers and pens, and so was calculation of points.  
The intensive nature of this championship, having 30 groups be tested for 20 minutes each one after the other, made it impossible for the testing staff to report scores on time and in an accurate manner. Having this app introduced in the 2022 championship lifted all of this stress and allowed for a smooth and efficient process that everyone enjoyed.

## Sterile version

This version of the app is sterile, meaning that the real questions and unit names used in the real app in June 2022 were excluded. Dummy unit names and questions are used instead to show functionality.
