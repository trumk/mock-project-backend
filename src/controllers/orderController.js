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
                if (!item.id || !item.quantity || !item.price) {
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
                .populate({
                    path: 'items.id',
                    select: 'name image',
                }).populate({
                    path: 'user',
                    select: 'fullName',
                })
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
            const orders = await Order.find()
                .populate({
                    path: 'items.id',
                    select: 'name image',
                }).populate({
                    path: 'user',
                    select: 'fullName',
                });
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
                path: 'items.id',
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

            if (req.user.role !== "admin" && req.user.id !== order.user.toString()) {
                return res.status(403).json({
                    success: false,
                    message: "You do not have permission to view this order.",
                });
            }

            return res.status(200).json(order);
        } catch (error) {
            return res.status(500).json(error);
        }
    },

    requestCancelOrder: async (req, res) => {
        try {
            const { id } = req.params;
            const userId = req.user.id;

            const order = await Order.findById(id);
            if (!order) {
                return res.status(404).json({
                    success: false,
                    message: "Order not found.",
                });
            }

            if (order.user.toString() !== userId) {
                return res.status(403).json({
                    success: false,
                    message: "You do not have permission to request cancellation of this order.",
                });
            }

            // Only allow cancellation request for pending or processing orders
            if (!["pending", "processing"].includes(order.status)) {
                return res.status(400).json({
                    success: false,
                    message: "Cannot request cancellation for this order status.",
                });
            }

            const updatedOrder = await Order.findByIdAndUpdate(
                id,
                { status: "cancel_requested" },
                { new: true, runValidators: true }
            );

            return res.status(200).json({
                success: true,
                message: "Cancellation request submitted.",
                order: updatedOrder,
            });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    },

    handleCancelRequest: async (req, res) => {
        try {
            const { id } = req.params;
            const { approve } = req.body; 

            if (req.user.role !== "admin") {
                return res.status(403).json({
                    success: false,
                    message: "Only admins can handle cancellation requests.",
                });
            }

            const order = await Order.findById(id);
            if (!order) {
                return res.status(404).json({
                    success: false,
                    message: "Order not found.",
                });
            }

            if (order.status !== "cancel_requested") {
                return res.status(400).json({
                    success: false,
                    message: "This order does not have a pending cancellation request.",
                });
            }

            const newStatus = approve ? "cancelled" : "processing"; 
            const updatedOrder = await Order.findByIdAndUpdate(
                id,
                { status: newStatus },
                { new: true, runValidators: true }
            );

            return res.status(200).json({
                success: true,
                message: approve
                    ? "Đơn hàng hủy thành công."
                    : "Đơn hàng bị từ chối hủy.",
                order: updatedOrder,
            });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    },

    updateOrderStatus: async (req, res) => {
        try {
            const { id } = req.params;
            const { status } = req.body;

            if (req.user.role !== "admin") {
                return res.status(403).json({
                    success: false,
                    message: "Only admins can update order status.",
                });
            }

            const validStatuses = [
                "pending",
                "processing",
                "shipped",
                "delivered",
                "cancelled",
                "cancel_requested",
            ];
            if (!validStatuses.includes(status)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid status.",
                });
            }

            const order = await Order.findById(id);
            if (!order) {
                return res.status(404).json({
                    success: false,
                    message: "Order not found.",
                });
            }

            const validTransitions = {
                pending: ["processing", "cancel_requested"],
                processing: ["shipped", "cancel_requested"],
                shipped: ["delivered"],
                delivered: [],
                cancel_requested: ["processing", "cancelled"],
                cancelled: [],
            };

            if (!validTransitions[order.status].includes(status)) {
                return res.status(400).json({
                    success: false,
                    message: `Không thể đổi trạng thái từ ${order.status} đến ${status}.`,
                });
            }

            const updatedOrder = await Order.findByIdAndUpdate(
                id,
                { status },
                { new: true, runValidators: true }
            )
                .populate({
                    path: "items.id",
                    select: "name image",
                })
                .populate({
                    path: "user",
                    select: "fullName",
                });

            return res.status(200).json({
                success: true,
                message: `Đơn hàng đã được chuyển sang trạng thái ${status}.`,
                order: updatedOrder,
            });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    },


    // cancelOrder: async (req, res) => {
    //     try {
    //         const id = req.params.id;
    //         const user = req.user.id;
    //         const role = req.user.role;
    //         const order = await Order.findById(id)
    //         if (!order) {
    //             return res.status(404).json({
    //                 message: 'You do not have an order yet.',
    //             });
    //         }
    //         if (user !== order.user && role !== "admin") {
    //             return res.status(403).json({
    //                 message: 'You do not have permission.',
    //             });
    //         }

    //         const cancelledOrder = await Order.findByIdAndUpdate(id, { status: "cancelled" }, { new: true, runValidators: true })
    //         return res.status(200).json(cancelledOrder)
    //     } catch (error) {
    //         return res.status(500).json(error);
    //     }
    // }
}

export default orderController;