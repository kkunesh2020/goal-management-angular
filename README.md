# Goal Management Contributor's Guide

*What is Goal Management?*
- Goal Management project allows Chadwick teachers to assign goals to their students and keep track of each student's progress. The students can view goals created by their teachers and choose to turn in their work via file, link, or Git commit format. The core mission of Goal Management is to improve the communication between teachers and students, and to enhance student productivity

## Cloning the project

Navigate to a directory within your terminal and run:

`git clone https://github.com/ChadwickSchool/goal-management-angular.git`

If not working on main, `git checkout` a new branch:

`git checkout -b [branch name here]`

If you want to work on existing branch run, `git checkout` a existing branch:

`git checkout [branch name here]`

This project was generated with Angular CLI version 8.0.3.

## Running the Project during Development

1. Navigate into the root directory of the Goal Management project
2. Run ``ng serve``

## Deploying your changes
1. Run ``ng build``
2. Run ``firebase deploy``

## General Components

### Goals
Shows goals assigned to student in a table

Methods:
```ts
// get goals for student given a goal array containing goal document refs
  getStudentGoals(goalArray: DocumentReference[])
  
// opens a change-status or update-goal dialog
  openDialog(data: any, userID: string, isCompleted: boolean, status: string)
```

### Help
A page that displays FAQ and contact information

### Home
Home page of app. Allows for google sign in and sign up

Methods:
```ts
// returns whether a specific goal is completed by the user
  goalIsCompleted(hasCompleted: string[], userID: string)
```

### Navbar
Navbar containing Home button, Help button, and Log out button

### Side Navbar
Navbar displayed for users using a mobile device. Contains same buttons listed above

## Teacher Components

### Class List
Shows a teacher's classes

Methods:
```ts
// opens a specific class
  goToCard(classID: string)
  
// gets classes for specific user
  getClasses(userId: string)
```

### Class
Shows a teacher's assigned goals and student data on a table

Methods:
```ts
// get all student data for a specific class
  getStudentData()
  
// opens a page containing data about a specific student
  openStudentData(studentID: string)
```

### View Goal Data Components

#### Goal Dashboard
Displays information about a specific goal

Methods:
```ts
// go back to clas page
  navigateBack()
  
// get a specific class for teacher
  getClass(id: string, teacherUID: string): Promise<any>
  
// get the goal 
  getGoal(): Promise<any>
```

#### Goal Details
Shows goal information along with student goal status

Methods:
```ts
// opens up link in another tab
  goToLink(urlToOpen: string)
```

#### Student Bar
Shows all the students assigned to a specific goal

Methods:
```ts
// get students assigned this goal
   getStudentData() 
   
// method for viewing students stats on goal  
   viewStudentData(uid: string)
   
// method for viewing all goal stats
viewStudentsData()
```

### View Student Data 
View student information and progess on goals within a specific class

Methods:
```ts
// go back to clas page
  navigateBack()
  
// get data for a specific student
  getStudentData()
  
// get goals for the student
  getStudentGoals(): Promise<any>
  
// navigate to a specific goal page
  navigateToGoal(goalID: string)
  
// check if a goal is completed
  isCompleted(goal: GoalStat): Promise<boolean>

// sorts goals by whether they are missing or completed
sortGoals()
```

## Dialog Components

### Change Status
Dialog that pops up when student wants to accept or decline a goal

Methods:
```ts
// marks goal as rejected
  rejectGoal(status: boolean)
  
// updates status of goal
  updateStatus(status: string)
```

### Create Goal
Allows a teacher to create a goal for a specific class

Methods:
```ts
// assign all students in a class to a goal
  assignAllStudents()
  
// return if the form is completed or not
  formComplete(): boolean

// assign specific student to a goal
  checkSpecific(studentID: string, assigned: boolean)

// reset assign students array
  resetList()
  
// create the goal 
  createGoal()
```

### Create Student Goal
Allows a student to create a individual goal for a specific class

Methods:
```ts
// return if the form is completed or not
  formComplete(): boolean
  
// create the goal 
  createGoal()
```

### Delete Goal
Popup that confirms whether or not a user wants to delete their goal

Methods:
```ts
// deletes a goal
  deleteGoal()
```

### Edit Goal
Allows a teacher to edit a goal

Methods:
```ts
// return if the form is completed or not
  formComplete(): boolean
  
// edit the goal 
  editGoal()
```

### Update Goal
Allows a student to edit a goal (mark as complete, upload work, etc)

Methods:
```ts
// updates a goal
  updateGoal(isDone: boolean)
  
// opens insert file dialog
  insertFileDialog()
  
// authorizes user's GitHub account with the Gihub API and allows user to select their GitHub commit
  viewGithubCommit()
  
// opens the insert link dialog
  insertLinkDialog()

// find position of file in the file array
  findIndexOfFile(file: FileClass)
  
// deletes a specific file from the goal 
  deleteFile(file: FileClass)
  
// deletes a specific link from the goal 
  deleteLink(url: string)
  
// open up link in another tab
  goToLink(urlToOpen: string)
```

### Uploader
A popup that allows a user to upload a file via button or drag and drop

Methods:
```ts
// toggles hover effect
  toggleHover(event: boolean)
  
// toggles drag effect
  toggleDrag(event: boolean)
  
// upload file to FB storage
  async onDrop(files: FileList)
  
// upload file data to firebase storage and database field
  async uploadFile(file: File): Promise<FileClass>
  
// pass back files data to dialog
  addFiles()
```

### Upload Commit
Allows a student to upload a github commit

Methods:
```ts
// sets commit data array of a selected Github repository
  selectedRepo(commitLink: string, repoName: string)
  
// attaches selected commit to goal
  addCommit() 
```

### Upload Link
A popup that allows a student to upload a link to their work

Methods:
```ts
// add link to goal object
  addLink()
```

## Services

### Auth
Provides current user data and methods for google auth, github signin, and update user

### Class
Provides methods for getting class information and updating class status

### GitHub
Provides methods for viewing a users GitHub repositories and specific commits of a repository

### Goal Student Data
Methods for getting information of a specific student 

### Goal 
Methods for getting information about goals and modifying a specific goal

### Home
Provides methods used in the home componenet (getting user data and goals)

## Ideas for New Features

### Add a Director role for maintaining/assigning classes and student information
As of now, there is no convenient method for creating classes and assigning students + teachers to those classes. A director role could be used to manually create classes and assign users to them, and avoid the hassle of manually assigning users to classes within the database

### Improve data display
The project uses data tables to display goal information + class data. Could we find a better way to show the data?

### Show private GitHub commits 
Currently, the GitHub submit feature only allows users to select from public repositories and commits. This feature should be expanded to include private Github repositories as well

### Redesign Submit Work Dialog Popup
Right now the submit work dialog shown to a student when they click on a specific goal has a unclear and unaesthetic design that makes it difficult for a user that wants to upload their work and mark their goal as complete. This should be redesigned to be more clear and attractive

## Next Steps For Goal Management

### Improve Design
As of now, Goal Management has a rudimentary design containing default Angular Material designs. In the near future, it would be ideal to redesign the entire site

### Get a single class to test the app
Goal Management is currently in the development / prototyping phase. It would be ideal in the upcoming months to get a small class to test the app and provide feedback


