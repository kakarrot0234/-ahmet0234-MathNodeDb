import { IDocumentRef } from "./IDocumentRef";
import { IOperandTypes } from "./IOperandTypes";

export interface IOperandDefinitions {
    Guid?: string;
    Precedence?: number;
    Key?: string;
    OperandTypeRef?: IDocumentRef;
    OperandType?: IOperandTypes;
    IsGrouping?: boolean;
    OperandDirection?: string;
    ThereIsLeftParameter?: boolean;
    ThereIsRightParameter?: boolean;
    Description?: string;
    OperandRegexStr?: string;
    OperandParRegexStr?: string;
}
