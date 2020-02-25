import bodyParser, { json } from "body-parser";
import express, { Application, NextFunction, Request, RequestHandler, Response } from "express";

import { DefinedComplexMathNodesController } from "./controllers/DefinedComplexMathNodesController";
import { DefinedDataServiceMathNodesController } from "./controllers/DefinedDataServiceMathNodesController";
import { IdSequencesController } from "./controllers/IdSequencesController";
import { OperandDefinitionsController } from "./controllers/OperandDefinitionsController";
import { OperandTypesController } from "./controllers/OperandTypesController";
import { IControllerBase } from "./interfaces/IControllerBase";

class App {
    private m_App: Application;
    private m_Port: number;
    private m_MiddleWares?: RequestHandler[];
    private m_Controllers?: IControllerBase[];

    constructor(initParams: { port: number; middleWares?: any[], controllers?: IControllerBase[]}) {
        this.m_App = express();
        this.m_Port = initParams.port;
        this.m_MiddleWares = initParams.middleWares;
        this.m_Controllers = initParams.controllers;
    }

    Listen() {
        this.m_App.set("json spaces", 2);
        if (this.m_MiddleWares != null) {
            this.m_MiddleWares.forEach((middleWare) => {
                this.m_App.use(middleWare);
            });
        }
        if (this.m_Controllers != null) {
            this.m_Controllers.forEach((controller) => {
                controller.initActions(this.m_App);
            });
        }

        this.m_App.listen(this.m_Port, (error) => {
            if (error != null) {
                console.log(error);
            } else {
                console.log(`Server started at: http://localhost:${this.m_Port}`);
            }
        })
    };
}

function headerResponse(req: Request, res: Response, next: NextFunction) {
    res.set("Access-Control-Allow-Origin", "*");
    res.set("Access-Control-Allow-Headers", [ "Content-Type" ]);
    next();
}

function requestResponseTimer(req: Request, res: Response, next: NextFunction) {
    console.log(`Requested ${req.method}-${req.url} at ${new Date()}`);
    res.on("finish", () => {
        console.log(`Responded for ${req.method}-${req.url} with ${res.statusCode} at ${new Date()}`);
    });
    res.on("error", (error) => {
        console.log(`Responded for ${req.method}-${req.url} with error at ${new Date()}. Error: ${error.name}-${error.message}-${error.stack}`);
    })
    next();
}

const app = new App({
    port: 8080,
    middleWares: [
        json(),
        headerResponse,
        requestResponseTimer,
    ],
    controllers: [
        new IdSequencesController(),
        new OperandTypesController(),
        new OperandDefinitionsController(),
        new DefinedDataServiceMathNodesController(),
        new DefinedComplexMathNodesController()
    ]
});
app.Listen();
