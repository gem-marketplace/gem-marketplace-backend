const express = require('express');
const router = express.Router();
const multer = require('multer');
const {
  createGem,
  getMyGems,
  getGemById,
  getAllGems,
  updateGem,
  deleteGem,
  addToWatchlist,
  removeFromWatchlist
} = require('../controllers/gemController');
const { protect, authorize } = require('../middleware/auth');

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB
  }
});

// Public route - Get all approved gems
router.get('/approved', getAllGems);

// Protected route - Get MY gems (must be before /:id)
router.get('/my-gems', protect, authorize('seller', 'collector'), getMyGems);

// Public route - Get single gem by ID
router.get('/:id', getGemById);

// Protected route - Create new gem
router.post(
  '/',
  protect,
  authorize('seller', 'collector'),
  upload.fields([
    { name: 'images', maxCount: 10 },
    { name: 'certificates', maxCount: 5 }
  ]),
  createGem
);

// Protected routes - Update/Delete
router.put('/:id', protect, authorize('seller', 'collector', 'admin'), updateGem);
router.delete('/:id', protect, authorize('seller', 'collector', 'admin'), deleteGem);

// Watchlist routes
router.post('/:id/watch', protect, addToWatchlist);
router.delete('/:id/watch', protect, removeFromWatchlist);

module.exports = router;