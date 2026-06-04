"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { 
  Search, 
  Filter, 
  Grid, 
  List, 
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
  Settings,
  Sparkles
} from "lucide-react"
import { useAuth } from "@/lib/auth"
import { 
  mockProducts, 
  productCategories, 
  getProductsByCategory,
  getProductsBySpace 
} from "@/data"
import { ProductCard } from "./product-card"
import { ProductFilters } from "./product-filters"
import { CartSidebar } from "./cart-sidebar"
import { ProductDetailModal } from "./product-detail-modal"
import type { Product } from "@/types"

interface ProductCatalogProps {
  spaceId?: string
  sellerId?: string
  categoryId?: string
}

export function ProductCatalog({ spaceId, sellerId, categoryId }: ProductCatalogProps) {
  const { user } = useAuth()
  const [products, setProducts] = useState(mockProducts)
  const [filteredProducts, setFilteredProducts] = useState(mockProducts)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [showFilters, setShowFilters] = useState(false)
  const [showCart, setShowCart] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [showProductDetail, setShowProductDetail] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState(categoryId || "")
  const [priceRange, setPriceRange] = useState([0, 1000])
  const [filters, setFilters] = useState({
    digitalOnly: false,
    freeShipping: false,
    inStock: false,
    minRating: 0,
    condition: [] as string[],
    tags: [] as string[]
  })

  // Load products based on props
  useEffect(() => {
    let filtered = mockProducts

    if (spaceId) {
      filtered = getProductsBySpace(spaceId)
    } else if (sellerId) {
      filtered = mockProducts.filter(p => p.sellerId === sellerId)
    } else if (categoryId) {
      filtered = getProductsByCategory(categoryId)
    }

    setProducts(filtered)
    setFilteredProducts(filtered)
  }, [spaceId, sellerId, categoryId])

  // Apply filters
  useEffect(() => {
    let filtered = products

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(product =>
        product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }

    // Category filter
    if (selectedCategory) {
      filtered = filtered.filter(product => product.category.id === selectedCategory)
    }

    // Price range filter
    filtered = filtered.filter(product => 
      product.price >= priceRange[0] && product.price <= priceRange[1]
    )

    // Digital only filter
    if (filters.digitalOnly) {
      filtered = filtered.filter(product => product.isDigital)
    }

    // Free shipping filter
    if (filters.freeShipping) {
      filtered = filtered.filter(product => product.shippingInfo?.freeShipping)
    }

    // In stock filter
    if (filters.inStock) {
      filtered = filtered.filter(product => product.stock > 0)
    }

    // Rating filter
    if (filters.minRating > 0) {
      filtered = filtered.filter(product => product.rating >= filters.minRating)
    }

    setFilteredProducts(filtered)
  }, [products, searchQuery, selectedCategory, priceRange, filters])

  const handleAddToCart = (productId: string) => {
    // Aquí iría la lógica para agregar al carrito
    console.log("Adding to cart:", productId)
  }

  const handleLike = (productId: string) => {
    // Aquí iría la lógica para like
    console.log("Liking product:", productId)
  }

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product)
    setShowProductDetail(true)
  }

  const handleAddToCartFromModal = (productId: string, quantity: number) => {
    // Aquí iría la lógica para agregar al carrito con cantidad específica
    console.log("Adding to cart:", productId, "quantity:", quantity)
  }

  return (
    <div className="flex h-full">
      {/* Main Content */}
      <div className="flex-1 p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-primary">
              {spaceId ? "Marketplace del Espacio" : "Marketplace"}
            </h1>
            <p className="text-muted-foreground mt-1">
              {filteredProducts.length} productos encontrados
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="w-4 h-4 mr-2" />
              Filtros
            </Button>

            <div className="flex items-center border rounded-md">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowCart(true)}
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              Carrito
            </Button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Buscar productos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Category Tabs */}
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="">Todos</TabsTrigger>
              {productCategories.map((category) => (
                <TabsTrigger key={category.id} value={category.id}>
                  <span className="mr-2">{category.icon}</span>
                  {category.name}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          {/* Filters Panel */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <ProductFilters
                  priceRange={priceRange}
                  onPriceRangeChange={setPriceRange}
                  filters={filters}
                  onFiltersChange={setFilters}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Products Grid/List */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <Sparkles className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No se encontraron productos</h3>
            <p className="text-muted-foreground">
              Intenta ajustar los filtros o la búsqueda
            </p>
          </div>
        ) : (
          <div className={viewMode === "grid" 
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            : "space-y-4"
          }>
            <AnimatePresence>
              {filteredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <ProductCard
                    product={product}
                    viewMode={viewMode}
                    onAddToCart={handleAddToCart}
                    onLike={handleLike}
                    onProductClick={handleProductClick}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Cart Sidebar */}
      <CartSidebar 
        isOpen={showCart} 
        onClose={() => setShowCart(false)} 
      />

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        isOpen={showProductDetail}
        onClose={() => {
          setShowProductDetail(false)
          setSelectedProduct(null)
        }}
        onAddToCart={handleAddToCartFromModal}
        onLike={handleLike}
      />
    </div>
  )
}
