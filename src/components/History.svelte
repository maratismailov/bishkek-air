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

  let mapContainer;
  let map;
  let records;
  let data;
  let data_bak;
  let prepared_data;
  let markerGroup;
  let height = (window.innerHeight * 0.6).toString() + "px";

  let message = "first message";

  export let center = [42.882004, 74.582748];
  // export let center = [47.52685546875001, 44.88701247981298];
  export let zoom = 12;

  onMount(() => {
    createMap();
    map.setView(center, zoom);
    // axios.get('https://x1cz0kcbm8.execute-api.eu-central-1.amazonaws.com/?method=readnamesfrombucket').then(response => {
    //   records = response.data.split('\n')
    // })
    // axios.get('https://x1cz0kcbm8.execute-api.eu-central-1.amazonaws.com/?method=readfrombucket').then(response => {
    //   data = response.data.split
    // })
    axios
      .get("https://krakenflask.herokuapp.com/readnamesfromtemp")
      .then(response => {
        const pre_records = response.data.split("\n");
        records = pre_records.filter(elem => elem != "");
      });
    axios
      .get("https://krakenflask.herokuapp.com/readdatafromtemp")
      .then(response => {
        data = response.data;
        data_bak = JSON.parse(JSON.stringify(data));
        data.forEach(elem => {
        });
      });
  });

  const createMap = () => {
    map = L.map("main").setView(center, zoom);
    markerGroup = L.layerGroup().addTo(map);

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
  };

  const resize = () => {
    // mapContainer.style.height = `${window.innerHeight - headerHeight}px`;
    height = (window.innerHeight * 0.6).toString() + "px";
    map.invalidateSize();
  };

  const prepareData = record => {
    markerGroup.clearLayers();
    let work_data = JSON.parse(JSON.stringify(data_bak));
    const datestring = record.substring(0, 10);
    const refined_data = work_data.filter(
      elem =>
        elem.sensordatavalues[0].value_type != "temperature" &&
        elem.sensordatavalues[0].value_type != "humidity"
    );
    prepared_data = refined_data.filter(
      elem => elem["timestamp"].substring(0, 10) == datestring
    );
    prepared_data.forEach(elem => {
      const filtered = elem.sensordatavalues.filter(
        elem => elem.value_type == "P2"
      );
      elem.sensordatavalues = filtered[0];
    });
    const pre_data_to_display = prepared_data.map(elem => {
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
      }).addTo(markerGroup);
    });
  };
</script>

<style type="text/postcss">
  .map {
    width: 98vw;
    margin: auto;
  }
  .leaflet-marker-icon {
    background-image: url("../assets/marker.svg");
    background-size: 35px;
    text-align: center;
    line-height: 32px;
    color: black;
  }
</style>

<svelte:window on:resize={resize} on:orientationchange={resize} />

<div style="height: {height}" class="map" id="main">
  <slot />
</div>

{#if records}
  {#each records as record, index (index)}
    <button
      class="focus:outline-none bg-mainbtn m-2 static rounded-lg py-2 px-4"
      on:click={() => prepareData(record)}>
      {record}
    </button>
  {/each}
{/if}
