/**
 *                 ApplicationServer
 *             (Do not change this code)
 * Require Modules to setup the REST Api
 * - `express` Express.js is a Web Framework
 * - `morgan` Isn't required but help with debugging and logging
 * - `body-parser` This module allows to parse the body of the post request into a JSON
 */
const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
/**
 * Require the Blockchain class. This allow us to have only one instance of the class.
 */
const BlockChain = require('./src/blockchain.js');

class ApplicationServer {

	constructor() {
		//Express application object
		this.app = express();
		//Blockchain class object
		this.blockchain = new BlockChain.Blockchain();
		//Method that initialized the express framework.
		this.initExpress();
		//Method that initialized middleware modules
		this.initExpressMiddleWare();
		//Method that initialized the controllers where you defined the endpoints
		this.initControllers();
		//Method that run the express application.
		this.start();
	}

	initExpress() {
		this.app.set("port", 8000);
	}

	initExpressMiddleWare() {
		this.app.use(morgan("dev"));
		// These allow us to parse any JSON body data that is received from the URL
		this.app.use(bodyParser.urlencoded({extended:true}));
		this.app.use(bodyParser.json());

		// Remember that this javascript is not meant to load anything onto a website. 
		// This code is solely backend code, nothing related to how to create a fancy design css etc.

		// this.app.get('/', (req, res) => {
		// 	res.write("Page works")
		// 	res.end()
		// })
	}

	initControllers() {
        require("./BlockchainController.js")(this.app, this.blockchain);
	}

	start() {
		let self = this;
		const port = this.app.get("port")
		this.app.listen(port, () => {
			console.log(`Server Listening for port: ${port}`);
		});
	}

}

new ApplicationServer();