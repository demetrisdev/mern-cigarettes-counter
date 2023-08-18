const mongoose = require("mongoose");

const PackageSchema = new mongoose.Schema({
    cigarettesBrand: { 
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    nicotineLevel: {
        type: Number,
        required: true,
    },
    userOwner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    required: true,
    },
    time: {
        type: Date,
        require: true
    }
});

const PackageModel = mongoose.model("packages", PackageSchema);

module.exports = { PackageModel };