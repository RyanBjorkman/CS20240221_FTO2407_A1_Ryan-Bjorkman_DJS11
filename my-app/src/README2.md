Project Overview

The Podcast App is a React-based application that allows users to explore a curated list of podcasts. Users can filter and sort podcasts, view detailed information about each show, and manage their favorite episodes. The app integrates with an external API to fetch and display podcast data.

Features

Fetch and Display Podcasts:
Podcasts are fetched from an external API upon app load.
Additional details for each podcast, such as genres and seasons, are fetched dynamically.
Filtering and Sorting:
Users can filter podcasts by genre.
Sort options include alphabetical (A-Z, Z-A) and by last update (most recent or oldest).
Favorites Management:
Users can add podcasts to their favorites.
Favorites are persisted using localStorage and can be reset via the interface.
Detailed Views:
Clicking on a podcast displays detailed information, including seasons, episodes, and descriptions.
Custom Audio Player:
A persistent audio player allows users to play podcast episodes with custom controls, including play/pause, rewind, and forward.
Routing:
React Router handles navigation between home, favorites, and detailed views.
App Structure

Components:
App.jsx: Main application component.
ShowDetails.jsx: Displays detailed podcast information.
Favorites.jsx: Lists user's favorite podcasts.
Routing:
/: Home page with a list of podcasts.
/favorites: Displays user's favorite podcasts.
/show/:id: Detailed view for a specific podcast.
State Management:
useState: Manages states for podcasts, favorites, audio playback, genre filtering, and sorting.
useEffect: Handles API data fetching and local storage synchronization.


Contact info
Ryan Bjorkman 
Tel: 0813019676
Email: ryanbjorkman@icloud.com