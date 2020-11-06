<script>
  import { Route, active } from "tinro";
  import History from "./components/History.svelte";
  import CurrentDust from "./components/CurrentDust.svelte";
</script>

<style>

</style>

<main>
  <div class="scrollmenu">
    <a href="/" use:active exact>Home</a>
    <a href="/history" use:active>History</a>
  </div>
</main>

<Route path="/">
  <CurrentDust />
</Route>
<Route path="/history">
  <History />
</Route>
