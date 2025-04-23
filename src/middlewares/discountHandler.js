import Discount from '../models/Discount.model.js'

export const applyDiscount = async (order) => {
  if (!order.discountCode) return;
  const discount = await Discount.findOne({ code: order.discountCode, isActive: true });
  if (discount && discount.startDate <= Date.now() && discount.endDate >= Date.now()) {
    if (order.totalPrice >= discount.minOrderValue && (!discount.usageLimit || discount.usedCount < discount.usageLimit)) {
      order.discountAmount = discountValue;
      discount.usedCount += 1;
      await discount.save();
    }
  }
};
