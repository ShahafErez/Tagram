<img src="frontend/static/frontend/small_logo.png" width="350px"/>

# Tagram: Tag, Annotate, and Model User Stories

Tagram is a web platform designed as an infrastructure for processing, tagging, and modeling sets of user stories. Developed to meet the research requirements of Mr. Maxim Bargilovsky and Prof. Arnon Sturm, Tagram facilitates the management of labeling projects. The labeled data from these projects serves as the training dataset for a machine learning model, extracting relationships and entities from user stories presented in various forms.

## Features at a Glance

- **User Management:** Sign up and log in to tie your actions to your account.
- **Create New Annotation Projects:** Project managers can create new projects, upload data files, set names and descriptions, enable metatagging, and add annotators.
- **Create Meta-Tagging:** Define new meta-tagging according to desired models, choosing tag names, colors, and types (tag/relation). Select from existing meta-tagging.
- **Tagging Process:** Annotate tags, relations, and co-occurrences, save all tagging in the system, and export it to a file.
- **Tagging Statistics:** Project managers can monitor statistics comparing different taggers.
- **User-Stories Correction:** Correct spelling mistakes and check user story templates.
 
## Tagram future steps
- **Automatic tagging** Automatic tagging of user stories based on machine learning algorithm.


## Try out Tagram
https://tagram.cs.bgu.ac.il/

### Run locally with the following commands

run Tagram server: 
```
python manage.py runserver 
```

The frontend part of Tagram app lies in the `frontend/` folder and written in React JS. In case you've made some changes there, the following commands should be run before building / starting the instance:
```
cd frontend
npm install                                                  
npm run dev
```

## Why "Tagram"?

consists of "TAG" and "GRAM". The process starts with manual tagging and ends with diagram created by a machine learning algorithm.
Our logo is a Tangram puzzle (sounds like Tagram) in the shape of a camel that represents Ben Gurion University

## Meet our team
The team members are Chen Mordehai, Shahaf Erez, Shani Rahamim and Noa Shpack.
We are software & information systems engineering students at Ben Gurion University.
