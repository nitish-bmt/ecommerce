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
exports.establishConnection = establishConnection;
const rabbitmq_stream_js_client_1 = __importDefault(require("rabbitmq-stream-js-client"));
function establishConnection() {
    return __awaiter(this, void 0, void 0, function* () {
        const streamName = "order-stream";
        const client = yield rabbitmq_stream_js_client_1.default.connect({
            hostname: "localhost",
            port: 5552,
            username: "guest",
            password: "guest",
            vhost: "/",
        });
        console.log("Making sure the stream exists...");
        const streamSizeRetention = 5 * 1e9;
        yield client.createStream({ stream: streamName, arguments: { "max-length-bytes": streamSizeRetention } });
        return (yield client.declarePublisher({ stream: streamName }));
    });
}
