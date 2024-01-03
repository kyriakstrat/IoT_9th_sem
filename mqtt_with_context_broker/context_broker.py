import paho.mqtt.client as mqtt
from orion_context_broker import *

# MQTT broker details
mqtt_broker = "150.140.186.118"
mqtt_topic = "kyriakstrat/sensor_id/sensor_name"


# Callback when the client connects to the broker
def on_connect(client, userdata, flags, rc):
    print(f"Connected to MQTT broker with result code {rc}")
    # Subscribe to the topic upon successful connection
    client.subscribe(mqtt_topic)

# Callback when a message is received from the broker
def on_message(client, userdata, msg):
    info = str(msg.topic).split('/')[1:]
    info.append((float(msg.payload)))
    print(f"Received message on topic {msg.topic}: {msg.payload.decode()}")
    print(info)
    

# Create an MQTT client
client = mqtt.Client()

# Set up callback functions
client.on_connect = on_connect
client.on_message = on_message

# Connect to the broker
client.connect(mqtt_broker, 1883, 60)

# Loop to keep the script running and handle incoming messages
client.loop_forever()
