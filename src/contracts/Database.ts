export interface Database {
    deleteById(id: number): Promise<void>;
    findById(id: number): Promise<any | undefined>;
    findAll(): Promise<any[] | undefined>;
    create(data: any): Promise<void>;
    update(data: any): Promise<void>;
}
