import { Application, NextFunction, Request, Response } from "express";

import { DbHelper } from "../db";
import { EnumCollections } from "../enums/EnumCollections";
import { IControllerBase } from "../interfaces/IControllerBase";
import { IDefinedDataServiceMathNodes } from "../interfaces/IDefinedDataServiceMathNodes";

export class DefinedDataServiceMathNodesController implements IControllerBase {

    controllerPath = "/DefinedDataServiceMathNodes";
    initActions(app: Application) {
        app.get(this.controllerPath, this.getAll.bind(this));
        app.get(`${this.controllerPath}/GetByGuid/:guid`, this.getByGuid.bind(this));
        app.get(`${this.controllerPath}/GetById/:id`, this.getById.bind(this));
        app.get(`${this.controllerPath}/GetByDataKey/:dataKey`, this.getByDataKey.bind(this));
        app.post(this.controllerPath, this.add.bind(this));
    }

    async getAll (req: Request, res: Response, next: NextFunction) {
        try {
            const dbHelper = new DbHelper();
            const collection = await dbHelper.GetCollection<IDefinedDataServiceMathNodes>(EnumCollections.DefinedDataServiceMathNodes);
            const result = await collection.find({}).toArray();
            res.json(result);
        } catch (error) {
            next(error);
        }
    }
    async getByGuid (req: Request, res: Response, next: NextFunction) {
        try {
            const dbHelper = new DbHelper();
            const collection = await dbHelper.GetCollection<IDefinedDataServiceMathNodes>(EnumCollections.DefinedDataServiceMathNodes);
            const result = await collection.findOne( { Guid: req.params.guid });
            res.json(result);
        } catch (error) {
            next(error);
        }
    }
    async getById (req: Request, res: Response, next: NextFunction) {
        try {
            const dbHelper = new DbHelper();
            const collection = await dbHelper.GetCollection<IDefinedDataServiceMathNodes>(EnumCollections.DefinedDataServiceMathNodes);
            const result = await collection.findOne( { FollowId: req.params.id });
            res.json(result);
        } catch (error) {
            next(error);
        }
    }
    async getByDataKey (req: Request, res: Response, next: NextFunction) {
        try {
            const dbHelper = new DbHelper();
            const collection = await dbHelper.GetCollection<IDefinedDataServiceMathNodes>(EnumCollections.DefinedDataServiceMathNodes);
            const result = await collection.findOne( { DataKey: req.params.dataKey });
            res.json(result);
        } catch (error) {
            next(error);
        }
    }
    async add (req: Request, res: Response, next: NextFunction) {
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
            if (resultForUpdate.value == null) {
                const resultForInsert = await collection.insert({
                    Guid: nodeToSave.Guid,
                    FollowId: nodeToSave.FollowId,
                    DataKey: nodeToSave.DataKey,
                    Description: nodeToSave.Description,
                    ActiveCd: "A"
                });
                const insertedNode = await collection.findOne({
                    _id: resultForInsert.insertedIds[0]
                });
                res.json(insertedNode);
            } else {
                res.json(resultForUpdate.value);
            }
        } catch (error) {
            next(error);
        }
    }
}
