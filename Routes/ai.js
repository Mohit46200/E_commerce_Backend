const express = require("express");
const axios = require("axios");

const router = express.Router();

router.post("/ai", async (req, res) => {
  try {
    const { text } = req.body;

    // Send text to Gemini
    // const response = await axios.post(
    //   `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${process.env.GEMINI_API_KEY}`,
    //   {
    //     contents: [
    //       {
    //         parts: [
    //           {
    //             text: text,
    //           },
    //         ],
    //       },
    //     ],
    //   },
    //   {
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //   }
    // );

    // // Extract AI response
    // const aiResponse =
    //   response.data.candidates?.[0]?.content?.parts?.[0]?.text;

    // res.status(200).json({
    //   success: true,
    //   response: aiResponse,
    // });


    const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
            {
                method: "POST",
                headers: {
                "Content-Type": "application/json",
                },
                body: JSON.stringify({
                contents: [
                    {
                    parts: [
                        {
                        text: text,
                        },
                    ],
                    },
                ],
                }),
            }
            );

            const data = await response.json();

            console.log("Gemini status:", response.status);
            console.log("Gemini response:", JSON.stringify(data, null, 2));

            if (!response.ok) {
            throw new Error(
                data.error?.message || "Failed to generate AI response"
            );
            }

            const aiResponse =
            data.candidates?.[0]?.content?.parts?.[0]?.text;

            res.status(200).json({
            success: true,
            response: aiResponse,
            });


  } catch (error) {
    console.error(
      "Gemini Error:",
      error.response?.data || error.message
    );

    res.status(500).json({
      success: false,
      message: "Failed to generate AI response",
    });
  }
});

module.exports = router

