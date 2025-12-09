const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true
  },
  email: {
  type: String,
  required: [true, 'Please provide an email'],
  // Remove this line: unique: true,
  lowercase: true,
  trim: true,
  match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
 },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 6,
    select: false // Don't return password by default in queries
  },
  role: {
    type: String,
    enum: ['buyer', 'seller', 'collector', 'admin'],
    default: 'buyer'
  },
  phone: {
    type: String,
    trim: true
  },
  address: {
    street: String,
    city: String,
    state: String,
    country: String,
    zipCode: String
  },
  profileImage: {
    type: String,
    default: 'default-avatar.png'
  },
  bio: {
    type: String,
    maxlength: 500
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  totalRatings: {
    type: Number,
    default: 0
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  resetPasswordToken: {
  type: String,
  select: false
},
resetPasswordExpiry: {
  type: Date,
  select: false
},
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for faster queries
userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ role: 1 });

module.exports = mongoose.model('User', userSchema);