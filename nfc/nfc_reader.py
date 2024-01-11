from os import write
import time
from py122u import nfc
from py122u.utils import int_list_to_string_list
import paho.mqtt.publish as publish
import struct


def write_string(reader,pos,str):
    byte_array = str.encode('utf-8')[:16].ljust(16, b'\0')
    reader.update_binary_blocks(pos, 16,byte_array)
    return

def read_string(reader,pos=0x01):
    return bytearray(reader.read_binary_blocks(pos, 16)).decode('utf-8').rstrip('\0')
    

auth_users = []
mqtt_broker = "150.140.186.118"
mqtt_topic = "kyriakstrat/cardReader"

# Convert the string to a 16-byte array
# byte_array = my_string.encode('utf-8')[:16].ljust(16, b'\0')

# reader.update_binary_blocks(0x01, 16,byte_array)
while(1):
    try:
        reader = nfc.Reader()
        reader.connect()

        # reader.load_authentication_data(0x01, [0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF])
        reader.authentication(0x00, 0x61, 0x01)
        uuid = str(reader.get_uid())
        # uuid = int_list_to_string_list(reader.get_uid())

        publish.single(mqtt_topic, uuid, hostname=mqtt_broker)

        # # print(int_list_to_string_list(reader.get_uid()))
        print(uuid)
        # print(read_string(reader,0x02))
        time.sleep(2)
    except:
        publish.single(mqtt_topic, 'None', hostname=mqtt_broker)

        # # print(int_list_to_string_list(reader.get_uid()))
        print('None')
        # print(read_string(reader,0x02))
        time.sleep(2)
        pass

# import paho.mqtt.publish as publish
# import time 

# # MQTT broker details
# mqtt_broker = "150.140.186.118"
# mqtt_topic = "kyriakstrat/secret/sensor1"

# # Message to be published
# message = "Hello, MQTT!"

# # Publish the message
# it = 0 
# while True:
#     publish.single(mqtt_topic, it, hostname=mqtt_broker)
#     print(it)
#     it += 1
#     time.sleep(5)
