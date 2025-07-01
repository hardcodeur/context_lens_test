"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchWithTavily = searchWithTavily;
const core_1 = require("@tavily/core");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
function searchWithTavily(q) {
    return __awaiter(this, void 0, void 0, function* () {
        const tvly = (0, core_1.tavily)({ apiKey: process.env.TAVILY_API_KEY });
        try {
            const response = yield tvly.search(q);
            return parseTavilyToGraphResponse(response);
        }
        catch (error) {
            console.error(error);
        }
    });
}
function parseTavilyToGraphResponse(response) {
    return {
        main_node: {
            id: 0,
            label: response.query
        },
        nodes: response.results.map((result, i) => ({
            id: i + 1,
            label: result.title,
            url: result.url,
            content: result.content
        }))
    };
}
