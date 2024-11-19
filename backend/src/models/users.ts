import mongoose from 'mongoose';

export interface IToken {
  token: string;
}

export interface IUser {
  name: string;
  email: string;
  password: string;
  tokens: IToken[];
}

const userSchema = new mongoose.Schema<IUser>({
  name: {
    type: String,
    required: false,
    minlength: 2,
    maxlength: 30,
    unique: false,
    default: 'Ё-мое',
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  tokens: [
    {
      token: { type: String, required: true },
    },
  ],
});

export default mongoose.model<IUser>('user', userSchema);
