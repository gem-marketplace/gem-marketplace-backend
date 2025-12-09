const Gem = require('../models/Gem');
const { uploadToCloudinary } = require('../config/cloudinary');

// @desc    Create new gem listing
// @route   POST /api/gems
// @access  Private (Seller/Collector only)
exports.createGem = async (req, res) => {
  try {
    const {
      title,
      description,
      gemType,
      carat,
      cut,
      color,
      clarity,
      origin,
      listingType,
      price
    } = req.body;

    console.log('Received gem data:', req.body);
    console.log('Received files:', req.files);

    // Validation
    if (!title || !description || !gemType || !carat || !cut || !color || !origin) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    // Check if user is seller or collector
    if (req.user.role !== 'seller' && req.user.role !== 'collector') {
      return res.status(403).json({
        success: false,
        message: 'Only sellers and collectors can create gem listings'
      });
    }

    // Process uploaded images
    const images = [];
    if (req.files && req.files.images) {
      console.log('Processing images...');
      for (const file of req.files.images) {
        try {
          // For now, just save file info without uploading to cloud
          images.push({
            url: `/uploads/${file.originalname}`,
            public_id: file.originalname
          });
        } catch (err) {
          console.error('Image processing error:', err);
        }
      }
    }

    // Process uploaded certificates
    const certificates = [];
    if (req.files && req.files.certificates) {
      console.log('Processing certificates...');
      for (const file of req.files.certificates) {
        try {
          certificates.push({
            url: `/uploads/${file.originalname}`,
            public_id: file.originalname,
            certificateType: req.body.certificateType || 'Other'
          });
        } catch (err) {
          console.error('Certificate processing error:', err);
        }
      }
    }

    // Create gem
    const gem = await Gem.create({
      title,
      description,
      gemType,
      carat: parseFloat(carat),
      cut,
      color,
      clarity,
      origin,
      images,
      certificates,
      seller: req.user.id,
      listingType: listingType || 'portfolio',
      price: price ? parseFloat(price) : undefined,
      status: 'pending'
    });

    console.log('Gem created successfully:', gem._id);

    res.status(201).json({
      success: true,
      message: 'Gem listing created successfully. Awaiting admin approval.',
      data: gem
    });
  } catch (error) {
    console.error('Create gem error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get all gems for current seller
// @route   GET /api/gems/my-gems
// @access  Private
exports.getMyGems = async (req, res) => {
  try {
    const gems = await Gem.find({ seller: req.user.id })
      .sort({ createdAt: -1 })
      .populate('seller', 'name email');

    res.status(200).json({
      success: true,
      count: gems.length,
      data: gems
    });
  } catch (error) {
    console.error('Get my gems error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get single gem by ID
// @route   GET /api/gems/:id
// @access  Public
exports.getGemById = async (req, res) => {
  try {
    const gem = await Gem.findById(req.params.id).populate('seller', 'name email rating');

    if (!gem) {
      return res.status(404).json({
        success: false,
        message: 'Gem not found'
      });
    }

    // Increment views
    gem.views += 1;
    await gem.save();

    res.status(200).json({
      success: true,
      data: gem
    });
  } catch (error) {
    console.error('Get gem error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get all approved gems
// @route   GET /api/gems/approved
// @access  Public
exports.getAllGems = async (req, res) => {
  try {
    const { gemType, minCarat, maxCarat, origin, listingType } = req.query;

    let query = { status: 'approved' };

    if (gemType) query.gemType = gemType;
    if (origin) query.origin = new RegExp(origin, 'i');
    if (listingType) query.listingType = listingType;
    if (minCarat || maxCarat) {
      query.carat = {};
      if (minCarat) query.carat.$gte = parseFloat(minCarat);
      if (maxCarat) query.carat.$lte = parseFloat(maxCarat);
    }

    const gems = await Gem.find(query)
      .sort({ createdAt: -1 })
      .populate('seller', 'name rating');

    res.status(200).json({
      success: true,
      count: gems.length,
      data: gems
    });
  } catch (error) {
    console.error('Get all gems error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Update gem
// @route   PUT /api/gems/:id
// @access  Private
exports.updateGem = async (req, res) => {
  try {
    let gem = await Gem.findById(req.params.id);

    if (!gem) {
      return res.status(404).json({
        success: false,
        message: 'Gem not found'
      });
    }

    if (gem.seller.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this gem'
      });
    }

    gem = await Gem.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      message: 'Gem updated successfully',
      data: gem
    });
  } catch (error) {
    console.error('Update gem error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Delete gem
// @route   DELETE /api/gems/:id
// @access  Private
exports.deleteGem = async (req, res) => {
  try {
    const gem = await Gem.findById(req.params.id);

    if (!gem) {
      return res.status(404).json({
        success: false,
        message: 'Gem not found'
      });
    }

    if (gem.seller.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this gem'
      });
    }

    await gem.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Gem deleted successfully'
    });
  } catch (error) {
    console.error('Delete gem error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Add gem to watchlist
// @route   POST /api/gems/:id/watch
// @access  Private
exports.addToWatchlist = async (req, res) => {
  try {
    const gem = await Gem.findById(req.params.id);

    if (!gem) {
      return res.status(404).json({
        success: false,
        message: 'Gem not found'
      });
    }

    if (gem.watchers.includes(req.user.id)) {
      return res.status(400).json({
        success: false,
        message: 'Gem already in watchlist'
      });
    }

    gem.watchers.push(req.user.id);
    await gem.save();

    res.status(200).json({
      success: true,
      message: 'Gem added to watchlist'
    });
  } catch (error) {
    console.error('Add to watchlist error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Remove gem from watchlist
// @route   DELETE /api/gems/:id/watch
// @access  Private
exports.removeFromWatchlist = async (req, res) => {
  try {
    const gem = await Gem.findById(req.params.id);

    if (!gem) {
      return res.status(404).json({
        success: false,
        message: 'Gem not found'
      });
    }

    gem.watchers = gem.watchers.filter(
      watcher => watcher.toString() !== req.user.id
    );
    await gem.save();

    res.status(200).json({
      success: true,
      message: 'Gem removed from watchlist'
    });
  } catch (error) {
    console.error('Remove from watchlist error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};