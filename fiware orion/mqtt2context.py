import requests
import paho.mqtt.client as mqtt
import json
from functions import orion_url

# MQTT broker details
mqtt_broker_address = "150.140.186.118"
mqtt_topic = "kyriakstrat/id2"

# Orion Context Broker details
context_broker_url = orion_url

def on_message(client, userdata, msg):
    # Parse and transform MQTT message
    mqtt_data = msg.payload.decode("utf-8")
    entity_id = msg.topic.split('/')[-1]
    transformed_data = transform_data(entity_id,mqtt_data)
    # print(transformed_data)
    # Send data to Context Broker
    send_to_context_broker(transformed_data)


def transform_data(entity_id,mqtt_data):
    # Implement your data transformation logic here
    # Example: Convert JSON string to a Python dictionary
    # Transform MQTT data to Fiware entity format
    fiware_entity = {
        "id": entity_id,
        "type": "Sensor",
        "status": {
            "type": "Text",
            "value": mqtt_data,
        }
    }
    return fiware_entity

def send_to_context_broker(data):
    # Send data to Orion Context Broker
    headers = {"Content-Type": "application/json"}
    response = requests.post(context_broker_url, json=data, headers=headers)

# Set up MQTT client
mqtt_client = mqtt.Client()
mqtt_client.on_message = on_message
mqtt_client.connect(mqtt_broker_address, 1883, 60)
mqtt_client.subscribe(mqtt_topic)
mqtt_client.loop_forever()
