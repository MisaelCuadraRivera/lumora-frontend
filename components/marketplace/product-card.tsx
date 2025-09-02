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
}

export function ProductCard({ product, viewMode, onAddToCart, onLike }: ProductCardProps) {
  const { user } = useAuth()
  const { toast } = useToast()
  const [isLiked, setIsLiked] = useState(false)
  const [quantity, setQuantity] = useState(1)

  const handleLike = () => {
    setIsLiked(!isLiked)
    onLike(product.id)
    toast({
      title: isLiked ? "Producto removido de favoritos" : "Producto agregado a favoritos",
      description: product.title,
    })
  }

  const handleAddToCart = () => {
    onAddToCart(product.id)
    toast({
      title: "Producto agregado al carrito",
      description: `${product.title} (${quantity})`,
    })
  }

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: currency,
    }).format(price)
  }

  if (viewMode === "list") {
    return (
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all">
        <CardContent className="p-4">
          <div className="flex items-start gap-4">
            {/* Product Image */}
            <div className="relative w-32 h-32 rounded-lg overflow-hidden bg-muted">
              <img 
                src={product.images[0] || "/placeholder.svg"} 
                alt={product.title}
                className="w-full h-full object-cover"
              />
              {product.isDigital && (
                <Badge className="absolute top-2 left-2 bg-blue-500">
                  <Download className="w-3 h-3 mr-1" />
                  Digital
                </Badge>
              )}
              {product.shippingInfo?.freeShipping && (
                <Badge className="absolute top-2 right-2 bg-green-500">
                  <Truck className="w-3 h-3 mr-1" />
                  Envío gratis
                </Badge>
              )}
            </div>

            {/* Product Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-lg truncate">{product.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                    {product.description}
                  </p>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleLike}
                    className={isLiked ? "text-red-500" : ""}
                  >
                    <Heart className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`} />
                  </Button>
                </div>
              </div>

              {/* Seller Info */}
              <div className="flex items-center gap-2 mb-3">
                <Avatar className="w-6 h-6">
                  <AvatarImage src={product.seller.avatar} />
                  <AvatarFallback className="text-xs">
                    {product.seller.username.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm text-muted-foreground">
                  {product.seller.username}
                </span>
                {product.space && (
                  <>
                    <span className="text-muted-foreground">•</span>
                    <span className="text-sm text-muted-foreground">
                      {product.space.name}
                    </span>
                  </>
                )}
              </div>

              {/* Stats */}
              <div className="flex items-center gap-4 mb-3">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span className="text-sm font-medium">{product.rating}</span>
                  <span className="text-sm text-muted-foreground">
                    ({product.reviewCount})
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Eye className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">{product.views}</span>
                </div>
                <div className="flex items-center gap-1">
                  <TrendingUp className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">{product.sales}</span>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1 mb-3">
                {product.tags.slice(0, 3).map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {product.tags.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{product.tags.length - 3} más
                  </Badge>
                )}
              </div>

              {/* Price and Actions */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-primary">
                    {formatPrice(product.price, product.currency)}
                  </span>
                  {product.stock > 0 ? (
                    <Badge variant="outline" className="text-green-600">
                      En stock ({product.stock})
                    </Badge>
                  ) : (
                    <Badge variant="destructive">Agotado</Badge>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center border rounded-md">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                    >
                      <Minus className="w-3 h-3" />
                    </Button>
                    <span className="px-2 text-sm">{quantity}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setQuantity(quantity + 1)}
                      disabled={quantity >= product.stock}
                    >
                      <Plus className="w-3 h-3" />
                    </Button>
                  </div>
                  <Button
                    onClick={handleAddToCart}
                    disabled={product.stock === 0}
                    className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Agregar
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
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all group">
      <CardContent className="p-4">
        {/* Product Image */}
        <div className="relative aspect-square rounded-lg overflow-hidden bg-muted mb-4">
          <img 
            src={product.images[0] || "/placeholder.svg"} 
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {product.isDigital && (
            <Badge className="absolute top-2 left-2 bg-blue-500">
              <Download className="w-3 h-3 mr-1" />
              Digital
            </Badge>
          )}
          {product.shippingInfo?.freeShipping && (
            <Badge className="absolute top-2 right-2 bg-green-500">
              <Truck className="w-3 h-3 mr-1" />
              Envío gratis
            </Badge>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLike}
            className={`absolute top-2 right-2 bg-background/80 hover:bg-background/90 ${
              isLiked ? "text-red-500" : ""
            }`}
          >
            <Heart className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`} />
          </Button>
        </div>

        {/* Product Info */}
        <div className="space-y-3">
          <div>
            <h3 className="font-semibold text-lg line-clamp-2 mb-1">{product.title}</h3>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {product.description}
            </p>
          </div>

          {/* Seller Info */}
          <div className="flex items-center gap-2">
            <Avatar className="w-6 h-6">
              <AvatarImage src={product.seller.avatar} />
              <AvatarFallback className="text-xs">
                {product.seller.username.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm text-muted-foreground truncate">
              {product.seller.username}
            </span>
          </div>

          {/* Stats */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-500 fill-current" />
              <span className="text-sm font-medium">{product.rating}</span>
              <span className="text-sm text-muted-foreground">
                ({product.reviewCount})
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Eye className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">{product.views}</span>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1">
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

          {/* Price and Actions */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xl font-bold text-primary">
                {formatPrice(product.price, product.currency)}
              </span>
              {product.stock > 0 ? (
                <Badge variant="outline" className="text-green-600 text-xs">
                  En stock
                </Badge>
              ) : (
                <Badge variant="destructive" className="text-xs">Agotado</Badge>
              )}
            </div>

            <Button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              Agregar al carrito
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
