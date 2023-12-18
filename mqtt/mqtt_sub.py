import paho.mqtt.publish as publish
import time 

# MQTT broker details
mqtt_broker = "150.140.186.118"
mqtt_topic = "kyriakstrat/crypt/sensor1"

# Message to be published
message = "Hello, MQTT!"

# Publish the message
publish.single(mqtt_topic, message, hostname=mqtt_broker)

print(f"Message published to {mqtt_topic} at {mqtt_broker}")
it = 0 
while True:
    publish.single(mqtt_topic, it, hostname=mqtt_broker)
    it += 1
    time.sleep(5)
