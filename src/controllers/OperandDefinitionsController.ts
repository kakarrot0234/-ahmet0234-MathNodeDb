import { Application, NextFunction, Request, Response } from "express";

import { DbHelper } from "../db";
import { EnumCollections } from "../enums/EnumCollections";
import { IControllerBase } from "../interfaces/IControllerBase";
import { IOperandDefinitions } from "../interfaces/IOperandDefinitions";

export class OperandDefinitionsController implements IControllerBase {

    controllerPath = "/OperandDefinitions";
    initActions(app: Application) {
        app.get(this.controllerPath, this.getAll.bind(this));
        app.get(`${this.controllerPath}/ByGuid/:guid`, this.getByGuid.bind(this));
        app.get(`${this.controllerPath}/ByKey/:key`, this.getByKey.bind(this));
        app.post(this.controllerPath, this.add.bind(this));
    }

    async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const dbHelper = new DbHelper();
            const collection = await dbHelper.GetCollection<IOperandDefinitions>(EnumCollections.OperandDefinitions);            
            const queryResult = await collection.aggregate([
                {
                    $lookup: {
                        from: "OperandTypes",
                        localField: "OperandTypeRef.CollectionGuid",
                        foreignField: "Guid",
                        as: "OperandType"
                    }
                },
                {
                    $unwind: "$OperandType"
                }
            ]).toArray();
            const result: IOperandDefinitions[] = queryResult.map((o: any) => {
                const data: IOperandDefinitions = {
                    Guid: o.Guid,
                    Precedence: o.Precedence,
                    Key: o.Key,
                    IsGrouping: o.IsGrouping,
                    OperandDirection: o.OperandDirection,
                    ParameterCount: o.ParameterCount,
                    Description: o.Description,
                    OperandRegexStr: o.OperandRegexStr,
                    OperandParRegexStr: o.OperandParRegexStr,
                    OperandType: {
                        Guid: o.OperandType.Guid,
                        EnumKey: o.OperandType.EnumKey
                    },
                    KeysForComplexConversion: o.KeysForComplexConversion,
                };
                return data;
            });
            res.json(result);
        } catch (error) {
            next(error);
        }
    }
    async getByGuid(req: Request, res: Response, next: NextFunction) {
        try {
            const dbHelper = new DbHelper();
            const collection = await dbHelper.GetCollection(EnumCollections.OperandDefinitions);
            const queryResult = await collection.aggregate([
                {
                    $match: { "Guid": req.params.guid }
                },
                {
                    $lookup: {
                        from: "OperandTypes",
                        localField: "OperandTypeRef.CollectionGuid",
                        foreignField: "Guid",
                        as: "OperandType"
                    }
                },
                {
                    $unwind: "$OperandType"
                }
            ]).toArray();
            const result: IOperandDefinitions[] = queryResult.map((o: any) => {
                const data: IOperandDefinitions = {
                    Guid: o.Guid,
                    Precedence: o.Precedence,
                    Key: o.Key,
                    IsGrouping: o.IsGrouping,
                    OperandDirection: o.OperandDirection,
                    ParameterCount: o.ParameterCount,
                    Description: o.Description,
                    OperandRegexStr: o.OperandRegexStr,
                    OperandParRegexStr: o.OperandParRegexStr,
                    OperandType: {
                        Guid: o.OperandType.Guid,
                        EnumKey: o.OperandType.EnumKey
                    },
                    KeysForComplexConversion: o.KeysForComplexConversion,
                };
                return data;
            });
            res.json(result);
        } catch (error) {
            next(error);
        }
    }
    async getByKey(req: Request, res: Response, next: NextFunction) {
        try {
            const dbHelper = new DbHelper();
            const collection = await dbHelper.GetCollection(EnumCollections.OperandTypes);
            const queryResult = await collection.aggregate([
                {
                    $match: { "EnumKey": req.params.key }
                },
                {
                    $lookup: {
                        from: EnumCollections.OperandDefinitions,
                        localField: "Guid",
                        foreignField: "OperandTypeRef.CollectionGuid",
                        as: "OperandDefinition"
                    }
                },
                {
                    $unwind: "$OperandDefinition"
                }
            ]).toArray();
            const result: IOperandDefinitions[] = queryResult.map((o: any) => {
                const data: IOperandDefinitions = {
                    Guid: o.OperandDefinition.Guid,
                    Precedence: o.OperandDefinition.Precedence,
                    Key: o.OperandDefinition.Key,
                    IsGrouping: o.OperandDefinition.IsGrouping,
                    OperandDirection: o.OperandDefinition.OperandDirection,
                    ParameterCount: o.ParameterCount,
                    Description: o.OperandDefinition.Description,
                    OperandRegexStr: o.OperandDefinition.OperandRegexStr,
                    OperandParRegexStr: o.OperandDefinition.OperandParRegexStr,
                    OperandType: {
                        Guid: o.Guid,
                        EnumKey: o.EnumKey
                    },
                    KeysForComplexConversion: o.KeysForComplexConversion,
                };
                return data;
            });
            res.json(result);
        } catch (error) {
            next(error);
        }
    }
    async add(req: Request, res: Response, next: NextFunction) {
        try {
            const datas = (req.body as {
                Guid?: string;
                Precedence?: number;
                Key?: string;
                OperandTypeRef?: string;
                IsGrouping?: boolean;
                OperandDirection?: string;
                ParameterCount?: number;
                Description?: string;
                OperandRegexStr?: string;
                OperandParRegexStr?: string;
                KeysForComplexConversion?: (string | number)[];
            }[]).map((o) => {
                const data: IOperandDefinitions = {
                    Guid: o.Guid,
                    Precedence: o.Precedence,
                    Key: o.Key,
                    OperandTypeRef: o.OperandTypeRef != null ? {
                        CollectionName: EnumCollections.OperandTypes,
                        CollectionGuid: o.OperandTypeRef!
                    } : undefined,
                    IsGrouping: o.IsGrouping,
                    OperandDirection: o.OperandDirection,
                    ParameterCount: o.ParameterCount,
                    Description: o.Description,
                    OperandRegexStr: o.OperandRegexStr,
                    OperandParRegexStr: o.OperandParRegexStr,
                    KeysForComplexConversion: o.KeysForComplexConversion,
                };
                return data;
            });
            const dbHelper = new DbHelper();
            const collection = await dbHelper.GetCollection<IOperandDefinitions>(EnumCollections.OperandDefinitions);
            const result = await collection.insertMany(datas);
            res.json(result.insertedIds);
        } catch (error) {
            next(error);
        }
    }
}