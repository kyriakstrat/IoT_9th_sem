import requests
import json

orion_url = "http://localhost:1026/v2/entities"

def create_entity(entity_id, entity_type, attributes):
    """
    Create an entity in FIWARE Orion.

    Parameters:
    - entity_id: ID of the entity.
    - entity_type: Type of the entity.
    - attributes: Dictionary containing attribute names and values.

    Returns:
    - True if successful, False otherwise.
    """
    payload = {
        "id": entity_id,
        "type": entity_type,
    }
    for key, val in attributes.items():
        payload[key] = val

    headers = {'Content-Type': 'application/json'}
    response = requests.post(orion_url, headers=headers, data=json.dumps(payload))

    if response.status_code == 201:
        print(f"Entity '{entity_id}' created successfully.")
        return True
    else:
        print(f"Failed to create entity. Status code: {response.status_code}")
        print(response.text)
        return False

def update_entity(entity_id, attributes):
    """
    Update attributes of an existing entity in FIWARE Orion.

    Parameters:
    - entity_id: ID of the entity to update.
    - attributes: Dictionary containing updated attribute values.

    Returns:
    - True if successful, False otherwise.
    """
    update_url = f"{orion_url}/{entity_id}/attrs"

    headers = {'Content-Type': 'application/json'}
    response = requests.post(update_url, headers=headers, data=json.dumps(attributes))

    if response.status_code == 204:
        print(f"Entity '{entity_id}' updated successfully.")
        return True
    else:
        print(f"Failed to update entity. Status code: {response.status_code}")
        print(response.text)
        return False

def delete_entity(entity_id):
    """
    Delete an entity from FIWARE Orion.

    Parameters:
    - entity_id: ID of the entity to delete.

    Returns:
    - True if successful, False otherwise.
    """
    delete_url = f"{orion_url}/{entity_id}"

    response = requests.delete(delete_url)

    if response.status_code == 204:
        print(f"Entity '{entity_id}' deleted successfully.")
        return True
    else:
        print(f"Failed to delete entity. Status code: {response.status_code}")
        print(response.text)
        return False


def read_entity_attribute(entity_id, attribute_name):
    """
    Read the value of a specific attribute of an entity from FIWARE Orion.

    Parameters:
    - entity_id: ID of the entity.
    - attribute_name: Name of the attribute to read.

    Returns:
    - Attribute value if successful, None otherwise.
    """
    query_url = f"{orion_url}/{entity_id}?attrs={attribute_name}"

    response = requests.get(query_url)

    if response.status_code == 200:
        entity_data = response.json()
        attribute_value = entity_data.get(attribute_name, {}).get("value")
        return attribute_value
    else:
        print(f"Failed to read attribute. Status code: {response.status_code}")
        print(response.text)
        return None

# Example Usage:
# create_entity("urn:ngsi-ld:entityId:001", "SampleEntity", {"temperature": {"value": 25.5, "type": "Float"},'hum':{"value":13.0, "type":"Float"}})
# update_entity("urn:ngsi-ld:entityId:001", {"temperature": {"value": 28.0, "type": "Float"}})
# print(read_entity_attribute("urn:ngsi-ld:entityId:001","temperature"))
# delete_entity("urn:ngsi-ld:entityId:002")
