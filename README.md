# theTasters

A food/restaurant rating website project (i.e. Yelp clone) done for educational purposes in a group of three over the course of a couple of months.

With regards to this README, below are setup instructions, project directory structure, and a list of pages with screenshots.

# Instructions for running website/server

Node.js (and npm) are required for this server to run. Furthermore, mongodb might require some setup on your system. It's also possible there are other dependencies missing on your system, so some debugging/setup might be needed. In any case, this is how I run the server:

### Terminal 1
```
mkdir data
mongod --dbpath data
```

### Terminal 2
```
mongoimport -d ttdb_sample -c users sample_data/users.json
mongoimport -d ttdb_sample -c restaurants sample_data/restaurants.json
mongoimport -d ttdb_sample -c menus sample_data/menus.json
mongoimport -d ttdb_sample -c meals sample_data/meals.json
mongoimport -d ttdb_sample -c reviews sample_data/reviews.json

npm install
npm start
```

Navigate to http://localhost:3000 on your browser.

# Project directory structure

```
/app                    #all code is in here
/app/app.js             #main entry point to server
/app/app.models.js      #all models init/boilerplate code
/app/app.mongo.js       #all mongo init/boilerplate code
/app/app.router.js      #all router init/boilerplate code

/app/public             #public resource folder
/app/public/index.ejs   #container for all pages (includes, navs, links, etc here)
/app/public/assets      #all css/imgs/downloaded libs
/app/public/pages       #main pages
/app/public/partials    #reused page elements (e.g. menu item)
/app/public/services    #reusable services/containers for all AJAX calls

/app/<feature>          #folder for routes/models needed for a feature to work

/sample_data            #some sample data to start out with
```

# Assets

Assets borrowed from online
- font-awesome (icon pack)

Custom made assets
- minimal-form (custom minimal design for forms)
- ratings (5-star ratings, design and functionality)
- cards (material design inspired cards)
- buttons (custom button styles)

# Pages and page functionality/features

### Home Page
- cover/launch page with search bar
- search bar is animated and follows user when user scrolls
- search results (not fully implemented - just populates all restaurants)
- results are expandable and expansion is animated
- map (responsive to search, but not connected to restaurants listed)

![alt text](http://i.imgur.com/kiADvaw.jpg)
![alt text](http://i.imgur.com/hzIScY7.png)
![alt text](http://i.imgur.com/Jj2fAhs.png)

### Restaurant Page
- restaurant photo
- restaurant info (name, location, ratings)
- restaurant menus (clickable and expandable with animations)

![alt text](http://i.imgur.com/NyFP92S.png)
![alt text](http://i.imgur.com/PmxPzLd.png)

### Meal Info Page
- meal photo
- meal info (name, restaurant, ratings)
- reviews listed
- ability to submit review (assuming logged in)

![alt text](http://i.imgur.com/LObE5KR.png)

### Sign Up/Sign In Page
- sign in form (verifies login info)
- sign up form

![alt text](http://i.imgur.com/6b6sAui.png)

### User Profile (customer vs business owner) Pages
- user information
- user reviews
OR
- business owner info
- restaurants owned

![alt text](http://i.imgur.com/7AJppe8.png)
![alt text](http://i.imgur.com/zUjaPzd.png)

### Account Management
- form to modify user info
- form to delete account

![alt text](http://i.imgur.com/9qiDF7p.png)

### Pages react to users
- using express-sessions to manage different users being logged on at once
- persistent icons and additional options in the nav bar if users are logged in
- users have a type, based on what they selected on profile creation, and that type dictactes some of the content they see

![alt text](http://i.imgur.com/AuztNHU.jpg)

- logged in users can leave reviews

![alt text](http://i.imgur.com/q9XaGUE.png)

- restaurant owners are able to modify their restaurant info, add menus, and modify/delete menus
- they're also able to modify the meals on their menus
- all editing functionality is hidden and is animated into view when the appropriate edit/add button is pressed

![alt text](http://i.imgur.com/EGTSY4h.png)
![alt text](http://i.imgur.com/ISxCLKJ.png)


### Responsive design

0px <= A < 800px <= B < 1280px <= C

- A: mobile/small display

![alt text](http://i.imgur.com/nx9ZaUC.png)

- B: medium display

![alt text](http://i.imgur.com/OUYlH1a.png)

- C: large display

![alt text](http://i.imgur.com/LObE5KR.png)
