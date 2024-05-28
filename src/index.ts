import cors from "cors";
import express, { Request, Response } from "express";
import { DateTime } from "luxon";
import { createLogger, transports } from "winston";

const logger = createLogger({
    level: "info",
    transports: [new transports.Console()],
});

const app = express();

app.use(
    cors({
        origin: "*",
        methods: "GET,HEAD,PUT,POST,PATCH,DELETE",
        preflightContinue: false,
        optionsSuccessStatus: 204,
    })
);
app.use(express.json());

const port = process.env.PORT || 3000;

const handle = (req: Request, res: Response) => {
    const timestamp = DateTime.utc().toISO();
    logger.info(`[${timestamp}] Received ${req.method} request`);

    logger.info("Request headers", {
        headers: req.headers,
    });

    if (Object.keys(req.params).length > 0) {
        logger.info("Request query params", {
            params: req.params,
        });
    }

    if (Object.keys(req.body).length > 0) {
        logger.info("Request body", {
            body: req.body,
        });
    }

    return {
        method: req.method,
        timestamp,
    };
};

app.get("/", (req, res) => {
    res.status(200).json(handle(req, res));
});

app.post("/", (req, res) => {
    res.status(200).json(handle(req, res));
});

app.put("/", (req, res) => {
    res.status(200).json(handle(req, res));
});

app.delete("/", (req, res) => {
    res.status(200).json(handle(req, res));
});

app.patch("/", (req, res) => {
    res.status(200).json(handle(req, res));
});

app.head("/", (_, res) => {
    res.status(200).end();
});

// `OPTION` request type supported via `cors` app

const server = app.listen(port, async () => {
    logger.info(`[server]: Server is running at http://localhost:${port}`);
});

process.on("SIGINT", () => handleShutdown("SIGINT"));
process.on("SIGTERM", () => handleShutdown("SIGTERM"));
process.on("uncaughtException", (err) => handleShutdown("uncaughtException"));
process.on("unhandledRejection", (reason, promise) =>
    handleShutdown("unhandledRejection")
);

const handleShutdown = (signal: string) => {
    logger.info(`Received ${signal}. Closing server...`);

    server.close(async () => {
        logger.info("Server closed");

        try {
            logger.info("Cleanup complete. Exiting...");
            process.exit(0);
        } catch (err) {
            console.error("Error during cleanup:", err);
            process.exit(1);
        }
    });

    // give a grace period for active connections to complete
    setTimeout(() => {
        logger.info("Grace period over. Forcefully shutting down...");
    }, 5_000);

    // force exit if server still hasn't closed after additional time
    setTimeout(() => {
        logger.info("Forcefully shutting down...");
        process.exit(1);
    }, 15_000);
};
