import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import mylocation from './assests/MyLocation.png';
import destination from './assests/destination.png';
import vessel from './assests/Frame 334.png';

const start = [22.1696, 91.4996];
const end = [22.2637, 91.7159];
const speed = 20; 
const refreshRate = 500;

const distanceBetweenCoords = (lat1, lon1, lat2, lon2) => {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon1 - lon2) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const App = () => {
  const [position, setPosition] = useState(start);
  const [distance, setDistance] = useState(0);

  useEffect(() => {
    const totalDistance = distanceBetweenCoords(start[0], start[1], end[0], end[1]);
    console.log(totalDistance + 'Km')
    const duration = totalDistance / speed; 
    console.log(duration + 'hr');

    const interval = setInterval(() => {
      setDistance((prevDistance) => {
        const newDistance = prevDistance + (speed * (refreshRate / 1000)) / 3600;
        if (newDistance >= totalDistance) {
          clearInterval(interval);
          setPosition(end);
          return totalDistance;
        }

        const ratio = newDistance / totalDistance;
        const newLat = start[0] + (end[0] - start[0]) * ratio;
        const newLon = start[1] + (end[1] - start[1]) * ratio;

        setPosition([newLat, newLon]);
        return newDistance;
      });
    }, refreshRate);

    return () => clearInterval(interval);
  }, []);

  const vesselIcon = L.divIcon({
    html: `<img src=${vessel} style="transform: rotate(62deg); width: 8px; height: 60px;" />`,
    className: '', 
    iconAnchor: [-2, 35],
  });

  return (
    <div className='flex flex-col items-center gap-6 p-4 sm:p-6 lg:p-10'>

      <div className='flex justify-between items-center mt-10 border-2 border-gray-400 w-full max-w-xl px-4 py-2 rounded-lg'>
        <div className='flex flex-col items-start gap-2 sm:gap-4'>
          <p className='font-bold text-sm sm:text-base lg:text-lg'>Starting</p>
          <div className='flex flex-col items-start'>
            <p className='font-semibold text-xs sm:text-sm lg:text-base'>Lat: <span className='font-normal'>22.1696</span></p>
            <p className='font-semibold text-xs sm:text-sm lg:text-base'>Long: <span className='font-normal'>91.4996</span></p>
          </div>
        </div>

        <div>
          <p className='text-blue-400 font-semibold text-xs sm:text-sm lg:text-base'>Speed: <span className='font-normal'>20Kmph</span></p>
        </div>

        <div className='flex flex-col items-start gap-2 sm:gap-4'>
          <p className='font-bold text-sm sm:text-base lg:text-lg'>Ending</p>
          <div className='flex flex-col items-start'>
            <p className='font-semibold text-xs sm:text-sm lg:text-base'>Lat: <span className='font-normal'>22.2637</span></p>
            <p className='font-semibold text-xs sm:text-sm lg:text-base'>Long: <span className='font-normal'>91.7159</span></p>
          </div>
        </div>
      </div>

      <MapContainer center={position} zoom={11} className='w-full h-[50vh] sm:h-[60vh] lg:h-[70vh] rounded-lg'>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker position={start} icon={new L.Icon({ iconUrl: mylocation, iconSize: [35, 35] })} />
        <Marker position={end} icon={new L.Icon({ iconUrl: destination, iconSize: [35, 35] })} />
        <Marker position={position} icon={vesselIcon} />
      </MapContainer>
    </div>
  );
};

export default App;

