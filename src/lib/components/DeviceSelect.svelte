<script lang="ts">
	import type { Device } from "$lib/types/device";
	import { createEventDispatcher, onMount } from "svelte";
	import Input from "./inputs/Input.svelte";
	import Label from "./inputs/Label.svelte";

  export let devices: Device[]

  const manufacturers = devices && devices.length > 0 
    ? devices.reduce((manufacturers: string[], device, i) => {

      if (!manufacturers.includes(device.manufacturer)) {
        manufacturers.push(device.manufacturer)
      }

      return manufacturers;

    }, [])
    : []
  let selectedManufacturer = manufacturers[0] ?? '';
  let selectedDevice =  ''
  let manufacturerDevices: Device[] = []
  let setManufacturerManually = false;
  let setDeviceManually = false;
  const inputContainerClass = 'flex flex-col mb-4'
  const selectClass = 'rounded-[3px] w-full px-2 py-1.5 bg-white'
  const dispatch = createEventDispatcher<{change:{manufacturer: string, device: string}}>();

  const filterManufacturerDevices = () => {
    manufacturerDevices = devices.filter((device) => device.manufacturer.toUpperCase() === selectedManufacturer.toUpperCase())
    selectedDevice = manufacturerDevices.length > 0 ? manufacturerDevices[0].name : ''
    dispatch('change', {manufacturer: selectedManufacturer, device: selectedDevice})
  }

  onMount(() => {
    filterManufacturerDevices()
  })

  const toggleSetManufacturerManually = () => {

    if (setManufacturerManually) {
      setManufacturerManually = false;
      selectedManufacturer = manufacturers[0] ?? ''

      if (setDeviceManually) {
        toggleSetDeviceManually()
      }
  
    } else {
      setManufacturerManually = true;
      selectedManufacturer = ''
      selectedDevice = ''
      manufacturerDevices = []

      if (!setDeviceManually) {
        toggleSetDeviceManually()
      }
    }

  }

  const toggleSetDeviceManually = () => {

    if (setDeviceManually) {
      setDeviceManually = false;
      filterManufacturerDevices()
    } else {
      setDeviceManually = true;
      selectedDevice = ''
    }

  }

</script>

<div>

  <div class={`${inputContainerClass} mr-4`}>

    <Label targetFor={`manufacturer`} text="Manufacturer" />

      {#if setManufacturerManually}

      <div>
        <div class="mb-1">
          <Input 
            id={`manufacturer`} 
            name={`manufacturer`} 
            bind:value="{selectedManufacturer}" 
            on:change={(_) => dispatch('change', {manufacturer: selectedManufacturer, device: ''})} 
            placeholder="Enter Device Manufacturer (i.e Roland)"
          />
        </div>
        <div class="text-xs">
          <button class="text-link underline" on:click|preventDefault={(_) => toggleSetManufacturerManually()}>Cancel</button>
        </div>
      </div>

      {:else}

      <div>

        <div class="rounded bg-gradient-to-b p-0.5 from-gray-300 to-gray-400 w-full flex mb-1">

          <select 
            bind:value={selectedManufacturer} 
            on:change={(_) => {
              filterManufacturerDevices()
              if (setDeviceManually) {
                toggleSetDeviceManually()
              }
            }} 
            id={`manufacturer`} 
            name={`manufacturer`}
            class={selectClass}
          >
            {#each manufacturers as manufacturer}
              <option value={manufacturer}>{manufacturer}</option>
            {/each}
          </select>

        </div>

        <div class="text-xs">
          <span>Can't find the manufacturer of your device? </span>
          <button class="text-link underline" on:click|preventDefault={(_) => toggleSetManufacturerManually()}>Add manufacturer</button>
        </div>
      </div>

      {/if}

  </div>

  <div class={`${inputContainerClass} mr-4`}>

    <Label targetFor={`device`} text="Device" />


    {#if setDeviceManually}

      <div>
        <div class="mb-1">
          <Input 
            id={`device-manual`} 
            name={`device-manual`} 
            bind:value={selectedDevice}
            on:change={(_) => {
              dispatch('change', {manufacturer: selectedManufacturer, device: selectedDevice})
            }} 
            placeholder="Enter Device Name (i.e Jupiter 6)"
          />
        </div>
        {#if !setManufacturerManually}
        <div class="text-xs">
          <button class="text-link underline" on:click|preventDefault={(_) => toggleSetDeviceManually()}>Cancel</button>
        </div>
        {/if}
      </div>

    {:else}

    <div>

      <div class="rounded bg-gradient-to-b p-0.5 from-gray-300 to-gray-400 w-full flex mb-1">
        <select
          bind:value={selectedDevice} 
          on:change={(_) => dispatch('change', {manufacturer: selectedManufacturer, device: selectedDevice})}
          id={`device`} 
          name={`device`} 
          class={selectClass}
        >
          {#each manufacturerDevices as device}
            <option value={device.name}>{device.name}</option>
          {/each}
        </select>
      </div>
      <div class="text-xs">
        <span>Can't find your device? </span>
        <button on:click|preventDefault={(_) => toggleSetDeviceManually()} class="text-link underline">Add device</button>
      </div>

    </div>
      
    {/if}


  </div>

</div>

