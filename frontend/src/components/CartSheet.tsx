import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from './ui/sheet';
import { useCart } from './CartContext';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { X, Plus, Minus, ShoppingBag } from 'lucide-react';
import { toast } from 'sonner';

interface CartSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CartSheet({ open, onOpenChange }: CartSheetProps) {
  const { cartItems, removeFromCart, updateQuantity, clearCart, cartCount } = useCart();

  const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckout = () => {
    toast.success('주문이 완료되었습니다!');
    clearCart();
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5" />
            장바구니 ({cartCount})
          </SheetTitle>
          <SheetDescription>
            장바구니에 담긴 상품을 확인하고 주문할 수 있습니다
          </SheetDescription>
        </SheetHeader>

        <div className="mt-8 flex flex-col h-full">
          {cartItems.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <ShoppingBag className="w-12 h-12 text-gray-400" />
              </div>
              <p className="text-gray-500 mb-2">장바구니가 비어있습니다</p>
              <p className="text-sm text-gray-400">마음에 드는 상품을 담아보세요</p>
            </div>
          ) : (
            <>
              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto -mx-6 px-6 space-y-4">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4 p-4 bg-gray-50 rounded-2xl"
                  >
                    {/* Image */}
                    <div className="w-20 h-20 rounded-xl overflow-hidden bg-white flex-shrink-0">
                      <ImageWithFallback
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-gray-500 mb-1">{item.brand}</p>
                          <h4 className="text-sm text-primary truncate">{item.name}</h4>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="ml-2 p-1 hover:bg-white rounded-full transition-colors"
                        >
                          <X className="w-4 h-4 text-gray-400" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-6 h-6 rounded-full bg-white flex items-center justify-center hover:bg-gray-100 transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-sm w-8 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-6 h-6 rounded-full bg-white flex items-center justify-center hover:bg-gray-100 transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <p className="text-primary">{(item.price * item.quantity).toLocaleString()}원</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Summary */}
              <div className="border-t pt-6 mt-6 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">총 상품 금액</span>
                  <span className="text-primary">{totalPrice.toLocaleString()}원</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">배송비</span>
                  <span className="text-accent">무료</span>
                </div>
                <div className="border-t pt-4 flex justify-between items-center">
                  <span className="text-lg text-primary">총 결제 금액</span>
                  <span className="text-2xl text-primary">{totalPrice.toLocaleString()}원</span>
                </div>

                {/* Checkout Button */}
                <button
                  onClick={handleCheckout}
                  className="w-full bg-primary hover:bg-accent text-white py-4 rounded-full transition-all hover:shadow-lg text-center"
                >
                  주문하기
                </button>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
