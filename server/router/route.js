'use strict';

const router = require('express').Router();
const EcommerceStore = require('./../utils/ecommerce_store.js');
const WhatsappCloudAPI = require('whatsappcloudapi_wrapper');
const axios = require('axios');


let Store = new EcommerceStore();
const CustomerSession = new Map();
const sharp = require('sharp');

const stickers = [];

const Whatsapp = new WhatsappCloudAPI({
    accessToken: process.env.Meta_WA_accessToken,
    senderPhoneNumberId: process.env.Meta_WA_SenderPhoneNumberId,
    WABA_ID: process.env.Meta_WA_wabaId, 
    graphAPIVersion: 'v14.0'
});



router.get('/meta_wa_callbackurl', (req, res) => {
    try {
        console.log('GET: Someone is pinging me!');

        let mode = req.query['hub.mode'];
        let token = req.query['hub.verify_token'];
        let challenge = req.query['hub.challenge'];

        if (
            mode &&
            token &&
            mode === 'subscribe' &&
            process.env.Meta_WA_VerifyToken === token
        ) {
            return res.status(200).send(challenge);
        } else {
            return res.sendStatus(403);
        }
    } catch (error) {
        console.error({error})
        return res.sendStatus(500);
    }
});


router.post('/meta_wa_callbackurl', async (req, res) => {
    try {
        console.log('POST: Someone is pinging me!');

        let data = Whatsapp.parseMessage(req.body);
        
        if (data?.isMessage) {
            let incomingMessage = data.message;
            let recipientPhone = incomingMessage.from.phone; // extract the phone number of sender
            let recipientName = incomingMessage.from.name;
            let typeOfMsg = incomingMessage.type; // extract the type of message (some are text, others are images, others are responses to buttons etc...)
            let message_id = incomingMessage.message_id; // extract the message id

            console.log(incomingMessage);
               
            if(typeOfMsg === 'sticker_message'){
             //   console.log(incomingMessage);
             //   console.log(stickers);
                

                const header = {
                    'Authorization': 'Bearer '+'EAALtvRCJ8bgBAHHZAGaIvj96uSMHwFMZAb9zgzPjAjebbuVZBVZCinoK7l1JQLT3pzXSUZBNBYgzRWZCRv4YBcxoDa1EfLnOyeO1TNSaA1WNBBxVboZAkuXHhhrckaZBJ5qzNyJdx2W7UPENEtPnReGZCnKH1w2ATpM1zsGsh5JJhws0sOUa1cZB2B9Wi3o6J4M78UUZBsFq1dpPFpIN6oZCUzEZB',
                }

                const response = await axios.get(`https://graph.facebook.com/v15.0/${incomingMessage.sticker.id}`, {
                    headers:header,
                }).then(res=>res.data);

                const imageResponse = await axios.get(response.url,{headers:header}).then(res=>res.data);
                
                let img = Buffer.from(imageResponse, 'binary').toString('base64'); //or Buffer.from(data, 'binary')
               
                
                console.log('the data I got in response Image ',img);

                   // stickers.push(incomingMessage.sticker);
                   // console.log(stickers);
            
            }
              
            if (typeOfMsg === 'text_message') {
                await Whatsapp.sendSimpleButtons({
                    message: `Hey ${recipientName}, \nYou are speaking to a chatbot.\nWhat do you want to do next?`,
                    recipientPhone: recipientPhone, 
                    listOfButtons: [
                        {
                            title: 'View some products',
                            id: 'see_categories',
                        },
                        {
                            title: 'Speak to a human',
                            id: 'speak_to_human',
                        },
                    ],
                });
            }

            if (typeOfMsg === 'simple_button_message') {
                let button_id = incomingMessage.button_reply.id;
            
                if (button_id === 'speak_to_human') {
                    await Whatsapp.sendText({
                        recipientPhone: recipientPhone,
                        message: `Arguably, chatbots are faster than humans.\nCall my human with the below details:`,
                    });
            
                    await Whatsapp.sendContact({
                        recipientPhone: recipientPhone,
                        contact_profile: {
                            addresses: [
                                {
                                    city: 'Nairobi',
                                    country: 'Kenya',
                                },
                            ],
                            name: {
                                first_name: 'Daggie',
                                last_name: 'Blanqx',
                            },
                            org: {
                                company: 'Mom-N-Pop Shop',
                            },
                            phones: [
                                {
                                    phone: '+1 (555) 025-3483',
                                },
                                                    {
                                    phone: '+254712345678',
                                },
                            ],
                        },
                    });
                }

                if (button_id === 'see_categories') {

                    await Whatsapp.sendImage({
                        recipientPhone,
                        url: "https://www.simplilearn.com/ice9/free_resources_article_thumb/what_is_image_Processing.jpg",
                        caption: "THis is the picture I found",
                    });

                    //let categories = await Store.getAllCategories(); 
                    // await Whatsapp.sendSimpleButtons({
                    //     message: `We have several categories.\nChoose one of them.`,
                    //     recipientPhone: recipientPhone, 
                    //     listOfButtons: [
                    //         {
                    //             title: "Pictures",
                    //             id: `category_1`,
                    //         },
                    //         {
                    //             title: "Frames",
                    //             id: `category_2`,
                    //         }
                    //     ]
                    // //     listOfButtons: categories.data
                    // //         .map((category) => ({
                    // //             title: category,
                    // //             id: `category_${category}`,
                    // //         }))
                    // //         .slice(0, 3)
                    // });
                }

            };


        }


        return res.sendStatus(200);
    } catch (error) {
                console.error({error})
        return res.sendStatus(500);
    }
});

router.get('/',async (req, res)=>{
    console.log(stickers[0]);
    const img = await sharp(stickers[0]).toFormat('png').toBuffer();

    console.log(img);
    const file = await loadImage(img).then((image) => {
        ctx.drawImage(
          image,
          256,
          256
        );
  
        return { buffer: canvas.toBuffer(), mimetype: `image/png` };
      });

      console.log(file);
      res.send(file)
    // if(stickers.length>0)
    // res.send(`<img src=${URL.createObjectURL(stickers[0])}/>`);
    // else
    // res.send(`<h1>Empty</h1>`);
});
module.exports = router;