"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.node_env = exports.database_url = exports.port = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const port = process.env.PORT || 5000;
exports.port = port;
const database_url = process.env.DATABASE_URL;
exports.database_url = database_url;
const node_env = process.env.NODE_ENV;
exports.node_env = node_env;
