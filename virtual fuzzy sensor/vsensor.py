from sensor import *

sensor1 = VirtualWindowSensor("window_url")
sensor2 = VirtualWindowSensor('testing')

while 1:
    val = sensor1.loop()
    sensor2.loop()
    sensor1.helper()
    print(val)