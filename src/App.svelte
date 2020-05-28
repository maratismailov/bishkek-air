<script>
  import { Route, active } from "tinro";
  import History from "./components/History.svelte";
  //   import TestMap from "./components/TestMap.svelte";
  import CurrentDust from "./components/CurrentDust.svelte";
  import Heatmap from "./components/Heatmap.svelte";
  import CurrentDustAzure from "./components/CurrentDustAzure.svelte";
  import Settings from "./components/Settings.svelte";
</script>

<style>

</style>

<main>
  <div class="scrollmenu">
    <a href="/" use:active exact>Home</a>
    <a href="/heatmap" use:active exact>Heatmap</a>
    <a href="/history" use:active>History</a>
    <a href="/currentdustazure" use:active>currentdustazure</a>

	
  </div>
</main>

<Route path="/">
  <CurrentDust />
</Route>
<Route path="/settings">
  <Settings />
</Route>
<Route path="/history">
  <History />
</Route>
<Route path="/currentdustazure">
  <CurrentDustAzure />
</Route>
<Route path="/heatmap">
  <Heatmap />
</Route>
