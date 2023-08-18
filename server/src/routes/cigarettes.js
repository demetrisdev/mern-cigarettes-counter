const express = require("express");
const mongoose = require("mongoose");
const { PackageModel } = require("../models/NewPackage.js");
const { UserModel } = require("../models/Users.js");
const { verifyToken } = require("./users.js");
const { CigaretteModel } = require("../models/NewCigarette.js");

const router = express.Router();

//Get saved Packages
router.get("/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await UserModel.findById(userId);

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const savedCigarettes = await PackageModel.find({
      userOwner: { $in: user },
    });

    const cigarettesSmoked = await CigaretteModel.find({
      userOwner: { $in: user },
    });

    res.status(200).json({ savedCigarettes, cigarettesSmoked });

  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

// POST Request to Create a New Package
router.post("/", verifyToken, async (req, res) => {
  const cigarettePackage = new PackageModel({
    _id: new mongoose.Types.ObjectId(),
    cigarettesBrand: req.body.cigarettesBrand,
    price: req.body.price,
    nicotineLevel: req.body.nicotineLevel,
    userOwner: req.body.userOwner,
    time: req.body.time
  });
  
  console.log(cigarettePackage.time);

  try {
    const result = await cigarettePackage.save();
    res.status(201).json({
      createdPackage: {
        cigarettesBrand: req.body.cigarettesBrand,
        price: req.body.price,
        nicotineLevel: req.body.nicotineLevel,
        _id: result._id,
      },
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// POST Request to add a cigarette
router.post("/addcigarette", verifyToken, async (req, res) => {
  const addNewCigarette = new CigaretteModel({
    _id: new mongoose.Types.ObjectId(),
    cigarettePackage: req.body.cigarettePackage,
    numCigarettes: req.body.numCigarettes,
    userOwner: req.body.userOwner
  });

  console.log(addNewCigarette.time);

  try {
    const result = await addNewCigarette.save();
    res.status(201).json({
      createdNewCigarette: {
        cigarettePackage: req.body.selectedPackage,
        numCigarettes: req.body.numCigarettes,
        userOwner: req.body.userOwner,
        _id: result._id,
        time: req.body.time
      },
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// Update a saved package
router.put("/:packageId", verifyToken, async (req, res) => {
  const { packageId, updatedData } = req.body;

  try {
    // Find the package by ID and update its data
    const updatedPackage = await PackageModel.findByIdAndUpdate({
      _id: new mongoose.Types.ObjectId(),
      cigarettesBrand: req.body.cigarettesBrand,
      price: req.body.price,
      nicotineLevel: req.body.nicotineLevel,
      userOwner: req.body.userOwne
    }
    );

    if (!updatedPackage) {
      res.status(404).json({ message: "Package not found" });
      return;
    }

    res.status(200).json(updatedPackage);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

// Delete Request to delete a Package
router.delete("/:packageId", verifyToken, async (req, res) => {
  const packageId = req.params.packageId;

  try {
    // Find the package by ID and delete it
    const deletedPackage = await PackageModel.findByIdAndDelete(packageId);

    if (!deletedPackage) {
      res.status(404).json({ message: "Package not found" });
      return;
    }

    res.status(200).json({ message: "Package deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

module.exports = { newPackageRouter: router };