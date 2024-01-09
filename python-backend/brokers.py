import paho.mqtt.client as mqtt
import requests
import schedule
import time
from pythonDb import get_mongo_db
import json
from functions import update_entity
from functions import create_entity

# MQTT broker details
mqtt_broker_address = "150.140.186.118"
mqtt_broker_port = 1883
mqtt_topic_prefix = "kyriakstrat"

# Orion Context Broker details
orion_url = "http://localhost:1026/v2/entities"
entity_type = "Sensor"


def entity_exists(entity_id):
    # Check if the entity already exists in Orion Context Broker
    response = requests.get(f"{orion_url}/{entity_id}")
    return response.status_code == 200

def on_connect(client, userdata, flags, rc):
    print("Connected with result code " + str(rc))

def on_message(client, userdata, msg):
    payload = msg.payload.decode()
    print(f"Received message on topic {msg.topic}: {payload}")

    # Forward the received data to Orion Context Broker
    forward_to_orion(msg.topic, payload)

def forward_to_orion(sensor_topic, data):
    sensor_name = sensor_topic[len(mqtt_topic_prefix) + 1:]
    entity_id = f"sensor_{sensor_name}"

    # Construct the payload for updating or creating the entity
    payload = {
        "value": {
            "type": "Text",
            "value": data
        }
    }
    if entity_exists(entity_id):
        update_entity(entity_id,payload)
    else:create_entity(entity_id,entity_type,payload)

    return

def subscribe_to_sensor_topics(sensor_names):
    client = mqtt.Client()
    client.on_connect = on_connect
    client.on_message = on_message

    client.connect(mqtt_broker_address, mqtt_broker_port, 60)

    for sensor_name in sensor_names:
        topic = f"{mqtt_topic_prefix}/{sensor_name}"
        client.subscribe(topic)
        print(f"Subscribed to topic: {topic}")

    client.loop_start()

def get_and_subscribe():
    db = get_mongo_db()
    collection = db['devices']

    result = collection.find({}, {'url': 1})
    sensors = [doc.get('url', None) for doc in result]

    subscribe_to_sensor_topics(sensors)

# Schedule the task to run every 1 minute
schedule.every(1).minutes.do(get_and_subscribe)

while True:
    schedule.run_pending()
    time.sleep(1)
