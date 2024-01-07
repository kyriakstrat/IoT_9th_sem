from sensor import *

sensor1 = VirtualWindowSensor("id2")

while 1:
    val = sensor1.loop()
    sensor1.helper()
    print(val)