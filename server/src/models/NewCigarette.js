const mongoose = require("mongoose");

const CigaretteSchema = new mongoose.Schema({
    userOwner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    cigarettePackage: {
        type: String,
        required: true,
    },
    numCigarettes: {
        type: Number,
        require: true
    },
    time: {
        type: Date,
        require:true
    }
});

const CigaretteModel = mongoose.model("cigarettesSmoked", CigaretteSchema);

module.exports = { CigaretteModel };