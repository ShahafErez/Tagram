
## What is Tagram?

##### A WEB platform that is an infrastructure for processing, tagging and modeling a set of user stories.
##### The system was built in order to support our mentors research requirements (Mr. Maxim Bargilovsky and Prof. Arnon Sturm). 
##### This system will allow manage labeling projects, whose products will constitute the data that will train the ML model 
##### (that extracts relationships and entities from a set of requirements presented in the form of user stories).

## What you get from Tagram

![Tagram demo](https://ibb.co/SrHXGjz)

- **User managment** Sign up and login, when you make actions it's tied to your account.
- **Create new annotation project** Project manager can create new project, uploat data file, set its name and description, set metatagging and add annotaitors.
- **Create meta-tagging** Create new meta-tagging according to the desired model, choose tags names, color and type (tag/relation). Select from the existing meta-tagging.
- **tagging process** Let you annotate tags, relations and co-occurrence, save all tagging in the system and export to file.

## Tagram future steps

- **Tagging statistics** Project manager can watch statistics of comparison between different taggers.
- **User-stories correction** Let you correct spelling mistakes and check user stories template.
- **Automatic tagging** Automatic tagging of user stories based on machine learning algorithm.


## Try out Tagram


### Run locally with the following commands

run Tagram server: 
```
python manage.py runserver 
```

The frontend part of Tagram app lies in the `frontend/` folder and written in React JS. In case you've made some changes there, the following commands should be run before building / starting the instance:
```
cd frontend                                                  
npm run dev
```

### The site will be published at the following address: 
https://www.tagram.cs.bgu.ac.il/


## Why Tagram?
consists of "TAG" and "GRAM". The process starts with manual tagging and ends with diagram created by a machine learning algorithm.
Our logo is a Tangram puzzle (sounds like Tagram) in the shape of a camel that represents Ben Gurion University


## Meet our team
The team members are Chen Mordehai, Shahaf Erez, Shani Rahamim and Noa Shpack.
We are software & information systems engineering students at Ben Gurion University.
For more information please contact us:
tagram.bgu@gmail.com
