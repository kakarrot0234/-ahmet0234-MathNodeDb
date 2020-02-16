import { Application, NextFunction, Request, Response } from "express";

import { DbHelper } from "../db";
import { EnumCollections } from "../enums/EnumCollections";
import { IControllerBase } from "../interfaces/IControllerBase";
import { IOperandTypes } from "../interfaces/IOperandTypes";

export class OperandTypesController implements IControllerBase {

    controllerPath = "/OperandTypes";
    initActions(app: Application) {
        app.get(this.controllerPath, this.getAll);
        app.get(`${this.controllerPath}/ByGuid/:guid`, this.getByGuid);
        app.get(`${this.controllerPath}/ByEnumKey/:enumKey`, this.getByEnumKey);
        app.post(this.controllerPath, this.add);
    }

    async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const dbHelper = new DbHelper();
            const collection = await dbHelper.GetCollection<IOperandTypes>(EnumCollections.OperandTypes);
            const result = await collection.find({}).toArray();
            res.send(JSON.stringify(result, null, 4));
        } catch (error) {
            next(error);
        }
    }
    async getByGuid(req: Request, res: Response, next: NextFunction) {
        try {
            const dbHelper = new DbHelper();
            const collection = await dbHelper.GetCollection<IOperandTypes>(EnumCollections.OperandTypes);
            const result = await collection.find({
                Guid: req.params.guid
            }).toArray();
            res.send(JSON.stringify(result, null, 4));
        } catch (error) {
            next(error);
        }
    }
    async getByEnumKey(req: Request, res: Response, next: NextFunction) {
        try {
            const dbHelper = new DbHelper();
            const collection = await dbHelper.GetCollection<IOperandTypes>(EnumCollections.OperandTypes);
            const result = await collection.find({
                EnumKey: req.params.enumKey
            }).toArray();
            res.send(JSON.stringify(result, null, 4));
        } catch (error) {
            next(error);
        }
    }
    async add(req: Request, res: Response, next: NextFunction) {
        try {
            const datas = req.body as IOperandTypes[];
            const dbHelper = new DbHelper();
            const collection = await dbHelper.GetCollection<IOperandTypes>(EnumCollections.OperandTypes);
            const result = await collection.insertMany(datas);
            res.send(JSON.stringify(result, null, 4));
        } catch (error) {
            next(error);
        }
    }

}