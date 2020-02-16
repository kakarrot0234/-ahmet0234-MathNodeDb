import { Application, NextFunction, Request, Response } from "express";
import { Collection } from "mongodb";

import { DbHelper } from "../db";
import { EnumCollections } from "../enums/EnumCollections";
import { IControllerBase } from "../interfaces/IControllerBase";
import { IDefinedComplexMathNodes } from "../interfaces/IDefinedComplexMathNodes";

interface IDataForSave {
    Guid?: string;
    FollowId?: string;
    NodeType?: string;
    OperandDefinitionRef?: string;
    OperandParameters?: IDataForSave[];
    ParentGuid?: string;
    IsCustomNode?: boolean;
    Description?: string;
    ComplexMathExpression?: string;
    Data?: string;
}

export class DefinedComplexMathNodesController implements IControllerBase {

    controllerPath = "/DefinedComplexMathNodes";
    initActions(app: Application) {
        app.get(this.controllerPath, this.getAll);
        app.get(`${this.controllerPath}/ById/:id`, this.getById);
        app.get(`${this.controllerPath}/ByParentGuid/:guid`, this.getByParentGuidId);
        app.post(this.controllerPath, this.add);
    }

    async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const dbHelper = new DbHelper();
            const collection = await dbHelper.GetCollection<IDefinedComplexMathNodes>(EnumCollections.DefinedComplexMathNodes);
            const result = await collection.find({}).toArray();
            res.send(result);
        } catch (error) {
            next(error);
        }
    }
    getById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const dbHelper = new DbHelper();
            const collection = await dbHelper.GetCollection<IDefinedComplexMathNodes>(EnumCollections.DefinedComplexMathNodes);
            const result = await collection.findOne({
                FollowId: req.params.id
            });
            res.json(result);
        } catch (error) {
            next(error);
        }
    }
    getByParentGuidId = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const dbHelper = new DbHelper();
            const collection = await dbHelper.GetCollection<IDefinedComplexMathNodes>(EnumCollections.DefinedComplexMathNodes);
            const result = await collection.find({
                ParentGuid: req.params.guid
            }).toArray();
            res.json(result);
        } catch (error) {
            next(error);
        }
    }
    add = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const nodeToSave = req.body as IDataForSave;
            const dbHelper = new DbHelper();
            const collection = await dbHelper.GetCollection<IDefinedComplexMathNodes>(EnumCollections.DefinedComplexMathNodes);
            const nodeToBeUpdate = await collection.findOne({
                Guid: nodeToSave.Guid
            });
            if (nodeToBeUpdate != null) {
                await this.deleteChildren(nodeToBeUpdate.Guid!, collection);
                const result = await collection.findOneAndUpdate({
                    Guid: nodeToBeUpdate.Guid
                },
                {
                    $set: {
                        ComplexMathExpression: nodeToSave.ComplexMathExpression,
                        Description: nodeToSave.Description,
                        Data: nodeToSave.Data,
                        IsCustomNode: nodeToSave.IsCustomNode,
                        NodeType: nodeToSave.NodeType,
                        OperandDefinitionRef: nodeToSave.OperandDefinitionRef != null ? {
                            CollectionName: EnumCollections.OperandDefinitions,
                            CollectionGuid: nodeToSave.OperandDefinitionRef
                        }: undefined
                    }
                });
                if (nodeToSave.OperandParameters != null && nodeToSave.OperandParameters.length > 0) {
                    await this.addChildren(nodeToSave.OperandParameters, collection);
                }
                res.json(result);
            } else {
                const result = await collection.insert({
                    Guid: nodeToSave.Guid,
                    FollowId: nodeToSave.FollowId,
                    NodeType: nodeToSave.NodeType,
                    OperandDefinitionRef: nodeToSave.OperandDefinitionRef != null ? {
                        CollectionName: EnumCollections.OperandDefinitions,
                        CollectionGuid: nodeToSave.OperandDefinitionRef
                    } : undefined,
                    Data: nodeToSave.Data,
                    ComplexMathExpression: nodeToSave.ComplexMathExpression,
                    IsCustomNode: nodeToSave.IsCustomNode,
                    Description: nodeToSave.Description,
                    ParentGuid: nodeToSave.ParentGuid,
                    ActiveCd: "A"
                });
                if (nodeToSave.OperandParameters != null && nodeToSave.OperandParameters.length > 0) {
                    await this.addChildren(nodeToSave.OperandParameters, collection);
                }
                res.json(result);
            }
        } catch (error) {
            next(error);
        }
    }

    deleteChildren = async (parentGuid: string, collection: Collection<IDefinedComplexMathNodes>) => {
        const childs = await collection.find({
            ParentGuid: parentGuid
        });
        childs.forEach(async (child) => {
            const result = await collection.deleteOne({
                Guid: child.Guid
            });
            if (result.deletedCount != null && result.deletedCount > 0) {
                await this.deleteChildren(child.Guid!, collection);
            }
        });
    }
    addChildren = async (children: IDataForSave[], collection: Collection<IDefinedComplexMathNodes>) => {
        let childOrder = 1;
        children.forEach(async (child) => {
            await collection.insert({
                Guid: child.Guid,
                FollowId: child.FollowId,
                NodeType: child.NodeType,
                OperandDefinitionRef: child.OperandDefinitionRef != null ? {
                    CollectionName: EnumCollections.DefinedComplexMathNodes,
                    CollectionGuid: child.OperandDefinitionRef
                } : undefined,
                Data: child.Data,
                ComplexMathExpression: child.ComplexMathExpression,
                ParameterOrder: childOrder++,
                IsCustomNode: child.IsCustomNode,
                Description: child.Description,
                ParentGuid: child.ParentGuid,
                ActiveCd: "A"
            });
            if (child.OperandParameters != null && child.OperandParameters.length > 0) {
                await this.addChildren(child.OperandParameters, collection);
            }
        });
    }
}
