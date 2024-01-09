from pymongo.mongo_client import MongoClient

def get_mongo_db():
    # mongodb+srv://kyriakstrat:<password>@cluster0.q9zbued.mongodb.net/?retryWrites=true&w=majority
    connection_string = f"mongodb+srv://kyriakstrat:ks280101@cluster0.q9zbued.mongodb.net/?retryWrites=true&w=majority"
    client = MongoClient(connection_string,tls=True)
    db = client['test']
    
    return db

get_mongo_db()
