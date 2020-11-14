<script>
  import L from "leaflet";
  import axios from "redaxios";
  import { onMount } from "svelte";
  let height = (window.innerHeight * 0.93).toString() + "px";
  let map;
  let data;
  let today_data;

  export let center = [42.87, 74.594];
  export let zoom = 12;

  onMount(() => {
    createMap();
    axios
      .get(
        "https://x1cz0kcbm8.execute-api.eu-central-1.amazonaws.com/?method=getfromjsonnetunique"
      )
      .then((response) => {
        data = response.data.data;
        // refineData(data);
        put_unique_points(data);
      });
  });
  const put_unique_points = (data) => {
    axios
      .get(
        "https://x1cz0kcbm8.execute-api.eu-central-1.amazonaws.com/?method=getfromjsonnetdaily"
      )
      .then((response) => {
        today_data = response.data.data;
        data.map(elem =>{
          elem.value = ''
        })
        today_data.map((elem) => {
          data.map((data_elem) => {
            if (data_elem.id == elem.id) {
              data_elem.value = elem.value
            }
          });
        });
        place_markers();
      });
  };

  const place_markers = () => {
    data.forEach((elem) => {
      const numberIcon = L.divIcon({
        className: "number-icon",
        iconSize: [35, 35],
        // iconAnchor: [10, 44],
        popupAnchor: [3, -40],
        html: elem.value,
      });
      L.marker([parseFloat(elem.lat), parseFloat(elem.lon)], {
        icon: numberIcon,
      }).addTo(map);
    });
    map.setView(center, zoom);
  };

  const createMap = () => {
    map = L.map("main").setView(center, zoom);
    L.tileLayer(
      "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
      {
        attribution:
          'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: "mapbox/dark-v10",
        tileSize: 512,
        zoomOffset: -1,
        accessToken:
          "pk.eyJ1IjoicmVnZmU4OSIsImEiOiJjazlvY2oxdW0wOG5tM2RtcmV0eGRuZDk4In0.WIsrA9dq-v_Yw5gX_D17qg",
      }
    ).addTo(map);
  };

  const resize = () => {
    // map.style.height = (window.innerHeight * 0.93).toString() + "px";
    height = (window.innerHeight * 0.93).toString() + "px";
    // map.invalidateSize();
  };
</script>

<style>
  .map {
    width: 98vw;
    margin: auto;
  }
</style>

<svelte:window on:resize={resize} on:orientationchange={resize} />

<div style="height: {height}" class="map" id="main">
  <slot />
</div>
