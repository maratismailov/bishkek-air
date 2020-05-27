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

  const darkMap = () => {
    return "https://atlas.microsoft.com/map/imagery/png?api-version=1&style=satellite&tileSize=512&zoom={z}&x={x}&y={y}&subscription-key={k01eZLXiaGKM6syyVFkjm1lWGsFZhkyJ7XAnpe3m-R0}";
  };

  const createMap = () => {
    const subscription_key = "k01eZLXiaGKM6syyVFkjm1lWGsFZhkyJ7XAnpe3m-R0";
    map = L.map("main").setView(center, zoom);
    //Create a tile layer that points to the Azure Maps tiles.
    L.tileLayer(
      "https://atlas.microsoft.com/map/tile?subscription-key={subscriptionKey}&api-version=2.0&tilesetId={tilesetId}&zoom={z}&x={x}&y={y}&tileSize=256&language={language}&view={view}",
      {
        attribution: `© ${new Date().getFullYear()} TomTom, Microsoft`,

        //Add your Azure Maps key to the map SDK. Get an Azure Maps key at https://azure.com/maps. NOTE: The primary key should be used as the key.
        subscriptionKey: subscription_key,

        /*
                    Tileset ID specifies which data layers to render in the tiles. Can be:
                    'microsoft.base.road',  
                    'microsoft.base.darkgrey',
                    'microsoft.imagery', 
                    'microsoft.weather.infrared.main', 
                    'microsoft.weather.radar.main', 
                    'microsoft.base.hybrid.road',
                    'microsoft.base.labels.road '
                */
        tilesetId: "microsoft.base.darkgrey",

        //The language of labels. Supported languages: https://docs.microsoft.com/en-us/azure/azure-maps/supported-languages
        language: "en-US",

        //The regional view of the map. Supported views: https://aka.ms/AzureMapsLocalizationViews
        view: "Auto"
      }
    ).addTo(map);
  };

  const resize = () => {
    // map.style.height = (window.innerHeight * 0.93).toString() + "px";
    height = (window.innerHeight * 0.93).toString() + "px";
    // map.invalidateSize();
  };
</script>

<style type="text/postcss">
  .map {
    width: 98vw;
    margin: auto;
  }
  /* .leaflet-popup-content-wrapper {
    background-color: green;
    width: 35px;
  }
  .leaflet-popup-content {
    margin: 2px;
  } */
  /* .leaflet-div-icon {
    background: transparent;
    border: none;
  } */
  .leaflet-marker-icon {
    background-image: url("../assets/marker.svg");
    background-size: 35px;
    text-align: center;
    line-height: 32px;
    color: black;
  }
  /* .number-icon {
    background-image: url("../assets/marker.svg");
    text-align: center;
    color: lightblue;
  } */
  /* @media only screen and (max-width: 600px) {
  .map {
    height: 88vh;
  }
} */
</style>

<svelte:window on:resize={resize} on:orientationchange={resize} />

<div style="height: {height}" class="map" id="main">
  <slot />
</div>
