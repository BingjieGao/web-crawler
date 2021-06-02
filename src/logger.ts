"use strict";
import Log4js from "log4js";
import { omit } from "./utility";

const logReflector = (value: string | number | Date) => {
    return value ? `${value}` : "-";
}
const log4jsConfig = {
    appenders: {
        out: {
            type: "console",
            layout: {
                type: "json"
            },
        },
        error: {
            type: "console",
            layout: {
                type: "json"
            },
        },
        "application-log": {
            type: "console",
            layout: {
                type: "json"
            },
        }
    },
    categories: {
        default: { appenders: ["out", "application-log", "error"], level: "debug" }
    }
}
Log4js.addLayout("json", function() {
    return function(logEvent) {
        let data: { [key: string]: any } = {};

        try {
            logEvent.data.forEach((log) => {
                switch (typeof log) {
                    case "string":
                        Object.assign(data, JSON.parse(log));
                        break;
                    case "object":
                        Object.assign(data, log);
                        break;
                    default:
                        Object.assign(data, { message: log });
                }
            });
        } catch (err) {
            Object.assign(data, { message: logEvent.data.join() });
        } finally {
            //console.log((omit("function", data)));
            return JSON.stringify({
                "start-time": `${logReflector(logEvent["startTime"])}`,
                logname: `${logReflector(logEvent["categoryName"])}`,
                level: `${logReflector(logEvent["level"]["levelStr"])}`,
                method: `${logReflector(data["method"])}`,
                message: `${logReflector(data["message"])}`,
                "response-time": `${logReflector(data["response-time"])}`,
                url: `${logReflector(data["url"])}`,
                "remote-addr": `${logReflector(data["remote-addr"])}`,
                status: data["status"],
                stack: `${logReflector(data["stack"])}`,
                function: `${logReflector(data["function"])}`,
                data: omit("function", data),
                "time-cost": `${logReflector(data["TimeCost"])}`
            });
        }
    };
});

Log4js.configure(log4jsConfig);
export const logger = Log4js.getLogger("application-log");