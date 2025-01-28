export type TradeDirection = 'LONG' | 'SHORT';
export type TradeStatus = 'open' | 'closed' | 'cancelled';

export interface Trade {
    id: string;
    name: string;
    pair: string;
    direction: TradeDirection;
    entry_price: number;
    exit_price?: number;
    stop_loss: number;
    take_profit: number;
    position_size: number;
    entry_date: Date;
    exit_date?: Date;
    status: TradeStatus;
    pre_analysis?: string;
    post_analysis?: string;
    screenshots?: string[];
    emotional_state?: string;
    created_at: Date;
    updated_at: Date;
}

// Modifions TradeFormData pour exclure les champs automatiques
export interface TradeFormData extends
    Omit<Trade, 'id' | 'created_at' | 'updated_at' | 'exit_date' | 'exit_price' | 'post_analysis'> {
    id?: string;
}