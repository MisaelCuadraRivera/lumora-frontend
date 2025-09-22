"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Heart, 
  ShoppingCart, 
  Star, 
  Eye, 
  TrendingUp,
  MapPin,
  Truck,
  Download,
  Plus,
  Minus,
  Share,
  MessageCircle,
  Calendar,
  Package,
  Shield,
  ChevronLeft,
  ChevronRight,
  X
} from "lucide-react"
import { useAuth } from "@/lib/auth"
import { useToast } from "@/hooks/use-toast"
import type { Product } from "@/types"

interface ProductDetailModalProps {
  product: Product | null
  isOpen: boolean
  onClose: () => void
  onAddToCart: (productId: string, quantity: number) => void
  onLike: (productId: string) => void
}

export function ProductDetailModal({ 
  product, 
  isOpen, 
  onClose, 
  onAddToCart, 
  onLike 
}: ProductDetailModalProps) {
  const { user } = useAuth()
  const { toast } = useToast()
  const [isLiked, setIsLiked] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)

  if (!product) return null

  const handleLike = () => {
    setIsLiked(!isLiked)
    onLike(product.id)
    toast({
      title: isLiked ? "Removido de favoritos" : "Agregado a favoritos",
      description: product.title,
    })
  }

  const handleAddToCart = () => {
    onAddToCart(product.id, quantity)
    toast({
      title: "Agregado al carrito",
      description: `${product.title} (${quantity})`,
    })
  }

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: currency,
    }).format(price)
  }

  const nextImage = () => {
    setSelectedImageIndex((prev) => 
      prev === product.images.length - 1 ? 0 : prev + 1
    )
  }

  const prevImage = () => {
    setSelectedImageIndex((prev) => 
      prev === 0 ? product.images.length - 1 : prev - 1
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="max-w-7xl w-[95vw] max-h-[95vh] overflow-hidden p-0 sm:max-w-7xl" 
        showCloseButton={false}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 h-full min-h-[700px]">
          {/* Image Gallery */}
          <div className="relative bg-muted md:col-span-2 lg:col-span-3">
            <div className="relative h-64 md:h-full min-h-[400px] md:min-h-[600px]">
              <AnimatePresence mode="wait">
                <motion.img
                  key={selectedImageIndex}
                  src={product.images[selectedImageIndex] || "/placeholder.svg"}
                  alt={product.title}
                  className="absolute inset-0 w-full h-full object-cover"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                />
              </AnimatePresence>

              {/* Navigation arrows */}
              {product.images.length > 1 && (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={prevImage}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-background/90 hover:bg-background backdrop-blur-sm rounded-full h-10 w-10 p-0 shadow-lg border"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={nextImage}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-background/90 hover:bg-background backdrop-blur-sm rounded-full h-10 w-10 p-0 shadow-lg border"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </>
              )}

              {/* Image indicators */}
              {product.images.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {product.images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        index === selectedImageIndex
                          ? "bg-white scale-125"
                          : "bg-white/50 hover:bg-white/75"
                      }`}
                    />
                  ))}
                </div>
              )}

              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {product.isDigital && (
                  <Badge className="bg-blue-500">
                    <Download className="w-3 h-3 mr-1" />
                    Digital
                  </Badge>
                )}
                {product.shippingInfo?.freeShipping && (
                  <Badge className="bg-green-500">
                    <Truck className="w-3 h-3 mr-1" />
                    Envío gratis
                  </Badge>
                )}
              </div>

              {/* Close button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="absolute top-4 right-4 bg-background/90 hover:bg-background backdrop-blur-sm rounded-full h-10 w-10 p-0 shadow-lg border lg:hidden"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Product Details */}
          <div className="flex flex-col h-full md:col-span-1 lg:col-span-2">
            <DialogHeader className="p-6 pb-4 border-b">
              <div className="flex items-start justify-between">
                <div className="flex-1 pr-4">
                  <DialogTitle className="text-2xl lg:text-3xl font-bold leading-tight mb-2">
                    {product.title}
                  </DialogTitle>
                  {/* Seller Info */}
                  <div className="flex items-center gap-3 mt-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={product.seller.avatar} />
                      <AvatarFallback>
                        {product.seller.username.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-sm">{product.seller.username}</p>
                      {product.space && (
                        <p className="text-xs text-muted-foreground">{product.space.name}</p>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleLike}
                    className={`rounded-full h-9 w-9 p-0 ${
                      isLiked ? "text-red-500 bg-red-50 dark:bg-red-950" : "text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="rounded-full h-9 w-9 p-0 text-muted-foreground hover:text-foreground hover:bg-muted"
                  >
                    <Share className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onClose}
                    className="rounded-full h-9 w-9 p-0 text-muted-foreground hover:text-foreground hover:bg-muted hidden lg:flex"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Price and Stats Section */}
              <div className="mt-4 space-y-4">
                {/* Price and Stock */}
                <div className="flex items-center justify-between">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-primary">
                      {formatPrice(product.price, product.currency)}
                    </span>
                  </div>
                  {product.stock > 0 ? (
                    <Badge variant="outline" className="text-green-600 border-green-600 text-sm px-3 py-1">
                      <Package className="w-3 h-3 mr-1" />
                      Stock: {product.stock}
                    </Badge>
                  ) : (
                    <Badge variant="destructive" className="text-sm px-3 py-1">Agotado</Badge>
                  )}
                </div>

                {/* Rating and Stats */}
                <div className="flex items-center gap-6 text-sm">
                  <div className="flex items-center gap-1">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-4 h-4 ${
                            i < Math.floor(product.rating) 
                              ? "text-yellow-500 fill-current" 
                              : "text-gray-300"
                          }`} 
                        />
                      ))}
                    </div>
                    <span className="font-medium text-base">{product.rating}</span>
                    <span className="text-muted-foreground">
                      ({product.reviewCount})
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Eye className="w-4 h-4" />
                    <span>{product.views}</span>
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <TrendingUp className="w-4 h-4" />
                    <span>{product.sales} vendidos</span>
                  </div>
                </div>
              </div>
            </DialogHeader>

            {/* Main Actions - Always visible */}
            <div className="px-6 py-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <div className="space-y-3">
                {/* Quantity Selector */}
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">Cantidad:</span>
                  <div className="flex items-center border rounded-lg bg-background">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                      className="h-9 w-9 p-0"
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <span className="px-4 py-2 text-sm font-medium min-w-[3rem] text-center border-x">
                      {quantity}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      disabled={quantity >= product.stock}
                      className="h-9 w-9 p-0"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Primary Action Button */}
                <Button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className="w-full bg-primary hover:bg-primary/90 h-11 text-base font-medium"
                  size="lg"
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  {product.stock === 0 ? 'Producto Agotado' : `Agregar ${formatPrice(product.price * quantity, product.currency)}`}
                </Button>
              </div>
            </div>

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto px-6 py-4 scroll-smooth scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
              <div className="space-y-6 pb-2">
                {/* Quick Info Cards */}
                <div className="grid grid-cols-2 gap-3">
                  {product.isDigital && (
                    <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-3 text-center">
                      <Download className="w-5 h-5 text-blue-600 dark:text-blue-400 mx-auto mb-1" />
                      <span className="text-xs font-medium text-blue-700 dark:text-blue-300">Descarga Digital</span>
                    </div>
                  )}
                  {product.shippingInfo?.freeShipping && (
                    <div className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg p-3 text-center">
                      <Truck className="w-5 h-5 text-green-600 dark:text-green-400 mx-auto mb-1" />
                      <span className="text-xs font-medium text-green-700 dark:text-green-300">Envío Gratis</span>
                    </div>
                  )}
                </div>

                {/* Product Description */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <MessageCircle className="w-5 h-5 text-primary" />
                    Descripción del Producto
                  </h3>
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                      {product.description}
                    </p>
                  </div>
                </div>

                {/* Tags */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-lg">Categorías y Etiquetas</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs px-3 py-1 bg-blue-100 text-blue-700 hover:bg-blue-200">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Shipping Info */}
                {product.shippingInfo && (
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <Truck className="w-5 h-5 text-primary" />
                      Información de Envío
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4 text-green-600 dark:text-green-400" />
                        <span className="text-gray-700 dark:text-gray-300">
                          {product.shippingInfo.freeShipping 
                            ? "Envío gratis disponible" 
                            : "Métodos de envío disponibles"
                          }
                        </span>
                      </div>
                      {product.shippingInfo.shippingMethods && product.shippingInfo.shippingMethods.length > 0 && (
                        <div className="space-y-2 ml-6 mt-3">
                          {product.shippingInfo.shippingMethods.slice(0, 3).map((method) => (
                            <div key={method.id} className="flex justify-between items-center bg-white dark:bg-gray-700 rounded-md p-2 border dark:border-gray-600">
                              <span className="font-medium text-gray-700 dark:text-gray-300">{method.name}</span>
                              <div className="text-right">
                                <div className="font-medium text-primary">{formatPrice(method.price, product.currency)}</div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">{method.estimatedDays} días</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Secondary Actions */}
            <div className="px-6 py-4 border-t bg-muted/30">
              <div className="space-y-3">
                {/* Secondary Actions */}
                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" className="h-10" size="sm">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Contactar
                  </Button>
                  <Button variant="outline" className="h-10" size="sm">
                    <Package className="w-4 h-4 mr-2" />
                    Comprar Ya
                  </Button>
                </div>

                {/* Security Badge */}
                <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground pt-1">
                  <Shield className="w-3 h-3" />
                  <span>Compra segura y protegida</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}