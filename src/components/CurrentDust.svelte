<script>
  import L from "leaflet";
  import axios from "redaxios";
  import { chart } from "svelte-apexcharts";
  import { onMount } from "svelte";
  let height = (window.innerHeight * 0.78).toString() + "px";
  let map;
  let data;
  let today_data;
  let full_data;
  let data_length;
  let center = [42.87, 74.594];
  let zoom = 12;
  let options = {
    chart: {
      type: "line",
    },
    series: [
      {
        name: "pm2.5",
        data: [],
      },
    ],
    xaxis: {
      categories: []
    }
  };

  onMount(() => {
    createMap();
    axios
      .get(
        "https://x1cz0kcbm8.execute-api.eu-central-1.amazonaws.com/?method=getfromjsonnetunique"
      )
      .then((response) => {
        data = response.data.data;
        // refineData(data);
        get_full_data();
      });
  });
  const get_full_data = () => {
    axios
      .get(
        "https://x1cz0kcbm8.execute-api.eu-central-1.amazonaws.com/?method=getfromjsonnet"
      )
      .then((response) => {
        full_data = response.data.data;
        put_unique_points(data);
      });
  };
  const put_unique_points = (data) => {
    axios
      .get(
        "https://x1cz0kcbm8.execute-api.eu-central-1.amazonaws.com/?method=getfromjsonnetdaily"
      )
      .then((response) => {
        today_data = response.data.data;
        data.map((elem) => {
          elem.value = "";
        });
        today_data.map((elem) => {
          data.map((data_elem) => {
            if (data_elem.id == elem.id) {
              data_elem.value = elem.value;
            }
          });
        });
        data_length = data.map((elem) => {
          let data_by_id = full_data.filter((full_elem) => {
            return elem.id === full_elem.id;
          });
          return { length: data_by_id.length, id: data_by_id[0].id };
        });
        let short_data = data_length.filter((elem) => {
          return elem.length < 35;
        });
        short_data.forEach((elem) => {
          data = data.filter((data_elem) => {
            return data_elem.id != elem.id;
          });
        });
        place_markers(data);
      });
  };

  const place_markers = (data) => {
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
      })
        .addTo(map)
        .on("click", () => {
          get_data_by_id(elem.id);
        });
    });
    map.setView(center, zoom);
  };

  const get_data_by_id = (id) => {
    console.log(id);
    let selected_id_data = full_data.filter((elem) => {
      return elem.id === id;
    });
    console.log(selected_id_data);
    selected_id_data.sort(function (x, y) {
      const date1 = new Date(x.timestamp);
      const date2 = new Date(y.timestamp);
      return date1 - date2;
    });
    console.log(selected_id_data);
    let values = selected_id_data.map(elem => {
      return elem.value
    })
    let dates = selected_id_data.map(elem => {
      return elem.timestamp
    })
    console.log(values);
    options.series[0].data = values
    options.xaxis.categories = dates
    // options = options
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
    height = (window.innerHeight * 0.78).toString() + "px";
  };
</script>

<style>
  .map {
    width: 95vw;
    margin: auto;
  }
</style>

<svelte:window on:resize={resize} on:orientationchange={resize} />

<div style="height: {height}" class="map" id="main">
  <slot />
</div>

{#if options.series[0].data.length > 0}
  <div use:chart={options} />
{/if}
