import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from './User';

export enum Plan {
  FREE = 'FREE',
  PRO = 'PRO',
}

export enum SubscriptionStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  PAST_DUE = 'PAST_DUE',
  CANCELED = 'CANCELED',
}

export interface ISubscription extends Document {
  id: string;
  userId: string;
  user: IUser['_id'];
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  stripePriceId?: string;
  stripeCurrentPeriodEnd?: Date;
  credits: number;
  plan: Plan;
  status: SubscriptionStatus;
  createdAt: Date;
  updatedAt: Date;
}

const SubscriptionSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    stripeCustomerId: { type: String },
    stripeSubscriptionId: { type: String },
    stripePriceId: { type: String },
    stripeCurrentPeriodEnd: { type: Date },
    credits: { type: Number, default: 0 },
    plan: { type: String, enum: Object.values(Plan), default: Plan.FREE },
    status: { type: String, enum: Object.values(SubscriptionStatus), default: SubscriptionStatus.INACTIVE },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

export default mongoose.models.Subscription || mongoose.model<ISubscription>('Subscription', SubscriptionSchema);
