<div id="border" class="relative rounded border-dark-gray border-2 bg-white">
  <div id="top-left" class="dot absolute rounded-full bg-dark-gray" />
  <div id="top-right" class="dot absolute rounded-full bg-dark-gray" />
  <div id="bottom-left" class="dot absolute rounded-full bg-dark-gray" />
  <div id="bottom-right" class="dot absolute rounded-full bg-dark-gray" />
</div>

<style>
  #border {
    box-sizing: content-box;
    height: 48px;
    width: 48px;
  }
  .dot {
    height: 12px;
    width: 12px;
  }
  #top-left {
    top: 4px;
    left: 4px;
  }
  #top-right {
    top: 4px;
    left: 32px;
  }
  #bottom-left {
    top: 32px;
    left: 4px;
  }
  #bottom-right {
    top: 32px;
    left: 32px;
  }
</style>
