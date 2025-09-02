"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  Filter, 
  X, 
  Star, 
  Truck, 
  Download,
  Package,
  Tag
} from "lucide-react"

interface ProductFiltersProps {
  priceRange: number[]
  onPriceRangeChange: (value: number[]) => void
  filters: {
    digitalOnly: boolean
    freeShipping: boolean
    inStock: boolean
    minRating: number
    condition: string[]
    tags: string[]
  }
  onFiltersChange: (filters: any) => void
}

const conditions = [
  { id: "new", label: "Nuevo" },
  { id: "like_new", label: "Como nuevo" },
  { id: "good", label: "Bueno" },
  { id: "fair", label: "Aceptable" },
  { id: "poor", label: "Pobre" }
]

const popularTags = [
  "arte digital", "ilustración", "diseño", "fotografía", "música", 
  "curso", "software", "camiseta", "poster", "sticker"
]

export function ProductFilters({ 
  priceRange, 
  onPriceRangeChange, 
  filters, 
  onFiltersChange 
}: ProductFiltersProps) {
  const handleFilterChange = (key: string, value: any) => {
    onFiltersChange({ ...filters, [key]: value })
  }

  const handleConditionToggle = (conditionId: string) => {
    const newConditions = filters.condition.includes(conditionId)
      ? filters.condition.filter(id => id !== conditionId)
      : [...filters.condition, conditionId]
    handleFilterChange("condition", newConditions)
  }

  const handleTagToggle = (tag: string) => {
    const newTags = filters.tags.includes(tag)
      ? filters.tags.filter(t => t !== tag)
      : [...filters.tags, tag]
    handleFilterChange("tags", newTags)
  }

  const clearFilters = () => {
    onFiltersChange({
      digitalOnly: false,
      freeShipping: false,
      inStock: false,
      minRating: 0,
      condition: [],
      tags: []
    })
    onPriceRangeChange([0, 1000])
  }

  const activeFiltersCount = [
    filters.digitalOnly,
    filters.freeShipping,
    filters.inStock,
    filters.minRating > 0,
    filters.condition.length > 0,
    filters.tags.length > 0,
    priceRange[0] > 0 || priceRange[1] < 1000
  ].filter(Boolean).length

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filtros
            {activeFiltersCount > 0 && (
              <Badge variant="secondary" className="ml-2">
                {activeFiltersCount}
              </Badge>
            )}
          </CardTitle>
          {activeFiltersCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4 mr-1" />
              Limpiar
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Price Range */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Rango de precio</Label>
          <div className="px-2">
            <Slider
              value={priceRange}
              onValueChange={onPriceRangeChange}
              max={1000}
              min={0}
              step={10}
              className="w-full"
            />
          </div>
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>${priceRange[0]}</span>
            <span>${priceRange[1]}</span>
          </div>
        </div>

        {/* Quick Filters */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Filtros rápidos</Label>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Download className="w-4 h-4 text-blue-500" />
                <Label htmlFor="digital-only" className="text-sm">Solo productos digitales</Label>
              </div>
              <Switch
                id="digital-only"
                checked={filters.digitalOnly}
                onCheckedChange={(checked) => handleFilterChange("digitalOnly", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-green-500" />
                <Label htmlFor="free-shipping" className="text-sm">Envío gratis</Label>
              </div>
              <Switch
                id="free-shipping"
                checked={filters.freeShipping}
                onCheckedChange={(checked) => handleFilterChange("freeShipping", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4 text-orange-500" />
                <Label htmlFor="in-stock" className="text-sm">En stock</Label>
              </div>
              <Switch
                id="in-stock"
                checked={filters.inStock}
                onCheckedChange={(checked) => handleFilterChange("inStock", checked)}
              />
            </div>
          </div>
        </div>

        {/* Rating Filter */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Calificación mínima</Label>
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((rating) => (
              <Button
                key={rating}
                variant={filters.minRating >= rating ? "default" : "outline"}
                size="sm"
                onClick={() => handleFilterChange("minRating", rating)}
                className="flex items-center gap-1"
              >
                <Star className={`w-4 h-4 ${filters.minRating >= rating ? "fill-current" : ""}`} />
                {rating}+
              </Button>
            ))}
          </div>
        </div>

        {/* Condition Filter */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Condición</Label>
          <div className="flex flex-wrap gap-2">
            {conditions.map((condition) => (
              <Button
                key={condition.id}
                variant={filters.condition.includes(condition.id) ? "default" : "outline"}
                size="sm"
                onClick={() => handleConditionToggle(condition.id)}
              >
                {condition.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Tags Filter */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Etiquetas populares</Label>
          <div className="flex flex-wrap gap-2">
            {popularTags.map((tag) => (
              <Button
                key={tag}
                variant={filters.tags.includes(tag) ? "default" : "outline"}
                size="sm"
                onClick={() => handleTagToggle(tag)}
                className="flex items-center gap-1"
              >
                <Tag className="w-3 h-3" />
                {tag}
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
