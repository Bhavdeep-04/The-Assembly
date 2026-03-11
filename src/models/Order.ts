import mongoose, { Schema, model, models } from 'mongoose';

export interface IOrderItem {
  id: string;
  name: string;
  price: number;
  category: string;
}

export interface IOrder {
  userId?: mongoose.Types.ObjectId | string;
  items: IOrderItem[];
  totalPrice: number;
  razorpayOrderId: string;
  razorpayPaymentId?: string;
  status: 'created' | 'paid' | 'failed';
  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema = new Schema<IOrderItem>({
  id: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
});

const OrderSchema = new Schema<IOrder>({
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
  items: [OrderItemSchema],
  totalPrice: { type: Number, required: true },
  razorpayOrderId: { type: String, required: true },
  razorpayPaymentId: { type: String },
  status: { type: String, enum: ['created', 'paid', 'failed'], default: 'created' },
}, { timestamps: true });

const Order = models.Order || model<IOrder>('Order', OrderSchema);

export default Order;
