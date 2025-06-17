import { Tinta } from './Tinta';

export type TintaCreateInput = Omit<Tinta, 'id'>;
export type TintaUpdateInput = Partial<TintaCreateInput>;

export interface ITintaRepository {
    create(data: TintaCreateInput): Promise<Tinta>;
    findAll(): Promise<Tinta[]>;
    findById(id: number): Promise<Tinta | null>;
    update(id: number, data: TintaUpdateInput): Promise<Tinta | null>;
    delete(id: number): Promise<boolean>;
}