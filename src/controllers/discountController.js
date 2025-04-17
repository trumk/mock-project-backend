import Discount from '../models/Discount.model.js'

const discountController = {
    createDiscount: async (req, res) => {
        try {
            const { code, description, discountType, value, maxDiscount, minOrderValue, startDate, endDate, usageLimit, usedCount, isActive } = req.body;
            if (!code) {
                return res.status(400).json({ message: "Code is required" });
            }
            if (!description) {
                return res.status(400).json({ message: "Description is required" });
            }
            if (!discountType) {
                return res.status(400).json({ message: "Discount type is required" });
            }
            if (discountType && !["percentage", "fixed"].includes(discountType)) {
                return res.status(400).json({ message: "Invalid discount type" });
            }
            if (value === undefined || value === null) {
                return res.status(400).json({ message: "Value is required" });
            }
            if (!startDate) {
                return res.status(400).json({ message: "Start date is required" });
            }
            if (!endDate) {
                return res.status(400).json({ message: "End date is required" });
            }
            if (startDate && endDate && new Date(endDate) < new Date(startDate)) {
                return res.status(400).json({ message: "End date must be after start date" });
            }

            const newDiscount = await new Discount({
                code,
                description,
                discountType,
                value,
                maxDiscount: maxDiscount || 0,
                minOrderValue: minOrderValue || 0,
                startDate,
                endDate,
                usageLimit: usageLimit || 0,
                usedCount: usedCount || 0,
                isActive: isActive !== undefined ? isActive : true,
            }).save();

            res.status(201).json(newDiscount);
        } catch (error) {
            return res.status(500).json(error);
        }
    },
    editDiscount: async (req, res) => {
        try {
            const { id } = req.params;
            const { code, description, discountType, value, maxDiscount, minOrderValue, startDate, endDate, usageLimit, usedCount, isActive } = req.body;

            const discount = await Discount.findById(id);
            if (!discount) {
                return res.status(404).json("Discount not found");
            }

            if (code !== undefined) {
                const existingCode = await Discount.findOne({ code, _id: { $ne: id } });
                if (existingCode) {
                    return res.status(400).json("Code already exists");
                }
            }

            if (!description) {
                return res.status(400).json({ message: "Description is required" });
            }
            if (!discountType) {
                return res.status(400).json({ message: "Discount type is required" });
            }
            if (discountType && !["percentage", "fixed"].includes(discountType)) {
                return res.status(400).json({ message: "Invalid discount type" });
            }
            if (value === undefined || value === null) {
                return res.status(400).json({ message: "Value is required" });
            }
            if (!startDate) {
                return res.status(400).json({ message: "Start date is required" });
            }
            if (!endDate) {
                return res.status(400).json({ message: "End date is required" });
            }
            if (startDate && endDate && new Date(endDate) < new Date(startDate)) {
                return res.status(400).json({ message: "End date must be after start date" });
            }
            const updatedDiscount = await Discount.findByIdAndUpdate(
                id,
                { code, description, discountType, value, maxDiscount, minOrderValue, startDate, endDate, usageLimit, usedCount, isActive },
                { new: true, runValidators: true }
            );
            res.status(200).json(updatedDiscount);
        } catch (error) {
            return res.status(500).json(error);
        }
    },

    getAllDiscount: async (req, res) => {
        try {
            const discounts = await Discount.find().sort({ createdAt: -1 });
            res.status(200).json(discounts);
        } catch (error) {
            return res.status(500).json(error);
        }
    },
    deleteDiscount: async (req, res) => {
        try {
            const { id } = req.params;
            const deletedDiscount = await Discount.findByIdAndDelete(id);
            if (!deletedDiscount) {
                return res.status(404).json("Discount not found");
            }
            return res.status(200).json(deletedDiscount);
        } catch (error) {
            return res.status(500).json(error);
        }
    }
}

export default discountController;
