'use strict';

const router = require('express').Router();
const WhatsappCloudAPI = require('whatsappcloudapi_wrapper');
const axios = require('axios');
const fs = require("fs");
const stickers = [];
let count=1;

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

            
               
            if(typeOfMsg === 'sticker_message'){
               console.log(incomingMessage);              

                const header = {
                    'Authorization': 'Bearer '+process.env.token,
                }
                const _id  =incomingMessage.sticker.id;
                const response = await axios.get(`https://graph.facebook.com/v15.0/${_id}`, {
                    headers:header,
                }).then(res=>res.data);

    
               var config = {
                method: 'get',
                responseType: 'arraybuffer',
                url:response.url,
                encoding: null,
                headers: { 
                  'Authorization': 'Bearer '+process.env.token,
                }
              };
              



               const imageResponse = await axios(config).then(res=>{
                return res;
              });

               console.log('find type of ', typeof imageResponse);
               console.log(imageResponse);
            
               const dir =`./public/${recipientPhone}`;
               if (!fs.existsSync(dir)){
                   fs.mkdirSync(dir);
                }
              fs.writeFile(`./public/${recipientPhone}/${count}.png`,imageResponse.data, function (err) {
              console.log(err); // writes out file without error, but it's not a valid image
              count++;
              });
               

       
            
            }
              
            if (typeOfMsg === 'text_message') {
                await Whatsapp.sendText({
                    message: `Hey ${recipientName}, \nSend us 10 stickers and we will create a sticker sheet.`,
                    recipientPhone: recipientPhone, 
                    // listOfButtons: [
                    //     {
                    //         title: 'View some pictures',
                    //         id: 'see_categories',
                    //     },
                    //     {
                    //         title: 'Speak to a human',
                    //         id: 'speak_to_human',
                    //     },
                    // ],
                });
                // await Whatsapp.sendSimpleButtons({
                //     message: `Hey ${recipientName}, \nSend us 10 stickers and we will create a sticker sheet.`,
                //     recipientPhone: recipientPhone, 
                //     // listOfButtons: [
                //     //     {
                //     //         title: 'View some pictures',
                //     //         id: 'see_categories',
                //     //     },
                //     //     {
                //     //         title: 'Speak to a human',
                //     //         id: 'speak_to_human',
                //     //     },
                //     // ],
                // });
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

// router.get('/',async (req, res)=>{
//     console.log(stickers[0]);
//     const img = await sharp(stickers[0]).toFormat('png').toBuffer();

//     console.log(img);
//     const file = await loadImage(img).then((image) => {
//         ctx.drawImage(
//           image,
//           256,
//           256
//         );
  
//         return { buffer: canvas.toBuffer(), mimetype: `image/png` };
//       });

//       console.log(file);
//       res.send(file)
//     // if(stickers.length>0)
//     // res.send(`<img src=${URL.createObjectURL(stickers[0])}/>`);
//     // else
//     // res.send(`<h1>Empty</h1>`);
// });
module.exports = router;


