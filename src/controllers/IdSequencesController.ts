import { Application, NextFunction, Request, Response } from "express";

import { DbHelper } from "../db";
import { EnumCollections } from "../enums/EnumCollections";
import { IControllerBase } from "../interfaces/IControllerBase";
import { IIdSequences } from "../interfaces/IIdSequences";

export class IdSequencesController implements IControllerBase {

    controllerPath = "/IdSequences";
    initActions(app: Application) {
        app.get(`${this.controllerPath}/DataServiceNode`, this.getDataServiceNodeId.bind(this));
        app.get(`${this.controllerPath}/ComplexMathNode`, this.getComplexMathNodeId.bind(this));
    }

    async getDataServiceNodeId(req: Request, res: Response, next: NextFunction) {
        try {
            const dbHelper = new DbHelper();
            const collection = await dbHelper.GetCollection<IIdSequences>(EnumCollections.IdSequence);
            const sequence = await collection.findOneAndUpdate({
                Name: "DataServiceNode"
            }, {
                $inc: { NextId: 1 }
            });
            if (sequence.value != null) {
                res.send(JSON.stringify(sequence.value.NextId, null, 4));
            } else {
                res.send(JSON.stringify(0, null, 4));
            }

        } catch (error) {
            next(error);
        }
    }
    async getComplexMathNodeId(req: Request, res: Response, next: NextFunction) {
        try {
            const dbHelper = new DbHelper();
            const collection = await dbHelper.GetCollection<IIdSequences>(EnumCollections.IdSequence);
            const sequence = await collection.findOneAndUpdate({
                Name: "ComplexMathNode"
            }, {
                $inc: { NextId: 1 }
            });
            if (sequence.value != null) {
                res.json(sequence.value.NextId);
            } else {
                res.json(0);
            }

        } catch (error) {
            next(error);
        }
    }
}