Oi App - A Chat Application

## Links
- [Deployed Client] (https://ga-fantastic-five.github.io/oi-app-client/#/)
- [Client Repo] (https://github.com/GA-Fantastic-Five/oi-app-client)
- [Deployed API] (https://oi-chat-api.herokuapp.com/)

## Description:
The Oi chat application is a group project where mob and pair programing is used to create a simple chat application where the user can chat and interact with others. Working in a group setting and learning new concepts such as socket io and react pushed each individual as a developer and showed each persons strengths. While also developing strategies to be better productive team work by using scrum and agile concepts to plan and discuss the moving parts of our project.


## Planning Story
- Create wireframes and ERD.
- Create and test authorization events using curl scripts.
- Create user and profile models.
- Create user routes and profile routes.
- Connect Socket.io to our client in our server.js



## User Stories
•	The User should be able to create an account, (sign-in, sign-out, change password, sign-out, get a default-nickname, and a default avatar)
•	The user should be able to edit their default profile and create a nickname and avatar of their choice
•	The user can only have one profile
•	The user should be able to view all available profiles
•	The user should be able to chat and see other users who are online
•	The User should be able to create an account, (sign-in, sign-out, change password, sign-out, get a default-nickname, and a default avatar)
•	The user should be able to edit their default profile and create a nickname and avatar of their choice
•	The user can only have one profile
•	The user should be able to view all available profiles
•	The user should be able to chat and see other users who are online



## Technologies Used
- Express
- Mongoose
- Socket.io
- MongoDb
- Heroku
- Javascript
- Bcrypt
- Passport

## Authentication
| Verb   | URI Pattern            | Controller#Action |
|:-------|:-----------------------|:------------------|
| POST   | `/sign-up`             | `users#signup`    |
| POST   | `/sign-in`             | `users#signin`    |
| PATCH  | `/change-password`     | `users#changepw`  |
| DELETE | `/sign-out`            | `users#signout`   |
## Profile Routes
| Verb   | URI Pattern           | Controller#Action|
|:-------|:----------------------|:-----------------|
| GET    | `/profiles`           | `profiles#index` |
| GET    | `/profiles/:nickname` | `profiles#show`  |
| GET    | `/profile/`           | `profile#show`   |
| POST   | `/profiles`           | `profiles#create`|
| PATCH  | `/profile/`           | `profile#update` |
| DELETE | `/profile/`           | `profile#destroy`|

## WireFrames
![ERD](./erd.png)
