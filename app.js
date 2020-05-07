require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });
  
  // Retrieve an access token
  spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));

// Our routes go here:

app.get('/', (request, response) => {
    response.render('home');
  });

app.get('/artist-search', (request, response) => {
    const term = request.query.term;
    spotifyApi
      .searchArtists(`${term}`)
      .then(data => {
        // console.log('The received data from the API: ', data.body);
            // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
            const dataArtist = data.body.artists.items;
            // console.log('The received data from the API - artists: ', dataArtist);
            // console.log('The received data from the API - image: ', data.body.artists.items[0].images);
        response.render('artist-search-results', { dataArtist });
      })
      .catch(err => console.log('The error while searching artists occurred: ', err));
  });

app.get('/albums/:id', (request, response, next) => {
    const id = request.params.id;
    spotifyApi
      .getArtistAlbums(id)
      .then(data => {
          const album = data.body.items;
        console.log('Artist albums', {album});
            // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
        response.render('albums', { album });
      })
      .catch(err => console.log('The error while searching albuns occurred: ', err));
  });

  


  

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
