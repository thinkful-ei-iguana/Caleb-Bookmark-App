# My Bookmarks App

## User Stories

As a user:

I can add bookmarks to my bookmark list. Bookmarks contain:
* title
* url link
* description
* rating (1-5)

I can see a list of my bookmarks when I first open the app

All bookmarks in the list default to a "condensed" view showing only title and rating
I can click on a bookmark to display the "detailed" view

Detailed view expands to additionally display description and a "Visit Site" link
I can remove bookmarks from my bookmark list

I receive appropriate feedback when I cannot submit a bookmark

Check all validations in the API documentation (e.g. title and url field required)
I can select from a dropdown (a select element) a "minimum rating" to filter the list by all bookmarks rated at or above the chosen selection

## Technical Requirements

Used fetch for AJAX calls and jQuery for DOM manipulation

Used namespacing to adhere to good architecture practices

Minimal global variables

Created modules in separate files to organize my code

Logically grouped my functions (e.g. API methods, store methods...)

Kept my Data out of the DOM

No direct DOM manipulation in my event handlers.

Followed the React-ful design pattern - changed my state, re-rendered my components

Used semantic HTML

Used a responsive and mobile-first design

Visually and functionally solid in viewports for mobile and desktop

Followed a11y best practices