import React, { useState } from 'react';
import GoogleMapReact from 'google-map-react';

const Home = () => {
  const [position, setPosition] = useState<{ latitude: number; longitude: number; accuracy: number }>();

  // google-map-react states
  const [zoom] = useState(10);

  const getPositions = (position: Position) => {
    setPosition({
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      accuracy: position.coords.accuracy,
    });
  };

  const handleLocationError = (error: PositionError) => {
    switch (error.code) {
      case error.PERMISSION_DENIED:
        alert('User denied the request for Geolocation.');
        break;
      case error.POSITION_UNAVAILABLE:
        alert('Location information is unavailable.');
        break;
      case error.TIMEOUT:
        alert('The request to get user location timed out.');
        break;
      default:
        alert(`A Geolocation error[${error.code}] occurred.`);
        break;
    }
  };

  const getLocation = React.useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(getPositions, handleLocationError, {
        enableHighAccuracy: true,
        timeout: 5000, // ? integer (milliseconds) - amount of time before the error callback is invoked, if 0 it will never invoke.
        maximumAge: 0, // ? integer (milliseconds) | infinity - maximum cached position age.
      });
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  }, []);

  return (
    <div>
      <h1>Event Locator Client</h1>
      {position ? (
        <div>
          <h2>Details</h2>
          <h3>Latitude: {position.latitude}</h3>
          <h3>Longitude: {position.longitude}</h3>
          <h3>Accuracy: {position.accuracy}</h3>
        </div>
      ) : (
        <div>
          <p>For nearby feature, you have to give permission for your location.</p>
          <button onClick={getLocation}>Allow</button>
        </div>
      )}
      <div style={{ height: '70vh', width: '100%' }}>
        {!process.env.REACT_APP_GOOGLE_KEY ? (
          <h1>Please, provide REACT_APP_GOOGLE_KEY in .env.local</h1>
        ) : (
          position && (
            <GoogleMapReact
              bootstrapURLKeys={{ key: process.env.REACT_APP_GOOGLE_KEY }}
              defaultCenter={{
                lat: position.latitude,
                lng: position.longitude,
              }}
              defaultZoom={zoom}
            >
              {/* markers */}
            </GoogleMapReact>
          )
        )}
      </div>
    </div>
  );
};

export default Home;
