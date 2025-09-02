import type { Product, ProductCategory, Order, Review, Cart, CartItem } from "@/types"
import { mockUsers } from "./users"
import { mockSpaces } from "./spaces"

export const productCategories: ProductCategory[] = [
  {
    id: "digital-art",
    name: "Arte Digital",
    icon: "🎨",
    description: "Ilustraciones, diseños y arte digital",
    subcategories: ["Ilustraciones", "Diseños", "NFTs", "Logos", "Banners"]
  },
  {
    id: "physical-art",
    name: "Arte Físico",
    icon: "🖼️",
    description: "Pinturas, esculturas y arte físico",
    subcategories: ["Pinturas", "Esculturas", "Fotografía", "Dibujos", "Manualidades"]
  },
  {
    id: "digital-products",
    name: "Productos Digitales",
    icon: "💻",
    description: "Software, cursos y contenido digital",
    subcategories: ["Software", "Cursos", "Ebooks", "Templates", "Presets"]
  },
  {
    id: "merchandise",
    name: "Merchandising",
    icon: "👕",
    description: "Ropa, accesorios y productos promocionales",
    subcategories: ["Ropa", "Accesorios", "Tazas", "Stickers", "Posters"]
  },
  {
    id: "services",
    name: "Servicios",
    icon: "🔧",
    description: "Servicios profesionales y consultoría",
    subcategories: ["Diseño", "Desarrollo", "Consultoría", "Mentoría", "Edición"]
  }
]

export const mockProducts: Product[] = [
  {
    id: "1",
    sellerId: "1",
    seller: mockUsers[0],
    spaceId: "1",
    space: mockSpaces[0],
    title: "Ilustración Digital: Nebulae Collection",
    description: "Serie de 5 ilustraciones digitales inspiradas en nebulosas cósmicas. Perfectas para fondos de escritorio, impresiones o NFTs. Incluye archivos en alta resolución y versiones para diferentes usos.",
    price: 45.99,
    currency: "USD",
    category: productCategories[0],
    subcategory: "Ilustraciones",
    images: [
      "/digital-art-avatar.png",
      "/placeholder.svg",
      "/placeholder.svg"
    ],
    tags: ["arte digital", "nebulosas", "cósmico", "ilustración", "fondo"],
    condition: "new",
    stock: 10,
    isDigital: true,
    digitalDelivery: true,
    status: "active",
    views: 1247,
    likes: 89,
    sales: 23,
    rating: 4.8,
    reviewCount: 12,
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-20")
  },
  {
    id: "2",
    sellerId: "2",
    seller: mockUsers[1],
    spaceId: "2",
    space: mockSpaces[1],
    title: "Curso de Fotografía Digital Avanzada",
    description: "Curso completo de 12 horas sobre técnicas avanzadas de fotografía digital. Incluye teoría, práctica, archivos de trabajo y certificado de finalización.",
    price: 129.99,
    currency: "USD",
    category: productCategories[2],
    subcategory: "Cursos",
    images: [
      "/curator-avatar.png",
      "/placeholder.svg"
    ],
    tags: ["fotografía", "curso", "digital", "técnicas", "avanzado"],
    condition: "new",
    stock: 50,
    isDigital: true,
    digitalDelivery: true,
    status: "active",
    views: 892,
    likes: 156,
    sales: 34,
    rating: 4.9,
    reviewCount: 28,
    createdAt: new Date("2024-01-10"),
    updatedAt: new Date("2024-01-18")
  },
  {
    id: "3",
    sellerId: "3",
    seller: mockUsers[2],
    title: "Camiseta Lumora - Edición Limitada",
    description: "Camiseta de edición limitada con el logo de Lumora. Material 100% algodón, disponible en varios colores y tallas. Diseño exclusivo de la comunidad.",
    price: 29.99,
    currency: "USD",
    category: productCategories[3],
    subcategory: "Ropa",
    images: [
      "/editor-avatar.png",
      "/placeholder.svg",
      "/placeholder.svg"
    ],
    tags: ["camiseta", "lumora", "edición limitada", "algodón", "comunidad"],
    condition: "new",
    stock: 25,
    isDigital: false,
    shippingInfo: {
      weight: 0.2,
      dimensions: { length: 30, width: 20, height: 2 },
      shippingMethods: [
        { id: "1", name: "Estándar", price: 5.99, estimatedDays: 5 },
        { id: "2", name: "Express", price: 12.99, estimatedDays: 2 }
      ],
      freeShipping: false
    },
    status: "active",
    views: 567,
    likes: 45,
    sales: 8,
    rating: 4.7,
    reviewCount: 6,
    createdAt: new Date("2024-01-12"),
    updatedAt: new Date("2024-01-19")
  },
  {
    id: "4",
    sellerId: "4",
    seller: mockUsers[3],
    title: "Servicio de Diseño de Logos",
    description: "Servicio profesional de diseño de logos. Incluye 3 conceptos iniciales, 2 revisiones y archivos finales en múltiples formatos. Entrega en 5-7 días hábiles.",
    price: 199.99,
    currency: "USD",
    category: productCategories[4],
    subcategory: "Diseño",
    images: [
      "/developer-profile.png",
      "/placeholder.svg"
    ],
    tags: ["diseño", "logo", "branding", "profesional", "servicio"],
    condition: "new",
    stock: 10,
    isDigital: true,
    digitalDelivery: true,
    status: "active",
    views: 234,
    likes: 23,
    sales: 5,
    rating: 5.0,
    reviewCount: 5,
    createdAt: new Date("2024-01-08"),
    updatedAt: new Date("2024-01-16")
  },
  {
    id: "5",
    sellerId: "5",
    seller: mockUsers[4],
    title: "Pintura Original: Paisaje Cósmico",
    description: "Pintura original en acrílico sobre lienzo. Inspirada en paisajes cósmicos y nebulosas. Tamaño 60x40cm. Incluye certificado de autenticidad.",
    price: 450.00,
    currency: "USD",
    category: productCategories[1],
    subcategory: "Pinturas",
    images: [
      "/artist-profile.png",
      "/placeholder.svg",
      "/placeholder.svg"
    ],
    tags: ["pintura", "original", "cósmico", "acrílico", "lienzo"],
    condition: "new",
    stock: 1,
    isDigital: false,
    shippingInfo: {
      weight: 2.5,
      dimensions: { length: 60, width: 40, height: 5 },
      shippingMethods: [
        { id: "1", name: "Estándar", price: 25.99, estimatedDays: 7 },
        { id: "2", name: "Express", price: 45.99, estimatedDays: 3 }
      ],
      freeShipping: false
    },
    status: "active",
    views: 89,
    likes: 12,
    sales: 0,
    rating: 0,
    reviewCount: 0,
    createdAt: new Date("2024-01-20"),
    updatedAt: new Date("2024-01-20")
  }
]

