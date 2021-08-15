const express = require("express");
const router  = express.Router();

//linking other routes

//logging the status of the server
router.use("/ping", (req, res) => {
	res.status(200).send({ msg: "Server has started and is running" });
});

module.exports = router;
