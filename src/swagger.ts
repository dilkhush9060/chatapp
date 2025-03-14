import { Application } from "express";
import swaggerJsdoc from "swagger-jsdoc";
import { apiReference } from "@scalar/express-api-reference";
import { version } from "../package.json";

// 🚀 **Swagger OpenAPI Auto-Generation**
const swaggerOptions: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Chat App API",
      version,
      description: "API documentation for the chat app",
    },
    servers: [{ url: "http://localhost:5000" }],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  apis: ["./src/routes/*.ts", "./src/validators/*.ts", "./src/server.ts"],
};
const swaggerSpec = swaggerJsdoc(swaggerOptions);

export function swaggerDocs(app: Application) {
  // docs
  app.use(
    "/docs",
    //@ts-ignore
    apiReference({
      theme: "kepler",
      spec: {
        content: swaggerSpec,
      },
      customCss: `* { font-family: "Poppins", cursive, sans-serif; }`,
    })
  );
}
