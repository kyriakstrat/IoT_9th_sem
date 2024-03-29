import aiohttp
import asyncio
from imouapi.api import ImouAPIClient
from imouapi.device import ImouDiscoverService, ImouDevice
from imouapi.device_entity import ImouCamera
from PIL import Image
from io import BytesIO
import IPython.display as display


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

                for device_id, device in discovered_devices.items():
                    # Instantiate the Imou Devic
                    # device_details = await device.async_get_data()
                    await device.async_initialize()
                    await device.async_wakeup()
                    await device.async_refresh_status()
                    # device_name = device.get_name()
                    sensors = device.get_all_sensors()
                    # data = await device.async_get_data()
                    # print(data)
                    sensor_names = [s.get_name() for s in sensors]
                    print(sensor_names)

                    for sensor in sensors:
                        if sensor.get_name() == 'camera':
                            # THIS IS THE CAMERA MODULE
                            # await sensor.async_service_ptz_location(0,0,0.5)
                            camera = sensor
                        elif sensor.get_name() == 'motionDetect' and sensor.get_description()=='Motion detection':
                            # THIS IS THE MOTION ALARM MODULE
                            await sensor.async_update()
                            if not sensor.is_on():
                                await sensor.async_turn_on()
                            print(f'motion Alarm is {sensor.is_on()}')

                            pass
                        elif sensor.get_name() == 'motionAlarm':
                            motion_detection = sensor
                        elif sensor.get_name() == 'whiteLight':
                            light = sensor
            await asyncio.create_task(run_camera_detection(camera, motion_detection,light))


                    
        except Exception as e:
            print('error')
            print(e)

    return

async def run_camera_detection(camera,sensor,light):
    while True:
        # await asyncio.sleep(0.1)  # Sleep for 0.5 seconds
        await cameraDetection(camera, sensor,light)

async def cameraDetection(camera,sensor,light):
    if not camera or not sensor:raise ValueError
    await sensor.async_update()
    if sensor.is_on():
        print('movement detected')
        photo = await camera.async_get_image()
        await  light.async_turn_on()
        image = Image.open(BytesIO(photo))
        image.save('detection2.jpeg')
    else:
        print('not')


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
