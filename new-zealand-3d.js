// Initialize the engine with a location and inject into page
const container = document.getElementById( 'container' );
const parkList = document.getElementById( 'park-list' );
const parkListOverlay = document.getElementById( 'park-list-overlay' );
const title = document.getElementById( 'title' );

        // Define API Keys (replace these with your own!)
        const NASADEM_APIKEY = '1f11dbce025744eda8b9aadd99c07d131';
        const MAPTILER_APIKEY = 'BheLBu5XbQXIoBFzohw6';
        if ( !NASADEM_APIKEY || !MAPTILER_APIKEY ) {
          const error = Error( 'Modify index.html to include API keys' );
          container.innerHTML = error; 
          throw error;
        }

        const datasource = {
          elevation: {
            apiKey: NASADEM_APIKEY
          },
          imagery: {
            apiKey: MAPTILER_APIKEY,
            urlFormat: 'https://api.maptiler.com/tiles/satellite/{z}/{x}/{y}.jpg?key={apiKey}',
            attribution: '<a href="https://www.maptiler.com/copyright/">Maptiler</a> <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          }
        }
        Procedural.init( { container, datasource } );
        Procedural.setCameraModeControlVisible( true );
        Procedural.setCompassVisible( true );
        Procedural.setUserLocationControlVisible( true );
        Procedural.setRotationControlVisible( true );
        Procedural.setZoomControlVisible( true );

// Configure buttons for UI
Procedural.setCameraModeControlVisible( true );
Procedural.setCompassVisible( false );
Procedural.setRotationControlVisible( true );
Procedural.setZoomControlVisible( true );

// Define function for loading a given national park
function loadPark( feature ) {
  const name = feature.properties.name;
  const [longitude, latitude] = feature.geometry.coordinates;
  Procedural.displayLocation( { latitude, longitude } );
  title.innerHTML = name;
  parkListOverlay.classList.add( 'hidden' );
}

// Show list when title clicked
title.addEventListener( 'click', () => {
  parkListOverlay.classList.remove( 'hidden' );
} );

// Fetch park list and populate UI
fetch( 'parks.geojson' )
  .then( data => data.json() )
  .then( parks => {
    parks.features.forEach( park => {
      const li = document.createElement( 'li' );
      const p = document.createElement( 'p' );
      p.innerHTML = park.properties.name;
      li.appendChild( p );
      li.style.backgroundImage = `url(images/${park.properties.image}.jpg)`;
      parkList.appendChild( li );
      li.addEventListener( 'click', () => loadPark( park ) );
    } );
  } );
