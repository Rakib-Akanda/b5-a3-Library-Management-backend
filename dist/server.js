"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const config_1 = require("./config");
let server;
const bootstrap = async () => {
    try {
        server = app_1.default.listen(config_1.port, () => {
            console.log(`✅ Mango Server is running on port ${config_1.port}`);
        });
    }
    catch (error) {
        if (error) {
            console.log(console.log("❌ Error from bootstrap"));
        }
        console.log(error);
    }
};
bootstrap();
