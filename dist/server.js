"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("./config");
const app_1 = __importDefault(require("./app"));
const mongoose_1 = __importDefault(require("mongoose"));
let server;
const bootstrap = async () => {
    try {
        await mongoose_1.default.connect(config_1.database_url);
        console.log("✅ Connected to mongodb using mongoose");
        server = app_1.default.listen(config_1.port, () => {
            console.log(`✅ Library Server is Running on Port ${config_1.port}`);
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
