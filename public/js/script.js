const socket = io();

if (navigator.geolocation) {
  // when a person will move keep an eye on him
  navigator.geolocation.watchPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      socket.emit("send-location", { latitude, longitude });
    },
    (error) => {
      console.log(error);
    },
    {
        enableHighAccuracy:true,
        timeout:5000,
        maximumAge:0 // no caching
    }
  );
}

const map = L.map("map").setView([0,0],16) // give me the ma and set lat. and long.

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{
    attribution:"OliveaMaps.inc"
}).addTo(map)

// create an empty objects marker 
const markers = {}

socket.on("receive-location" , (data)=>{
    const {id , latitude , longitude} = data;
    map.setView([latitude , longitude])

    if(markers[id]){
        markers[id].setLatLng([latitude , longitude])
    }
    else{
        markers[id] = L.marker([latitude , longitude]).addTo(map)
    }
})

socket.on("user-disconnected" , (id) =>{
    if(markers[id]){
        map.removeLayer(markers[id])
        delete markers[id]
    }
})