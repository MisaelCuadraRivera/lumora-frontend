"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { 
  X, 
  ShoppingCart, 
  Trash2, 
  Plus, 
  Minus, 
  CreditCard,
  Truck,
  ArrowRight,
  Sparkles
} from "lucide-react"
import { useAuth } from "@/lib/auth"
import { useToast } from "@/hooks/use-toast"
import { mockCart } from "@/data"

interface CartSidebarProps {
  isOpen: boolean
  onClose: () => void
}

export function CartSidebar({ isOpen, onClose }: CartSidebarProps) {
  const { user } = useAuth()
  const { toast } = useToast()
  const [cart] = useState(mockCart)
  const [promoCode, setPromoCode] = useState("")

  const handleRemoveItem = (itemId: string) => {
    // Aquí iría la lógica para remover del carrito
    toast({
      title: "Producto removido",
      description: "El producto ha sido removido del carrito",
    })
  }

  const handleUpdateQuantity = (itemId: string, newQuantity: number) => {
    // Aquí iría la lógica para actualizar cantidad
    console.log("Updating quantity:", itemId, newQuantity)
  }

  const handleCheckout = () => {
    // Aquí iría la lógica para checkout
    toast({
      title: "Procesando compra",
      description: "Redirigiendo al checkout...",
    })
  }

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: currency,
    }).format(price)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40"
            onClick={onClose}
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-96 bg-background border-l border-border z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5" />
                <h2 className="text-lg font-semibold">Carrito</h2>
                {cart.items.length > 0 && (
                  <Badge variant="secondary">{cart.totalItems}</Badge>
                )}
              </div>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-4">
              {cart.items.length === 0 ? (
                <div className="text-center py-12">
                  <Sparkles className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Tu carrito está vacío</h3>
                  <p className="text-muted-foreground mb-4">
                    Agrega algunos productos para comenzar
                  </p>
                  <Button onClick={onClose}>
                    Continuar comprando
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.items.map((item) => (
                    <Card key={item.id} className="border-border/50 bg-card/50 backdrop-blur-sm">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          {/* Product Image */}
                          <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted">
                            <img 
                              src={item.product.images[0] || "/placeholder.svg"} 
                              alt={item.product.title}
                              className="w-full h-full object-cover"
                            />
                          </div>

                          {/* Product Info */}
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-sm line-clamp-2 mb-1">
                              {item.product.title}
                            </h4>
                            <p className="text-sm text-muted-foreground mb-2">
                              {formatPrice(item.price, item.product.currency)}
                            </p>

                            {/* Quantity Controls */}
                            <div className="flex items-center gap-2">
                              <div className="flex items-center border rounded-md">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                                  disabled={item.quantity <= 1}
                                >
                                  <Minus className="w-3 h-3" />
                                </Button>
                                <span className="px-2 text-sm w-8 text-center">{item.quantity}</span>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                                  disabled={item.quantity >= item.product.stock}
                                >
                                  <Plus className="w-3 h-3" />
                                </Button>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRemoveItem(item.id)}
                                className="text-red-500 hover:text-red-600"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>

                          {/* Total */}
                          <div className="text-right">
                            <p className="font-semibold text-sm">
                              {formatPrice(item.price * item.quantity, item.product.currency)}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {cart.items.length > 0 && (
              <div className="border-t border-border p-4 space-y-4">
                {/* Promo Code */}
                <div className="flex gap-2">
                  <Input
                    placeholder="Código promocional"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className="flex-1"
                  />
                  <Button variant="outline" size="sm">
                    Aplicar
                  </Button>
                </div>

                {/* Summary */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>{formatPrice(cart.subtotal, cart.currency)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Envío</span>
                    <span>{formatPrice(cart.shipping, cart.currency)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Impuestos</span>
                    <span>{formatPrice(cart.tax, cart.currency)}</span>
                  </div>
                  <div className="border-t pt-2">
                    <div className="flex justify-between font-semibold">
                      <span>Total</span>
                      <span>{formatPrice(cart.total, cart.currency)}</span>
                    </div>
                  </div>
                </div>

                {/* Checkout Button */}
                <Button 
                  onClick={handleCheckout}
                  className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
                >
                  <CreditCard className="w-4 h-4 mr-2" />
                  Proceder al pago
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>

                {/* Shipping Info */}
                <div className="text-center text-xs text-muted-foreground">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Truck className="w-3 h-3" />
                    Envío gratis en pedidos superiores a $50
                  </div>
                  <p>Entrega estimada: 3-5 días hábiles</p>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
