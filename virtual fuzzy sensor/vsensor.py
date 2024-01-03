from sensor import *

sensor1 = VirtualWindowSensor("id1")

while 1:
    sensor1.loop()
    sensor1.helper()
    print(sensor1)