export const mockOrders: Order[] = [
  {
    id: "1",
    buyerId: "2",
    buyer: mockUsers[1],
    sellerId: "1",
    seller: mockUsers[0],
    productId: "1",
    product: mockProducts[0],
    quantity: 1,
    totalPrice: 45.99,
    currency: "USD",
    status: "delivered",
    paymentStatus: "paid",
    shippingAddress: {
      id: "1",
      userId: "2",
      type: "shipping",
      firstName: "Ana",
      lastName: "García",
      address1: "Calle Principal 123",
      city: "Madrid",
      state: "Madrid",
      postalCode: "28001",
      country: "España",
      phone: "+34 600 123 456",
      isDefault: true
    },
    paymentMethod: {
      id: "1",
      userId: "2",
      type: "card",
      last4: "1234",
      brand: "visa",
      isDefault: true,
      isActive: true
    },
    createdAt: new Date("2024-01-18"),
    updatedAt: new Date("2024-01-20")
  }
]

export const mockReviews: Review[] = [
  {
    id: "1",
    productId: "1",
    product: mockProducts[0],
    buyerId: "2",
    buyer: mockUsers[1],
    sellerId: "1",
    seller: mockUsers[0],
    orderId: "1",
    rating: 5,
    title: "Excelente calidad y diseño",
    comment: "Las ilustraciones son hermosas y la calidad es excepcional. El vendedor fue muy profesional y la entrega fue rápida. Definitivamente recomiendo!",
    isVerified: true,
    createdAt: new Date("2024-01-20"),
    updatedAt: new Date("2024-01-20")
  }
]

export const mockCart: Cart = {
  id: "1",
  userId: "1",
  items: [],
  totalItems: 0,
  subtotal: 0,
  shipping: 0,
  tax: 0,
  total: 0,
  currency: "USD",
  updatedAt: new Date()
}

// Utility functions
export const getProductsBySpace = (spaceId: string): Product[] => {
  return mockProducts.filter(product => product.spaceId === spaceId)
}

export const getProductsBySeller = (sellerId: string): Product[] => {
  return mockProducts.filter(product => product.sellerId === sellerId)
}

export const getProductsByCategory = (categoryId: string): Product[] => {
  return mockProducts.filter(product => product.category.id === categoryId)
}

export const getProductById = (productId: string): Product | undefined => {
  return mockProducts.find(product => product.id === productId)
}

export const getOrdersByUser = (userId: string): Order[] => {
  return mockOrders.filter(order => order.buyerId === userId || order.sellerId === userId)
}

export const getReviewsByProduct = (productId: string): Review[] => {
  return mockReviews.filter(review => review.productId === productId)
}

export const getCartByUser = (userId: string): Cart => {
  return mockCart // En una implementación real, esto vendría de la base de datos
}
