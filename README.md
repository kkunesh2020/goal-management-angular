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

### Help
A page that displays FAQ and contact information

### Home
Home page of app. Allows for google sign in and sign up

### Navbar
Navbar containing Home button, Help button, and Log out button

### Side Navbar
Navbar displayed for users using a mobile device. Contains same buttons listed above

## Teacher Components

### Class List
Shows a teacher's classes

### Class
Shows a teacher's assigned goals and student data on a table

### View Goal Data Components

#### Goal Dashboard

#### Goal Details

#### Student Bar

### View Student Data 


## Dialog Components

### Change Status

### Create Goal

### Create Student Goal

### Delete Goal

### Edit Goal

### Update Goal

### Uploader

### Upload Commit

### Upload Link

## Services

### Auth

### Class

### GitHub

### Goal Student Data

### Goal 

### Home

## Ideas for New Features

### Add a Director role for maintaining/assigning classes and student information

### Improve data display

### Redesign Submit Work Dialog Popup

## Next Steps For Goal Management

### Improve Design

### Get a single class to test the app


