"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  Heart, 
  ShoppingCart, 
  Star, 
  Eye, 
  Tag, 
  Users, 
  TrendingUp,
  Clock,
  MapPin,
  Truck,
  Download,
  Plus,
  Minus
} from "lucide-react"
import { useAuth } from "@/lib/auth"
import { useToast } from "@/hooks/use-toast"
import type { Product } from "@/types"

interface ProductCardProps {
  product: Product
  viewMode: "grid" | "list"
  onAddToCart: (productId: string) => void
  onLike: (productId: string) => void
  onProductClick?: (product: Product) => void
}

export function ProductCard({ product, viewMode, onAddToCart, onLike, onProductClick }: ProductCardProps) {
  const { user } = useAuth()
  const { toast } = useToast()
  const [isLiked, setIsLiked] = useState(false)
  const [quantity, setQuantity] = useState(1)

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation() // Prevenir que se abra el detalle cuando se hace like
    setIsLiked(!isLiked)
    onLike(product.id)
    toast({
      title: isLiked ? "Producto removido de favoritos" : "Producto agregado a favoritos",
      description: product.title,
    })
  }

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation() // Prevenir que se abra el detalle cuando se agrega al carrito
    onAddToCart(product.id)
    toast({
      title: "Producto agregado al carrito",
      description: `${product.title} (${quantity})`,
    })
  }

  const handleProductClick = () => {
    onProductClick?.(product)
  }

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: currency,
    }).format(price)
  }

  if (viewMode === "list") {
    return (
      <Card className="border-border/50 bg-background/95 backdrop-blur-sm hover:shadow-lg transition-all duration-300 cursor-pointer" onClick={handleProductClick}>
        <CardContent className="p-4">
          <div className="flex items-start gap-4">
            {/* Product Image - Fixed size */}
            <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-lg overflow-hidden bg-muted flex-shrink-0">
              <img 
                src={product.images[0] || "/placeholder.svg"} 
                alt={product.title}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
              
              {/* Badges */}
              <div className="absolute top-1 left-1 flex flex-col gap-1">
                {product.isDigital && (
                  <Badge className="bg-blue-500 text-xs">
                    <Download className="w-2 h-2 sm:w-3 sm:h-3 mr-1" />
                    Digital
                  </Badge>
                )}
                {product.shippingInfo?.freeShipping && (
                  <Badge className="bg-green-500 text-xs">
                    <Truck className="w-2 h-2 sm:w-3 sm:h-3 mr-1" />
                    Gratis
                  </Badge>
                )}
              </div>
            </div>

            {/* Product Info - Flex to fill remaining space */}
            <div className="flex-1 min-w-0 flex flex-col justify-between h-24 sm:h-32">
              <div className="flex-1">
                <div className="flex items-start justify-between mb-1">
                  <div className="flex-1 min-w-0 pr-2">
                    <h3 className="font-semibold text-base sm:text-lg line-clamp-2 leading-tight">{product.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-1 hidden sm:block">
                      {product.description}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleLike}
                    className={`flex-shrink-0 rounded-full h-8 w-8 p-0 ${
                      isLiked ? "text-red-500" : "text-muted-foreground"
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`} />
                  </Button>
                </div>

                {/* Seller Info */}
                <div className="flex items-center gap-2 mb-2">
                  <Avatar className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0">
                    <AvatarImage src={product.seller.avatar} />
                    <AvatarFallback className="text-xs">
                      {product.seller.username.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-xs sm:text-sm text-muted-foreground truncate">
                    {product.seller.username}
                  </span>
                  {product.space && (
                    <>
                      <span className="text-muted-foreground text-xs hidden sm:inline">•</span>
                      <span className="text-xs text-muted-foreground truncate hidden sm:inline">
                        {product.space.name}
                      </span>
                    </>
                  )}
                </div>

                {/* Stats */}
                <div className="flex items-center gap-3 text-xs sm:text-sm mb-2">
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 text-yellow-500 fill-current" />
                    <span className="font-medium">{product.rating}</span>
                    <span className="text-muted-foreground">({product.reviewCount})</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye className="w-3 h-3 text-muted-foreground" />
                    <span className="text-muted-foreground">{product.views}</span>
                  </div>
                  <div className="items-center gap-1 hidden sm:flex">
                    <TrendingUp className="w-3 h-3 text-muted-foreground" />
                    <span className="text-muted-foreground">{product.sales}</span>
                  </div>
                </div>

                {/* Tags - Hidden on mobile to save space */}
                <div className="hidden sm:flex flex-wrap gap-1 mb-2">
                  {product.tags.slice(0, 3).map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {product.tags.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{product.tags.length - 3}
                    </Badge>
                  )}
                </div>
              </div>

              {/* Price and Actions - Always at bottom */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-lg sm:text-xl font-bold text-primary">
                    {formatPrice(product.price, product.currency)}
                  </span>
                  {product.stock > 0 ? (
                    <Badge variant="outline" className="text-green-600 text-xs">
                      Stock: {product.stock}
                    </Badge>
                  ) : (
                    <Badge variant="destructive" className="text-xs">
                      Agotado
                    </Badge>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {/* Quantity selector for desktop only */}
                  <div className="hidden sm:flex items-center border rounded-md">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        setQuantity(Math.max(1, quantity - 1))
                      }}
                      disabled={quantity <= 1}
                      className="h-7 w-7 p-0"
                    >
                      <Minus className="w-3 h-3" />
                    </Button>
                    <span className="px-2 text-sm min-w-[2rem] text-center">{quantity}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        setQuantity(quantity + 1)
                      }}
                      disabled={quantity >= product.stock}
                      className="h-7 w-7 p-0"
                    >
                      <Plus className="w-3 h-3" />
                    </Button>
                  </div>
                  
                  <Button
                    onClick={handleAddToCart}
                    disabled={product.stock === 0}
                    size="sm"
                    className="bg-primary hover:bg-primary/90"
                  >
                    <ShoppingCart className="w-4 h-4 sm:mr-2" />
                    <span className="hidden sm:inline">Agregar</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Grid View
  return (
    <Card className="border-border/50 bg-background/95 backdrop-blur-sm hover:shadow-lg transition-all duration-300 group h-full flex flex-col cursor-pointer" onClick={handleProductClick}>
      <CardContent className="p-4 flex flex-col h-full">
        {/* Product Image */}
        <div className="relative aspect-square rounded-lg overflow-hidden bg-muted mb-4 flex-shrink-0">
          <img 
            src={product.images[0] || "/placeholder.svg"} 
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          
          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {product.isDigital && (
              <Badge className="bg-blue-500 text-xs">
                <Download className="w-3 h-3 mr-1" />
                Digital
              </Badge>
            )}
          </div>
          
          <div className="absolute top-2 right-2 flex flex-col gap-1 items-end">
            {product.shippingInfo?.freeShipping && (
              <Badge className="bg-green-500 text-xs">
                <Truck className="w-3 h-3 mr-1" />
                Gratis
              </Badge>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLike}
              className={`bg-background/90 hover:bg-background rounded-full h-8 w-8 p-0 ${
                isLiked ? "text-red-500" : "text-muted-foreground"
              }`}
            >
              <Heart className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`} />
            </Button>
          </div>
        </div>

        {/* Product Info - Flex-grow to fill remaining space */}
        <div className="flex flex-col flex-1 gap-3">
          {/* Title and Description - Fixed height */}
          <div className="min-h-[3.5rem]">
            <h3 className="font-semibold text-base line-clamp-2 mb-1 leading-tight">{product.title}</h3>
            <p className="text-sm text-muted-foreground line-clamp-1 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Seller Info - Fixed height */}
          <div className="flex items-center gap-2 min-h-[1.5rem]">
            <Avatar className="w-5 h-5 flex-shrink-0">
              <AvatarImage src={product.seller.avatar} />
              <AvatarFallback className="text-xs">
                {product.seller.username.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm text-muted-foreground truncate">
              {product.seller.username}
            </span>
            {product.space && (
              <>
                <span className="text-muted-foreground text-xs">•</span>
                <span className="text-xs text-muted-foreground truncate">
                  {product.space.name}
                </span>
              </>
            )}
          </div>

          {/* Stats - Fixed height */}
          <div className="flex items-center justify-between min-h-[1.25rem]">
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 text-yellow-500 fill-current" />
              <span className="text-sm font-medium">{product.rating}</span>
              <span className="text-xs text-muted-foreground">({product.reviewCount})</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <Eye className="w-3 h-3 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">{product.views}</span>
              </div>
              <div className="flex items-center gap-1">
                <TrendingUp className="w-3 h-3 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">{product.sales}</span>
              </div>
            </div>
          </div>

          {/* Tags - Fixed height */}
          <div className="flex flex-wrap gap-1 min-h-[1.5rem] items-start">
            {product.tags.slice(0, 2).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
            {product.tags.length > 2 && (
              <Badge variant="outline" className="text-xs">
                +{product.tags.length - 2}
              </Badge>
            )}
          </div>

          {/* Price and Actions - Push to bottom */}
          <div className="mt-auto space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold text-primary truncate">
                {formatPrice(product.price, product.currency)}
              </span>
              {product.stock > 0 ? (
                <Badge variant="outline" className="text-green-600 text-xs flex-shrink-0">
                  Stock: {product.stock}
                </Badge>
              ) : (
                <Badge variant="destructive" className="text-xs flex-shrink-0">
                  Agotado
                </Badge>
              )}
            </div>

            <Button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="w-full bg-primary hover:bg-primary/90 h-9 text-sm"
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              Agregar
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
