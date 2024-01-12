import aiohttp
import asyncio
from imouapi.api import ImouAPIClient
from imouapi.device import ImouDiscoverService, ImouDevice
from imouapi.device_entity import ImouCamera

async def main():
    # Replace with your Imou developer account credentials
    app_id = "lc7ed544766d1c476c"
    app_secret = "40cbba1e8c924347aacc7084c59c5f"

    # Create an aiohttp session
    async with aiohttp.ClientSession() as session:
        # Instantiate the Imou API client with the session
        api_client = ImouAPIClient(app_id, app_secret, session)

        # Initialize the Imou Discover service
        discover_service = ImouDiscoverService(api_client)
        try:
            # Run device discovery
            discovered_devices = await discover_service.async_discover_devices()
            print("Discovered Devices:")
            # print(type(discovered_devices))

            if discovered_devices:
                # Assuming you want to interact with the first discovered device
                # device_id = discovered_devices[0]['device_id']
                print(discovered_devices)
                device_ids = discovered_devices.keys()
                device_ids = list(device_ids)
                print(device_ids)

                for device_id, device in discovered_devices.items():
                    # Instantiate the Imou Devic
                    # device_details = await device.async_get_data()
                    await device.async_initialize()
                    await device.async_wakeup()
                    await device.async_refresh_status()
                    print(device.is_online())
                    print(device.is_enabled())
                    device_name = device.get_name
                    camera = ImouCamera(api_client, device_id,device_name, "camera", "HD")

                    await camera.async_open_stream()

                    # image_data = await camera.async_get_image()
                    # await camera.async_get_stream_url()
                    
        except Exception as e:
            print('error')
            print(e)

    return



if __name__ == "__main__":
    # # Create a new event loop
    # event_loop = asyncio.new_event_loop()

    # # Set the event loop as the current event loop
    # asyncio.set_event_loop(event_loop)

    # # Run the main function
    # event_loop.run_until_complete(main())

    # # Close the event loop after main completes
    # event_loop.close()
    asyncio.get_event_loop().run_until_complete(main())
