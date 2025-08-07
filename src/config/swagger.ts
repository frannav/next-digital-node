import swaggerJSDoc from "swagger-jsdoc";

const swaggerOptions: swaggerJSDoc.Options = {
	swaggerDefinition: {
		openapi: "3.0.0",
		info: {
			title: "Node JS API",
			version: "1.0.0",
			description: "API for the Node JS project",
		},
		servers: [
			{
				url: `http://localhost:${process.env.PORT || 3000}`,
			},
		],
	},
	apis: ["./src/modules/**/*.ts", "./src/routes.ts"],
};

const swaggerDocs = swaggerJSDoc(swaggerOptions);

export default swaggerDocs;
