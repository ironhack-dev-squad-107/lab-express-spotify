// ------------- REINFORCEMENT LESSON --------------
const express = require("express");
const hbs = require("hbs");

// require spotify-web-api-node package here:
const SpotifyWebApi = require("spotify-web-api-node");

const app = express();

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

// setting the spotify-api goes here:

const clientId = "f1b730f047674d1cbabbebf2e386c5b4",
  clientSecret = "b4a346f4c0e74520a52fd07a815375a5";

const spotifyApi = new SpotifyWebApi({
  clientId: clientId,
  clientSecret: clientSecret
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then(data => {
    spotifyApi.setAccessToken(data.body["access_token"]);
  })
  .catch(error => {
    console.log("Something went wrong when retrieving an access token", error);
  });

// the routes go here:

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);

app.get("/", (req, res, next) => {
  res.render("index");
});

app.get("/artists", (req, res, next) => {
  const { artist } = req.query;

  spotifyApi
    .searchArtists(artist)
    .then(data => {
      // res.json(data.body.artists.items);
      res.locals.artistArray = data.body.artists.items;
      console.log("The received data from the API: ", data.body);
      res.render("artists");
    })
    .catch(err => {
      console.log("The error while searching artists occurred:", err);
    });
});

app.get("/album/:artistId", (req, res, next) => {
  const { artistId } = req.params;
  spotifyApi
    .getArtistAlbums(artistId)
    .then(data => {
      // res.json(data.body.items);
      res.locals.AlbumArray = data.body.items;
      res.render("albums");
    })
    .catch();
});

app.get("/tracks/:albumId", (req, res, next) => {
  const { albumId } = req.params;
  spotifyApi
    .getAlbumTracks(albumId)
    .then(data => {
      // res.json(data.body.items);
      res.locals.trackArray = data.body.items;
      res.render("tracks");
    })
    .catch();
});
