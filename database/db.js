const mongoose = require("mongoose");


const DB_URL = "mongodb+srv://aang:Sbjjw84MKDycWwva@cluster0.hrf19.mongodb.net/angular-blog-app?retryWrites=true&w=majority";

const connectionOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
};

const ConnectDB = async () => {
    try {
        await mongoose.connect(DB_URL, connectionOptions);
        console.log('Connected to database ==> 100%');
    } catch (error) {
        console.log("Connection failed!");
    }

}

module.exports = ConnectDB;
