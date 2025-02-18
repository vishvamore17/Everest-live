const express = require("express");
const OwnerController = require("../../../controller/Owner.controller");
const router = express.Router();

// Route to create a new owner
router.post("/addOwner", OwnerController.addOwner);

// Route to get all owners
router.get("/getAllOwners", OwnerController.getOwners);

// Route to get a specific owner by ID
router.get("/getOwner/:id", OwnerController.getOwnerById);

// Route to update an existing owner by ID
router.put("/updateOwner/:id", OwnerController.updateOwner);

// Route to delete an owner by ID
router.delete("/deleteOwner", OwnerController.deleteOwner);

// Route to get the count of owners
router.get("/count", OwnerController.getOwnerCount);  // New route for owner count

router.get("/getOwnerForInvoice", OwnerController.getOwnerForInvoice);

module.exports = router;
