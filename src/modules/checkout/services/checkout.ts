import { DatabaseTransactionBase } from "@/modules/database/database-transaction-basemodel";
import { GiftRepository } from "@/modules/gift/repository/gift.repository";
import { OrderRepository } from "@/modules/order/repository/order.repository";
import { OrderItemRepository } from "@/modules/order/repository/order-item.repository";
import { PaymentRepository } from "@/modules/payments/repository/payment.repository";
import { paymentService } from "@/modules/payments/service/payment.service";
import { ProductRepository } from "@/modules/products/repository/product.repository";
import { SimRepository } from "@/modules/sim/repository/sim.repository";
import { payload } from "@/shared/payload/utils/payload";
import { CheckoutService } from "../services/checkout.service";

const orderItemRepository = new OrderItemRepository(payload);
const paymentRepository = new PaymentRepository(payload);
const orderRepository = new OrderRepository(payload);
const simRepository = new SimRepository(payload);
const productRepository = new ProductRepository(payload);
const giftRepository = new GiftRepository(payload);
const databaseTransactionBase = new DatabaseTransactionBase(payload.db);

export const checkoutService = new CheckoutService({
  databaseTransactionBase,
  giftRepository,
  orderItemRepository,
  orderRepository,
  paymentRepository,
  paymentService,
  productRepository,
  simRepository,
});
