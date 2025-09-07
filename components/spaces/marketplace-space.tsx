"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  ShoppingCart, 
  Star, 
  Heart, 
  Share2, 
  DollarSign,
  Truck,
  Shield,
  Clock,
  Users,
  TrendingUp,
  Filter,
  Search
} from "lucide-react"

interface MarketplaceSpaceProps {
  spaceId: string
}

const mockProducts = [
  {
    id: "1",
    name: "Quantum Art NFT Collection",
    price: 0.5,
    currency: "ETH",
    image: "/placeholder.svg",
    seller: "DigitalArtist",
    rating: 4.8,
    reviews: 1247,
    sales: 89,
    category: "Digital Art",
    isVerified: true
  },
  {
    id: "2",
    name: "Cosmic Music Album",
    price: 25,
    currency: "USD",
    image: "/placeholder.svg",
    seller: "LunaNova",
    rating: 4.6,
    reviews: 892,
    sales: 156,
    category: "Music",
    isVerified: true
  },
  {
    id: "3",
    name: "Tech Tutorial Course",
    price: 99,
    currency: "USD",
    image: "/placeholder.svg",
    seller: "TechGuru",
    rating: 4.9,
    reviews: 2156,
    sales: 234,
    category: "Education",
    isVerified: false
  }
]

const mockCategories = [
  { name: "Digital Art", count: 1247, icon: "🎨" },
  { name: "Music", count: 892, icon: "🎵" },
  { name: "Education", count: 2156, icon: "📚" },
  { name: "Gaming", count: 1567, icon: "🎮" },
  { name: "Collectibles", count: 2341, icon: "🏆" }
]

const mockFeatured = [
  {
    id: "1",
    title: "Featured Collection: Cosmic Dreams",
    description: "Exclusive NFT collection by top artists",
    image: "/placeholder.svg",
    price: "0.5 ETH",
    sales: 89,
    timeLeft: "2 días"
  }
]

export function MarketplaceSpace({ spaceId }: MarketplaceSpaceProps) {
  return (
    <div className="space-y-6">
      {/* Featured Collection */}
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5" />
            Colección Destacada
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {mockFeatured.map((item) => (
              <div key={item.id} className="relative overflow-hidden rounded-lg">
                <div className="aspect-video bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <div className="text-center text-white">
                    <div className="text-4xl mb-2">🎨</div>
                    <h3 className="text-xl font-bold">{item.title}</h3>
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white p-4">
                  <p className="text-sm mb-2">{item.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4" />
                      <span className="font-semibold">{item.price}</span>
                    </div>
                    <Badge variant="outline" className="gap-1">
                      <Clock className="h-3 w-3" />
                      {item.timeLeft}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Categories */}
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Categorías Populares
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {mockCategories.map((category, index) => (
              <div key={index} className="text-center p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                <div className="text-3xl mb-2">{category.icon}</div>
                <h4 className="font-semibold text-sm">{category.name}</h4>
                <p className="text-xs text-muted-foreground">{category.count} productos</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Products */}
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              Productos Destacados
            </CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filtrar
              </Button>
              <Button variant="outline" size="sm">
                <Search className="h-4 w-4 mr-2" />
                Buscar
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockProducts.map((product) => (
              <div key={product.id} className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-square bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                  <div className="text-center text-white">
                    <div className="text-4xl mb-2">🛍️</div>
                    <p className="text-sm">{product.category}</p>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold line-clamp-1">{product.name}</h4>
                    {product.isVerified && (
                      <Badge variant="default" className="gap-1">
                        <Shield className="h-3 w-3" />
                        Verificado
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">por {product.seller}</p>
                  
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{product.rating}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">({product.reviews})</span>
                  </div>
                  
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-4 w-4" />
                      <span className="font-bold text-lg">{product.price}</span>
                      <span className="text-sm text-muted-foreground">{product.currency}</span>
                    </div>
                    <Badge variant="outline" className="gap-1">
                      <TrendingUp className="h-3 w-3" />
                      {product.sales} ventas
                    </Badge>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button className="flex-1" size="sm">
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Comprar
                    </Button>
                    <Button variant="outline" size="sm">
                      <Heart className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Marketplace Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Volumen Total</p>
                <p className="text-xl font-bold">2.4K ETH</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                <ShoppingCart className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Productos</p>
                <p className="text-xl font-bold">8.9K</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Users className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Vendedores</p>
                <p className="text-xl font-bold">1.2K</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                <Truck className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Envíos</p>
                <p className="text-xl font-bold">5.6K</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
