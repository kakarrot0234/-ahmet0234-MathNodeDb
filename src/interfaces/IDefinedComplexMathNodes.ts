import { IDocumentRef } from "./IDocumentRef";

export interface IDefinedComplexMathNodes {
    Guid?: string;
    FollowId?: string;
    NodeType?: string;
    OperandDefinitionRef?: IDocumentRef;
    Data?: string;
    ComplexMathExpression?: string;
    ParameterOrder?: number;
    IsCustomNode?: boolean;
    Description?: string;
    ParentGuid?: string;
    ActiveCd?: string;
}