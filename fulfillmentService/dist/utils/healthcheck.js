"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formattedServerUptime = formattedServerUptime;
function formattedServerUptime() {
    const uptime = process.uptime();
    return `${Math.floor(uptime / (60 * 60))}hrs ${Math.floor((uptime % (60 * 60)) / 60)}mins ${Math.floor(uptime % 60)}secs`;
}
