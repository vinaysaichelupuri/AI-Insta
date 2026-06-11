import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  passwordHash: {
    type: String,
    required: true,
  },
  instagramAccessToken: {
    type: String,
  },
  instagramAccountId: {
    type: String,
  },
  instagramUsername: {
    type: String,
  },
  facebookPageId: {
    type: String,
  },
  facebookPageName: {
    type: String,
  },
  instagramTokenExpiresAt: {
    type: Date,
  },
}, { timestamps: true });

export const User = mongoose.model('User', userSchema);
