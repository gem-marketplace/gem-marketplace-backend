const mongoose = require('mongoose');

const gemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a gem title'],
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    required: [true, 'Please provide a description'],
    maxlength: 2000
  },
  gemType: {
    type: String,
    required: [true, 'Please specify gem type'],
    enum: ['Diamond', 'Ruby', 'Sapphire', 'Emerald', 'Topaz', 'Amethyst', 'Opal', 'Pearl', 'Jade', 'Other']
  },
  carat: {
    type: Number,
    required: [true, 'Please provide carat weight'],
    min: 0
  },
  cut: {
    type: String,
    enum: ['Round', 'Princess', 'Oval', 'Emerald', 'Cushion', 'Pear', 'Marquise', 'Radiant', 'Asscher', 'Heart', 'Other'],
    required: true
  },
  color: {
    type: String,
    required: [true, 'Please specify color'],
    trim: true
  },
  clarity: {
    type: String,
    enum: ['FL', 'IF', 'VVS1', 'VVS2', 'VS1', 'VS2', 'SI1', 'SI2', 'I1', 'I2', 'I3', 'N/A']
  },
  origin: {
    type: String,
    required: [true, 'Please specify origin'],
    trim: true
  },
  images: [{
    url: {
      type: String,
      required: true
    },
    public_id: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  certificates: [{
    url: {
      type: String,
      required: true
    },
    public_id: String,
    certificateType: {
      type: String,
      enum: ['GIA', 'AGS', 'IGI', 'EGL', 'GSI', 'Gem & Jewellery Authority', 'Other']
    },
    certificateNumber: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  listingType: {
    type: String,
    enum: ['portfolio', 'fixed-price', 'auction'],
    required: true,
    default: 'portfolio'
  },
  price: {
    type: Number,
    min: 0
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'sold'],
    default: 'pending'
  },
  rejectionReason: {
    type: String,
    maxlength: 500
  },
  isPublic: {
    type: Boolean,
    default: false // For portfolio items
  },
  views: {
    type: Number,
    default: 0
  },
  watchers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes for faster queries
gemSchema.index({ seller: 1 });
gemSchema.index({ status: 1 });
gemSchema.index({ listingType: 1 });
gemSchema.index({ gemType: 1 });

module.exports = mongoose.model('Gem', gemSchema);