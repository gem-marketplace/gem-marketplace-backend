const mongoose = require('mongoose');

const auctionSchema = new mongoose.Schema({
  gem: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Gem',
    required: true
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  startPrice: {
    type: Number,
    required: [true, 'Please provide starting price'],
    min: 0
  },
  currentBid: {
    type: Number,
    default: 0
  },
  minimumBidIncrement: {
    type: Number,
    required: true,
    default: 100,
    min: 1
  },
  highestBidder: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  startTime: {
    type: Date,
    required: true
  },
  endTime: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['upcoming', 'active', 'ended', 'cancelled'],
    default: 'upcoming'
  },
  totalBids: {
    type: Number,
    default: 0
  },
  winner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
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

// Indexes
auctionSchema.index({ gem: 1 }, { unique: true });
auctionSchema.index({ status: 1 });
auctionSchema.index({ endTime: 1 });

// Method to check if auction is active
auctionSchema.methods.isActive = function() {
  const now = new Date();
  return this.status === 'active' && now >= this.startTime && now < this.endTime;
};

module.exports = mongoose.model('Auction', auctionSchema);