import { Application, NextFunction, Request, Response } from "express";

import { DbHelper } from "../db";
import { EnumCollections } from "../enums/EnumCollections";
import { IControllerBase } from "../interfaces/IControllerBase";
import { IOperandTypes } from "../interfaces/IOperandTypes";

export class OperandTypesController implements IControllerBase {

    controllerPath = "/OperandTypes";
    initActions(app: Application) {
        app.get(this.controllerPath, this.getAll.bind(this));
        app.get(`${this.controllerPath}/ByGuid/:guid`, this.getByGuid.bind(this));
        app.get(`${this.controllerPath}/ByEnumKey/:enumKey`, this.getByEnumKey.bind(this));
        app.post(this.controllerPath, this.add.bind(this));
    }

    async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const dbHelper = new DbHelper();
            const collection = await dbHelper.GetCollection<IOperandTypes>(EnumCollections.OperandTypes);
            const result = await collection.aggregate([{
                $project: {
                    _id: 0,
                }
            }]).toArray();
            res.json(result);
        } catch (error) {
            next(error);
        }
    }
    async getByGuid(req: Request, res: Response, next: NextFunction) {
        try {
            const dbHelper = new DbHelper();
            const collection = await dbHelper.GetCollection<IOperandTypes>(EnumCollections.OperandTypes);
            const result = await collection.aggregate([
                {
                    $match: {
                        Guid: req.params.guid
                    }
                },
                {
                    $project: {
                        _id: 0
                    }
                }
            ]).toArray();
            res.json(result);
        } catch (error) {
            next(error);
        }
    }
    async getByEnumKey(req: Request, res: Response, next: NextFunction) {
        try {
            const dbHelper = new DbHelper();
            const collection = await dbHelper.GetCollection<IOperandTypes>(EnumCollections.OperandTypes);
            const result = await collection.aggregate([
                {
                    $match: {
                        EnumKey: req.params.enumKey
                    }
                },
                {
                    $project: {
                        _id: 0
                    }
                }
            ]).toArray();
            res.json(result);
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
            res.json(result.insertedIds);
        } catch (error) {
            next(error);
        }
    }

}