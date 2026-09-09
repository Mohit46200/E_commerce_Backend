// const express = require("express");
// const axios = require("axios");

// const router = express.Router();

// router.post("/ai", async (req, res) => {
//   try {
//     const { text } = req.body;
//     const response = await fetch(
//             `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
//             {
//                 method: "POST",
//                 headers: {
//                 "Content-Type": "application/json",
//                 },
//                 body: JSON.stringify({
//                 contents: [
//                     {
//                     parts: [
//                         {
//                         text: text,
//                         },
//                     ],
//                     },
//                 ],
//                 }),
//             }
//             );

//             const data = await response.json();

//             console.log("Gemini status:", response.status);
//             console.log("Gemini response:", JSON.stringify(data, null, 2));

//             if (!response.ok) {
//             throw new Error(
//                 data.error?.message || "Failed to generate AI response"
//             );
//             }

//             const aiResponse =data.candidates?.[0]?.content?.parts?.[0]?.text;

//             res.status(200).json({
//             success: true,
//             response: aiResponse,
//             });


//   } catch (error) {
//     console.error(
//       "Gemini Error:",
//       error.response?.data || error.message
//     );

//     res.status(500).json({
//       success: false,
//       message: "Failed to generate AI response",
//     });
//   }
// });

// module.exports = router




const express = require("express");
const router = express.Router();

// const Product = require("../models/Product");

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

router.post("/ai", async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({
        success: false,
        message: "Text is required",
      });
    }

    // -----------------------------
    // 1. Define tools for Gemini
    // -----------------------------

    const tools = [
      {
        functionDeclarations: [
          {
            name: "searchProducts",
            description:
              "Search products from the ecommerce store based on user requirements.",
            parameters: {
              type: "OBJECT",
              properties: {
                query: {
                  type: "STRING",
                  description:
                    "Product name or keywords the user is looking for",
                },
                maxPrice: {
                  type: "NUMBER",
                  description:
                    "Maximum price the user is willing to pay",
                },
                color: {
                  type: "STRING",
                  description: "Desired product color",
                },
              },
              required: [],
            },
          },
        ],
      },
    ];

    // -----------------------------
    // 2. Send message to Gemini
    // -----------------------------

    let response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [
                {
                  text: text,
                },
              ],
            },
          ],

          tools: tools,
        }),
      }
    );

    let data = await response.json();

    console.log(
      "Gemini:",
      JSON.stringify(data, null, 2)
    );

    if (!response.ok) {
      return res.status(response.status).json({
        success: false,
        message: data.error?.message,
      });
    }

    // -----------------------------
    // 3. Check if Gemini wants
    //    to call a function
    // -----------------------------

    const parts =
      data.candidates?.[0]?.content?.parts || [];

    const functionCall = parts.find(
      (part) => part.functionCall
    );

    // --------------------------------
    // No function call
    // --------------------------------

    if (!functionCall) {
      const answer = parts
        .filter((part) => part.text)
        .map((part) => part.text)
        .join("");

      return res.json({
        success: true,
        response: answer,
      });
    }

    // -----------------------------
    // 4. Gemini requested a tool
    // -----------------------------

    const functionName =
      functionCall.functionCall.name;

    const functionArgs =
      functionCall.functionCall.args;

    console.log("Function:", functionName);
    console.log("Arguments:", functionArgs);


    res.status(200).json({
        success: true,
        response: functionName,
        functionCall:functionCall
        });



    // let functionResult;

    // -----------------------------
    // searchProducts
    // -----------------------------

    // if (functionName === "searchProducts") {
    //   const filter = {};

    //   if (functionArgs.color) {
    //     filter.color = {
    //       $regex: functionArgs.color,
    //       $options: "i",
    //     };
    //   }

    //   if (functionArgs.maxPrice) {
    //     filter.price = {
    //       $lte: functionArgs.maxPrice,
    //     };
    //   }

    //   if (functionArgs.query) {
    //     filter.$or = [
    //       {
    //         name: {
    //           $regex: functionArgs.query,
    //           $options: "i",
    //         },
    //       },
    //       {
    //         description: {
    //           $regex: functionArgs.query,
    //           $options: "i",
    //         },
    //       },
    //       {
    //         category: {
    //           $regex: functionArgs.query,
    //           $options: "i",
    //         },
    //       },
    //     ];
    //   }

    //   const products = await Product.find(filter)
    //     .limit(10)
    //     .lean();

    //   functionResult = {
    //     products: products.map((product) => ({
    //       id: product._id.toString(),
    //       name: product.name,
    //       description: product.description,
    //       price: product.price,
    //       category: product.category,
    //       color: product.color,
    //       stock: product.stock,
    //     })),
    //   };
    // }

    

    // -----------------------------
    // Unknown function
    // -----------------------------

    // else {
    //   return res.status(400).json({
    //     success: false,
    //     message: "Unknown function requested",
    //   });
    // }

    // -----------------------------
    // 5. Send function result back
    //    to Gemini
    // -----------------------------

    // const secondResponse = await fetch(
    //   `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${GEMINI_API_KEY}`,
    //   {
    //     method: "POST",

    //     headers: {
    //       "Content-Type": "application/json",
    //     },

    //     body: JSON.stringify({
    //       contents: [
    //         {
    //           role: "user",
    //           parts: [
    //             {
    //               text: text,
    //             },
    //           ],
    //         },

    //         {
    //           role: "model",
    //           parts: [
    //             {
    //               functionCall:
    //                 functionCall.functionCall,
    //             },
    //           ],
    //         },

    //         {
    //           role: "user",
    //           parts: [
    //             {
    //               functionResponse: {
    //                 name: functionName,
    //                 response: functionResult,
    //               },
    //             },
    //           ],
    //         },
    //       ],

    //       tools: tools,
    //     }),
    //   }
    // );

    // const secondData =
    //   await secondResponse.json();

    // if (!secondResponse.ok) {
    //   console.error(secondData);

    //   return res.status(secondResponse.status).json({
    //     success: false,
    //     message:
    //       secondData.error?.message ||
    //       "Gemini error",
    //   });
    // }

    // -----------------------------
    // 6. Get final Gemini answer
    // -----------------------------

    // const finalParts =
    //   secondData.candidates?.[0]?.content?.parts ||
    //   [];

    // const finalAnswer = finalParts
    //   .filter((part) => part.text)
    //   .map((part) => part.text)
    //   .join("");

    // return res.json({
    //   success: true,
    //   response: finalAnswer,
    //   function: {
    //     name: functionName,
    //     result: functionResult,
    //   },
    // });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;