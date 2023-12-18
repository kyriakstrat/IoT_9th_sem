from paho.mqtt import client as mqtt_client
import json

def connect_mqtt():
    def on_connect(client, userdata, flags, rc):
        if rc == 0:
            print("Connected to MQTT Broker!")
        else:
            print("Failed to connect, return code %d\n", rc)

    client = mqtt_client.Client(client_id)
    # client.username_pw_set(username, password)
    client.on_connect = on_connect
    client.connect(broker, port)
    return client


def subscribe(client):
    def on_message(client, userdata, msg):
        #print(f"Received `{msg.payload.decode()}` from `{msg.topic}` topic")
        text=str(msg.payload.decode())#.replace("'",'''"''').replace("None",'''"None"''').replace("True",'''"None"'''))
        message=eval(text)
        
        print(text.keys())
        #message=json.loads(text)
        #print(message.keys())



    client.subscribe(topic)
    client.on_message = on_message


def run():
    client = connect_mqtt()
    subscribe(client)
    client.loop_forever()


if __name__ == '__main__':
    client_id = 'client-tsap'
    # topic = 'Environmental/barani-meteohelix-iot-pro:1'
    topic = 'Environmental/dutch-sensor-systems-ranos-db-2:1'
    broker = '150.140.186.118'
    port = 1883

    run()