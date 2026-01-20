import mongoose, { Schema, Types } from "mongoose";

export type OrderStatus =
    | "Нийтэлсэн"
    | "Агент судлаж байна"
    | "Төлбөр"
    | "Баталгаажуулсан";

export interface IOrderItem {
    productUrl: string;
    productImage?: string;
    name: string;
    quantity: number;
    price: number;
    userAmount: number;
    userPaymentVerified: boolean;
    agentPaymentPaid: boolean;
    trackCode?: string;
    paymentLink?: string;
    additionalImages: string[];
    additionalDescription?: string;
}

export interface IAgentOrder {
    userId: mongoose.Types.ObjectId;
    agentId?: mongoose.Types.ObjectId;
    items: Types.DocumentArray<IOrderItem>;
    totalAmount: number;
    status: OrderStatus;
    phone?: string;
    notes?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

const OrderItemSchema = new Schema<IOrderItem>(
    {
        productUrl: {
            type: String,
            required: true,
            trim: true,
        },
        productImage: {
            type: String,
            trim: true,
        },
        name: {
            type: String,
            required: true,
            trim: true,
        },
        quantity: {
            type: Number,
            required: true,
            min: 1,
            default: 1,
        },
        price: {
            type: Number,
            required: true,
            min: 0,
        },
        userAmount: {
            type: Number,
            required: true,
            min: 0,
        },
        userPaymentVerified: {
            type: Boolean,
            default: false,
        },
        agentPaymentPaid: {
            type: Boolean,
            default: false,
        },
        trackCode: {
            type: String,
            trim: true,
        },
        paymentLink: {
            type: String,
            trim: true,
        },
        additionalImages: {
            type: [String],
            default: [],
        },
        additionalDescription: {
            type: String,
            trim: true,
        },
    },
    { _id: true }
);

const AgentOrderSchema = new Schema<IAgentOrder>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        agentId: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
        items: {
            type: [OrderItemSchema],
            required: true,
        },
        totalAmount: {
            type: Number,
            required: true,
            min: 0,
        },
        status: {
            type: String,
            enum: ["Нийтэлсэн", "Агент судлаж байна", "Төлбөр", "Баталгаажуулсан"],
            default: "Нийтэлсэн",
        },
        phone: {
            type: String,
            trim: true,
        },
        notes: {
            type: String,
            trim: true,
        },
    },
    {
        timestamps: true,
        collection: "agentOrders",
    }
);

export const AgentOrder = mongoose.model<IAgentOrder>("AgentOrder", AgentOrderSchema);
