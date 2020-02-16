import * as MongoDb from "mongodb";

import { EnumCollections } from "./enums/EnumCollections";

export class DbHelper {
    private dbName = "MathExpression";
    private db: MongoDb.Db | undefined;

    private async getDb(): Promise<MongoDb.Db> {
        try {
            if (this.db == null) {
                const client = await MongoDb.connect("mongodb://localhost:27017", { useUnifiedTopology: true });
                this.db = client.db(this.dbName);
            }

            return this.db;
        } catch (error) {
            throw error;
        }
    }

    public async GetCollection<T>(collection: EnumCollections): Promise<MongoDb.Collection<T>> {
        return (await this.getDb()).collection<T>(collection);
    }
}
