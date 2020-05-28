<script>
  import "leaflet.heat";
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
        elem.sensordatavalues[0].value_type != "P1" &&
        elem.sensordatavalues[0].value_type != "P0" &&
        elem.sensordatavalues[0].value_type != "P2"
    );
    refined_data.forEach(elem => {
      // console.log(elem)
      const filtered = elem.sensordatavalues.filter(
        elem => elem.value_type == "temperature"
      );
      elem.sensordatavalues = filtered[0];
    });
    const pre_data_to_display = refined_data.map(elem => {
      const data = {
        id: elem.sensor.id,
        lat: elem.location.latitude,
        lon: elem.location.longitude,
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
    const heat_array = data_to_display.map( elem => {
      console.log(elem)
      return [parseFloat(elem.lat), parseFloat(elem.lon), elem.value]
    })
    // console.log(heat_array)
    var heat = L.heatLayer(
      heat_array,
      { radius: 45 }
    ).addTo(map);

    // data_to_display.forEach(elem => {
    //   // console.log(parseFloat(elem.lat), parseFloat(elem.lon));
    //   var heat = L.heatLayer(
    //     [parseFloat(elem.lat), parseFloat(elem.lon), 0.2],
    //     { radius: 25 }
    //   ).addTo(map);
    // });
    map.setView(center, zoom);
  };

  const createMap = () => {
    const subscription_key = "k01eZLXiaGKM6syyVFkjm1lWGsFZhkyJ7XAnpe3m-R0";
    map = L.map("main").setView(center, zoom);
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
        tilesetId: "microsoft.base.road",

        //The language of labels. Supported languages: https://docs.microsoft.com/en-us/azure/azure-maps/supported-languages
        language: "en-US",

        //The regional view of the map. Supported views: https://aka.ms/AzureMapsLocalizationViews
        view: "Auto"
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
