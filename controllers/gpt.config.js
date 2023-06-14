const { OpenAIApi, Configuration } = require("openai");

// const openai = new OpenAIApi(configuration);
const openai = new OpenAIApi(
  new Configuration({
    apiKey: "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",
  })
);

// const response = await openai.listEngines();
const generateAnswers = async (req, res) => {
  const { body } = req;

  openai
    .createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: body.question }],
    })
    .then((response) => {
      // console.log(response.data.choices[0].message.content);
      res
        .status(200)
        .json({ success: true, msg: response.data.choices[0].message.content });
    })
    .catch((err) => {
      res.status(500).json({ success: false, msg: err.message });
    });
};

module.exports = generateAnswers;
