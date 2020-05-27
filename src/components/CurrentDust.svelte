<script>
  import L from "leaflet";
  import axios from "axios";

  // import "leaflet/dist/leaflet.css";
  // import "leaflet.markercluster/dist/MarkerCluster.css";
  // import "leaflet.markercluster/dist/MarkerCluster.Default.css";
  // import "leaflet/dist/images/marker-icon-2x.png";
  // import "leaflet/dist/images/marker-shadow.png";
  import { onMount } from "svelte";
  // import "leaflet/dist/leaflet.css";
  let height = (window.innerHeight * 0.93).toString() + "px";
  let map;
  let records;
  let data;

  export let center = [42.87, 74.594];
  export let zoom = 12;

  onMount(() => {
    createMap();
    axios
      .get("https://krakenflask.herokuapp.com/readcurrentdata")
      .then(response => {
        data = response.data;
        refineData(data);
      });
  });
  const refineData = data => {
    const refined_data = data.filter(
      elem =>
        elem.sensordatavalues[0].value_type != "temperature" &&
        elem.sensordatavalues[0].value_type != "humidity"
    );
    refined_data.forEach(elem => {
      const filtered = elem.sensordatavalues.filter(
        elem => elem.value_type == "P2"
      );
      elem.sensordatavalues = filtered[0];
    });
    const pre_data_to_display = refined_data.map(elem => {
      const data = {
        id: elem.sensor.id,
        latitude: elem.location.latitude,
        longitude: elem.location.longitude,
        value: parseFloat(elem.sensordatavalues.value)
          .toFixed(2)
          .toString()
      };
      return data;
    });
    var data_to_display = pre_data_to_display.filter(function(
      obj,
      index,
      self
    ) {
      return (
        index ===
        self.findIndex(function(t) {
          return t["id"] === obj["id"];
        })
      );
    });
    data_to_display.forEach(elem => {
      const numberIcon = L.divIcon({
        className: "number-icon",
        iconSize: [35, 35],
        // iconAnchor: [10, 44],
        popupAnchor: [3, -40],
        html: elem.value
      });
      L.marker([parseFloat(elem.latitude), parseFloat(elem.longitude)], {
        icon: numberIcon
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
        // id: "mapbox/streets-v11",
        id: "mapbox/dark-v10",
        tileSize: 512,
        zoomOffset: -1,
        accessToken:
          "pk.eyJ1IjoicmVnZmU4OSIsImEiOiJjazlvY2oxdW0wOG5tM2RtcmV0eGRuZDk4In0.WIsrA9dq-v_Yw5gX_D17qg"
      }
    ).addTo(map);
    // L.tileLayer(
    //   "https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png",
    //   {
    //     maxZoom: 20,
    //     attribution:
    //       '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
    //   }
    // ).addTo(map);
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
