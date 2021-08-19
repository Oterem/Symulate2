const { MongoClient } = require('mongodb')
const mongoConfig = require('config').mongo;
let dbHandle, mongoConnection;
const mapCollections = {
    settings:"settings",
    audit:"audit"
};
const mongoConnectionOptions = {
    connectTimeoutMS: 5000
};

const createMongoConnection = async () =>{
    try {
        console.log('hello mongo')

        const client = new MongoClient(mongoConfig.url,mongoConnectionOptions);
        const connection = await client.connect();
        if(mongoConnection){
            mongoConnection.close();
        }
        mongoConnection = connection;
        dbHandle = client.db(mongoConfig.dbName);
        await dbHandle.command({ ping: 1 });
        console.log('mongo connected!');
    } catch (e) {
        console.error('mongo connection error retrying in 5 seconds...');
        setTimeout(() => createMongoConnection(), 5000);
    }
}

module.exports = {
    init:async ()=>{
        await createMongoConnection();
    },
    getItemById: async (collection, id) =>{
        return await dbHandle.collection(mapCollections[collection]).findOne({_id:id});
    },
    AddItemById: async (collection, id, object) =>{
        return await dbHandle.collection(mapCollections[collection]).replaceOne({_id:id},object,{upsert:true});
    },
    removeItemById: async (collection, id) =>{
        return await dbHandle.collection(mapCollections[collection]).deleteOne({_id:id});
    },
}
