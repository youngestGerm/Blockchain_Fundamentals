/**
 *          BlockchainController
 *       (Do not change this code)
 * 
 * This class expose the endpoints that the client applications will use to interact with the 
 * Blockchain dataset
 */
class BlockchainController {

    // The constructor receive the instance of the express.js app and the Blockchain class
    // In other words part of this controller is an extension of the express class app.js and the class blockchain.
    constructor(app, blockchainObj) {
        this.app = app;
        this.blockchain = blockchainObj;
        // All the endpoints methods needs to be called in the constructor to initialize the route.
        this.getBlockByHeight();
        this.requestOwnership();
        this.submitStar();
        this.getBlockByHash();
        this.getStarsByOwner();
    }

    // Endpoint to Get a Block by Height (GET Endpoint)
    getBlockByHeight() {
        this.app.get("/block/:height", async (req, res) => {
            if(req.params.height) {
                const height = parseInt(req.params.height);
                let block = await this.blockchain.getBlockByHeight(height);
                
                if(block){
                    return res.status(200).json(block);
                } else {                    
                    return res.status(404).send("Block Not Found!");
                }
            } else {
                return res.status(404).send("Block Not Found! Review the Parameters!");
            }
            
        });

    }

    // Endpoint that allows user to request Ownership of a Wallet address (POST Endpoint)
    /**
    {
	"address" : "1LDyDY1PCJwAfdvm1TK5JsK8Q6VxDkSQZn"
    }
     */
    requestOwnership() {
        this.app.post("/requestValidation", async (req, res) => {
            // res.write(`requesting validation from: ${req.body.address}`)
            // res.end()
            if(req.body.address) {
                const address = req.body.address;
                const message = await this.blockchain.requestMessageOwnershipVerification(address);
                if(message){
                    return res.status(200).json(message);
                    
                } else {
                    return res.status(500).send("An error happened!");
                }
            } else {
                return res.status(500).send("Check the Body Parameter!");
            }
        });
    }

    // Endpoint that allow Submit a Star, you need to first `requestOwnership` to have the message (POST endpoint)
    // Test by passing this into the body (not params) when posting to http://localhost:8000/submitstar in postman:
    // The signature was created from a random address generator providing private and public bitcoin keys coverting the message and the private key to create a signature.
    // Address generator : https://www.bitaddress.org/bitaddress.org-v3.3.0-SHA256-dec17c07685e1870960903d8f58090475b25af946fe95a734f88408cef4aa194.html
    // Signature generator : https://reinproject.org/bitcoin-signature-tool/#sign
    // Signature verifier : https://tools.qz.sg

    /** 
    {
	"address" : "1LDyDY1PCJwAfdvm1TK5JsK8Q6VxDkSQZn",
	"message" : "1LDyDY1PCJwAfdvm1TK5JsK8Q6VxDkSQZn:1568581132:starRegistry",
	"signature" : "H3nwp/GTnNHh0v8fA6Vqf6AvqwzdzoHIg3LFXwy8DAkXdq/bhsArSRn/wh+Ih40xPFTYHZQ4vzVZ49JE8jfZuO0=",
	"star" : "test star"
    }

    From the post, this is returned as the body hash: 
    7b226f776e6572223a22314c447944593150434a77416664766d31544b354a734b3851365678446b53515a6e222c2273746172223a22746573742073746172227d.
    If there is no data change in the above JSON, this body hash will stay the same. If test star changes to test star 1 the hash is:
    7b226f776e6572223a22314c447944593150434a77416664766d31544b354a734b3851365678446b53515a6e222c2273746172223a2274657374207374617231227d
     */

    submitStar() {
        this.app.post("/submitstar", async (req, res) => {
            if(req.body.address && req.body.message && req.body.signature && req.body.star) {
                const address = req.body.address;
                const message = req.body.message;
                const signature = req.body.signature;
                const star = req.body.star;
                try {
                    let block = await this.blockchain.submitStar(address, message, signature, star);

                    if(block){
                        return res.status(200).json(block);
                    } else {
                        return res.status(500).send("An error happened!");
                    }
                } catch (error) {
                    return res.status(500).send(error);
                }
            } else {
                return res.status(500).send("Check the Body Parameter!");
            }
        });
    }

    // This endpoint allows you to retrieve the block by hash (GET endpoint)
    // Note that the code below will not run as long as /block/ is taken by another app.get
    getBlockByHash() {
        this.app.get("/blockhash/:hash", async (req, res) => {
            if(req.params.hash) {
                const hash = req.params.hash;
                let block = await this.blockchain.getBlockByHash(hash);
                if(block){
                    return res.status(200).json(block);
                } else {

                    return res.status(404).send("Block Not Found!");
                }
            } else {
                return res.status(404).send("Block Not Found! Review the Parameters!");
            }
            
        });
    }

    // This endpoint allows you to request the list of Stars registered by an owner
    /**
    http://localhost:8000/blockaddress/1LDyDY1PCJwAfdvm1TK5JsK8Q6VxDkSQZn
     */
    getStarsByOwner() {
        this.app.get("/blockaddress/:address", async (req, res) => {
            if(req.params.address) {
                const address = req.params.address;
                try {
                    let stars = await this.blockchain.getStarsByWalletAddress(address);
                    if(stars){
                        return res.status(200).json(stars);
                    } else {
                        return res.status(404).send("Block Not Found!");
                    }
                } catch (error) {
                    return res.status(500).send("An error happened!");
                }
            } else {
                return res.status(500).send("Block Not Found! Review the Parameters!");
            }
            
        });
    }

}

module.exports = (app, blockchainObj) => { return new BlockchainController(app, blockchainObj);}