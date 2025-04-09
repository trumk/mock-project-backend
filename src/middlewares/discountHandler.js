import Discount from '../models/Discount.model.js'

export const applyDiscount = async (order) => {
  if (!order.discountCode) return;

  const discount = await Discount.findOne({ code: order.discountCode, isActive: true });

  if (discount && discount.startDate <= Date.now() && discount.endDate >= Date.now()) {
    let discountValue = 0;
    if (discount.discountType === "percentage") {
      discountValue = (order.totalPrice * discount.value) / 100;
      if (discount.maxDiscount > 0 && discountValue > discount.maxDiscount) {
        discountValue = discount.maxDiscount;
      }
    } else {
      discountValue = discount.value;
    }

    if (order.totalPrice >= discount.minOrderValue && (!discount.usageLimit || discount.usedCount < discount.usageLimit)) {
      order.discountAmount = discountValue;
      discount.usedCount += 1;
      await discount.save();
    }
  }
};