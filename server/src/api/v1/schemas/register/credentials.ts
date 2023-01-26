const bodySchema = {};

const headersSchema = {
  type: "object",
  properties: {
    "Content-Type": { type: "string" },
  },
  required: ["Content-Type"],
};

const responseSchema = {};

export const credentialsRegisterSchema = {
  body: bodySchema,
  headers: headersSchema,
  response: responseSchema,
};
