import cartModel from '../models/cartModel.js';
import productModel from '../models/productModel.js';

// ✅ Get user cart - req.userId from auth middleware
const getUserCart = async (req, res) => {
    try {
        const userId = req.userId; // From auth middleware
        
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'User not authenticated'
            });
        }

        // ✅ Find or create cart
        let cart = await cartModel.findOne({ userId });
        if (!cart) {
            cart = new cartModel({ userId, items: {} });
            await cart.save();
        }

        res.status(200).json({
            success: true,
            cartData: cart.items || {}
        });

    } catch (error) {
        console.error('Error in getUserCart:', error.message);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to get cart'
        });
    }
};

// ✅ Add to cart
const addToCart = async (req, res) => {
    try {
        const userId = req.userId; // From auth middleware
        const { itemId, size } = req.body;

        if (!itemId || !size) {
            return res.status(400).json({
                success: false,
                message: 'Item ID and size required'
            });
        }

        // Check if product exists
        const product = await productModel.findById(itemId);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        let cart = await cartModel.findOne({ userId });
        if (!cart) {
            cart = new cartModel({ userId, items: {} });
        }

        // Update cart
        if (!cart.items.get(itemId)) {
            cart.items.set(itemId, {});
        }
        const itemSizes = cart.items.get(itemId);
        if (itemSizes[size]) {
            itemSizes[size] += 1;
        } else {
            itemSizes[size] = 1;
        }
        cart.items.set(itemId, itemSizes);

        await cart.save();

        res.status(200).json({
            success: true,
            message: 'Added to cart',
            cartData: cart.items
        });

    } catch (error) {
        console.error('Error in addToCart:', error.message);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to add to cart'
        });
    }
};

// ✅ Update cart
const updateCart = async (req, res) => {
    try {
        const userId = req.userId; // From auth middleware
        const { itemId, size, quantity } = req.body;

        if (!itemId || !size || quantity === undefined) {
            return res.status(400).json({
                success: false,
                message: 'Item ID, size and quantity required'
            });
        }

        let cart = await cartModel.findOne({ userId });
        if (!cart) {
            return res.status(404).json({
                success: false,
                message: 'Cart not found'
            });
        }

        // Update or remove item
        if (!cart.items.get(itemId) || !cart.items.get(itemId)[size]) {
            return res.status(404).json({
                success: false,
                message: 'Item not in cart'
            });
        }

        if (quantity <= 0) {
            const itemSizes = cart.items.get(itemId);
            delete itemSizes[size];
            if (Object.keys(itemSizes).length === 0) {
                cart.items.delete(itemId);
            } else {
                cart.items.set(itemId, itemSizes);
            }
        } else {
            const itemSizes = cart.items.get(itemId);
            itemSizes[size] = quantity;
            cart.items.set(itemId, itemSizes);
        }

        await cart.save();

        res.status(200).json({
            success: true,
            message: 'Cart updated',
            cartData: cart.items
        });

    } catch (error) {
        console.error('Error in updateCart:', error.message);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to update cart'
        });
    }
};

export { getUserCart, addToCart, updateCart };