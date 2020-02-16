import { Application, NextFunction, Request, Response } from "express";

import { DbHelper } from "../db";
import { EnumCollections } from "../enums/EnumCollections";
import { IControllerBase } from "../interfaces/IControllerBase";
import { IDefinedDataServiceMathNodes } from "../interfaces/IDefinedDataServiceMathNodes";

export class DefinedDataServiceMathNodesController implements IControllerBase {

    controllerPath = "/DefinedDataServiceMathNodes";
    initActions(app: Application) {
        app.get(this.controllerPath, this.getAll);
        app.get(`${this.controllerPath}/GetByGuid/:guid`, this.getByGuid);
        app.get(`${this.controllerPath}/GetById/:id`, this.getById);
        app.get(`${this.controllerPath}/GetByDataKey/:dataKey`, this.getByDataKey);
        app.post(this.controllerPath, this.add);
    }

    getAll = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const dbHelper = new DbHelper();
            const collection = await dbHelper.GetCollection<IDefinedDataServiceMathNodes>(EnumCollections.DefinedDataServiceMathNodes);
            const result = await collection.find({}).toArray();
            res.send(result);
        } catch (error) {
            next(error);
        }
    }
    getByGuid = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const dbHelper = new DbHelper();
            const collection = await dbHelper.GetCollection<IDefinedDataServiceMathNodes>(EnumCollections.DefinedDataServiceMathNodes);
            const result = await collection.findOne( { Guid: req.params.guid });
            res.send(result);
        } catch (error) {
            next(error);
        }
    }
    getById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const dbHelper = new DbHelper();
            const collection = await dbHelper.GetCollection<IDefinedDataServiceMathNodes>(EnumCollections.DefinedDataServiceMathNodes);
            const result = await collection.findOne( { FollowId: req.params.id });
            res.send(result);
        } catch (error) {
            next(error);
        }
    }
    getByDataKey = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const dbHelper = new DbHelper();
            const collection = await dbHelper.GetCollection<IDefinedDataServiceMathNodes>(EnumCollections.DefinedDataServiceMathNodes);
            const result = await collection.findOne( { DataKey: req.params.dataKey });
            res.send(result);
        } catch (error) {
            next(error);
        }
    }
    add = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const nodeToSave = req.body as IDefinedDataServiceMathNodes;
            const dbHelper = new DbHelper();
            const collection = await dbHelper.GetCollection<IDefinedDataServiceMathNodes>(EnumCollections.DefinedDataServiceMathNodes);
            const resultForUpdate = await collection.findOneAndUpdate({
                Guid: nodeToSave.Guid
            },
            {
                $set: {
                    DataKey: nodeToSave.DataKey,
                    Description: nodeToSave.Description
                }
            });
            console.log(resultForUpdate.value == null);
            if (resultForUpdate.value == null) {
                const resultForInsert = await collection.insert({
                    Guid: nodeToSave.Guid,
                    FollowId: nodeToSave.FollowId,
                    DataKey: nodeToSave.DataKey,
                    Description: nodeToSave.Description,
                    ActiveCd: "A"
                });
                res.json(resultForInsert.result);
            } else {
                res.json(resultForUpdate.ok);
            }
        } catch (error) {
            next(error);
        }
    }
}
