import Order from '../models/Order.model.js'

const orderController = {
    createOrder: async (req, res) => {
        try {
            const user = req.user.id;
            const { items, discountCode, shippingAddress, totalPrice, finalPrice } = req.body;
            if (!items || items.length === 0) {
                return res.status(400).json({
                    success: false,
                    message: 'items is required.'
                });
            }

            if (!shippingAddress) {
                return res.status(400).json({
                    success: false,
                    message: 'Shipping address is required.',
                });
            }

            for (const item of items) {
                if (!item.book || !item.quantity || !item.price) {
                    return res.status(400).json({
                        success: false,
                        message: 'Each item must have book, quantity, and price.',
                    });
                }
                if (item.quantity < 1) {
                    return res.status(400).json({
                        success: false,
                        message: 'Quantity must be at least 1.',
                    });
                }
                if (item.price < 0) {
                    return res.status(400).json({
                        success: false,
                        message: 'Price must be non-negative.',
                    });
                }
            }
            const discountAmount = totalPrice - finalPrice;

            const order = await new Order({
                user,
                items,
                totalPrice,
                discountCode,
                shippingAddress,
                finalPrice,
                discountAmount
            }).save();
            return res.status(201).json(order);
        } catch (error) {
            return res.status(500).json(error);
        }
    },
    getOrder: async (req, res) => {
        try {
            const id = req.user.id;
            const orders = await Order.find({ user: id })
            if (!orders) {
                return res.status(404).json({
                    message: 'You do not have an order yet.',
                });
            }
            return res.status(200).json(orders)
        } catch (error) {
            return res.status(500).json(error);
        }
    },
    getAllOrder: async (req, res) => {
        try {
            const orders = await Order.find();
            if (!orders) {
                return res.status(404).json({
                    message: 'You do not have an order yet.',
                });
            }
            return res.status(200).json(orders)
        } catch (error) {
            return res.status(500).json(error);
        }
    },
    getOrderDetail: async (req, res) => {
        try {
            const { id } = req.params;
            const order = await Order.findById(id).populate({
                path: 'items.book',
                select: 'name image',
            }).populate({
                path: 'user',
                select: 'fullName',
            });
            if (!order) {
                return res.status(404).json({
                    message: 'Order not found.',
                });
            }

            return res.status(200).json(order);
        } catch (error) {
            return res.status(500).json(error);
        }
    },
    cancelOrder: async (req, res) => {
        try {
            const id = req.params.id;
            const user = req.user.id;
            const role = req.user.role;
            const order = await Order.findById(id)
            if (!order) {
                return res.status(404).json({
                    message: 'You do not have an order yet.',
                });
            }
            if (user !== order.user && role !== "admin") {
                return res.status(403).json({
                    message: 'You do not have permission.',
                });
            }

            const cancelledOrder = await Order.findByIdAndUpdate(id, { status: "cancelled" }, { new: true, runValidators: true })
            return res.status(200).json(cancelledOrder)
        } catch (error) {
            return res.status(500).json(error);
        }
    }
}

export default orderController;
