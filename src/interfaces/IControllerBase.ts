import { Application } from "express";

export interface IControllerBase {
    controllerPath: string;
    initActions(app: Application): void;
}