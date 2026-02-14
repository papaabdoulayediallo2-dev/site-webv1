'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { Star, Heart, ShoppingCart, Zap, Truck, Shield, RotateCcw, Check, ChevronLeft, ChevronRight, Plus, Minus, X, Package, Clock, MapPin, Gift, BadgeCheck, HeadphonesIcon, ThumbsUp, Settings, Edit, Trash2, Save, Image as ImageIcon, Loader2 } from 'lucide-react'

// ==================== TYPES ====================
interface ProductImage {
  id: string
  url: string
  alt?: string
  order: number
}

interface ProductVariant {
  id: string
  type: string
  name: string
  value: string
  hex?: string
  price?: number | null
  stock: number
  imageIndex?: number | null
}

interface ProductSpecification {
  id: string
  name: string
  value: string
  order: number
}

interface ProductFeature {
  id: string
  icon: string
  title: string
  desc: string
  order: number
}

interface ProductReview {
  id: string
  author: string
  avatar?: string
  rating: number
  title: string
  content: string
  date: string
  verified: boolean
  helpful: number
}

interface RelatedProduct {
  id: string
  title: string
  price: number
  rating: number
  reviews: number
  image: string
}

interface Product {
  id: string
  title: string
  brand: string
  brandLink?: string
  subtitle?: string
  description?: string
  price: number
  originalPrice?: number | null
  discount?: number | null
  coupon?: number | null
  installment?: number | null
  rating: number
  totalRatings: number
  boughtLastMonth?: string
  prime: boolean
  freeShipping: boolean
  flashSale: boolean
  isNew: boolean
  stock: number
  images: ProductImage[]
  variants: ProductVariant[]
  specifications: ProductSpecification[]
  features: ProductFeature[]
  reviews: ProductReview[]
  relatedProducts: RelatedProduct[]
}

// ==================== COMPOSANT IMAGE SÛR ====================
function SafeImage({ src, alt, className, fallbackClassName }: { src: string; alt: string; className?: string; fallbackClassName?: string }) {
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(true)

  if (error || !src) {
    return (
      <div className={`bg-gray-100 flex items-center justify-center ${fallbackClassName || className}`}>
        <ImageIcon className="text-gray-400" size={32} />
      </div>
    )
  }

  return (
    <>
      {loading && (
        <div className={`absolute inset-0 bg-gray-100 animate-pulse flex items-center justify-center ${className}`}>
          <Loader2 className="text-gray-400 animate-spin" size={24} />
        </div>
      )}
      <img
        src={src}
        alt={alt}
        className={`${className} ${loading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        onError={() => { setError(true); setLoading(false) }}
        onLoad={() => setLoading(false)}
        loading="lazy"
      />
    </>
  )
}

// ==================== FIL D'ARIANE ====================
function Breadcrumb() {
  const items = [
    { label: 'Accueil', href: '/' },
    { label: 'Électronique', href: '/electronics' },
    { label: 'Audio', href: '/electronics/audio' },
    { label: 'Écouteurs Sans Fil', href: '/electronics/audio/earbuds' },
  ]

  return (
    <nav className="text-xs text-[#565959] py-2 px-4 bg-white border-b border-[#DDD]">
      <ol className="flex items-center flex-wrap gap-1">
        {items.map((item, index) => (
          <React.Fragment key={index}>
            <li>
              <a href={item.href} className="hover:text-[#C7511F] hover:underline transition-colors">
                {item.label}
              </a>
            </li>
            {index < items.length - 1 && (
              <li className="text-[#999] mx-1">›</li>
            )}
          </React.Fragment>
        ))}
      </ol>
    </nav>
  )
}

// ==================== GALERIE D'IMAGES ====================
function ImageGallery({ images }: { images: ProductImage[] }) {
  const [mainImage, setMainImage] = useState(0)
  const [showZoom, setShowZoom] = useState(false)
  const [showLightbox, setShowLightbox] = useState(false)
  const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 })
  const imageRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageRef.current) return
    const rect = imageRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    setZoomPosition({ x, y })
  }

  if (!images || images.length === 0) {
    return (
      <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
        <ImageIcon className="text-gray-400" size={48} />
      </div>
    )
  }

  return (
    <div className="flex gap-2">
      {/* Miniatures */}
      <div className="flex flex-col gap-2 w-[60px] shrink-0">
        {images.map((img, index) => (
          <button
            key={img.id || index}
            className={`w-[60px] h-[60px] border-2 rounded-md overflow-hidden transition-all relative ${
              mainImage === index ? 'border-[#C7511F] shadow-md' : 'border-[#DDD] hover:border-[#007185]'
            }`}
            onMouseEnter={() => setMainImage(index)}
            onClick={() => setMainImage(index)}
          >
            <SafeImage src={img.url} alt={img.alt || `Vue ${index + 1}`} className="w-full h-full object-cover" fallbackClassName="w-full h-full" />
          </button>
        ))}
      </div>

      {/* Image principale */}
      <div className="flex-1 relative">
        <div
          ref={imageRef}
          className="relative aspect-square bg-white rounded-lg overflow-hidden cursor-crosshair border border-[#DDD]"
          onMouseEnter={() => setShowZoom(true)}
          onMouseLeave={() => setShowZoom(false)}
          onMouseMove={handleMouseMove}
          onClick={() => setShowLightbox(true)}
        >
          <SafeImage
            src={images[mainImage]?.url || ''}
            alt="Image principale"
            className="w-full h-full object-contain transition-opacity duration-200 absolute inset-0"
            fallbackClassName="w-full h-full absolute inset-0"
          />
        </div>

        {/* Zone de zoom */}
        {showZoom && images[mainImage] && (
          <div
            className="absolute top-0 left-full ml-4 w-[400px] h-[400px] bg-white border border-[#DDD] rounded-lg shadow-xl overflow-hidden z-20 hidden lg:block"
            style={{
              backgroundImage: `url(${images[mainImage].url})`,
              backgroundSize: '250%',
              backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`,
              backgroundRepeat: 'no-repeat'
            }}
          />
        )}
      </div>

      {/* Lightbox */}
      {showLightbox && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={() => setShowLightbox(false)}>
          <button
            className="absolute top-4 right-4 text-white hover:text-[#C7511F] transition-colors"
            onClick={() => setShowLightbox(false)}
          >
            <X size={32} />
          </button>
          <SafeImage
            src={images[mainImage]?.url || ''}
            alt="Image en plein écran"
            className="max-w-full max-h-[90vh] object-contain"
            fallbackClassName="w-[400px] h-[400px]"
          />
          <button
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-[#C7511F] transition-colors p-2"
            onClick={(e) => { e.stopPropagation(); setMainImage(prev => (prev - 1 + images.length) % images.length) }}
          >
            <ChevronLeft size={40} />
          </button>
          <button
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-[#C7511F] transition-colors p-2"
            onClick={(e) => { e.stopPropagation(); setMainImage(prev => (prev + 1) % images.length) }}
          >
            <ChevronRight size={40} />
          </button>
        </div>
      )}
    </div>
  )
}

// ==================== ÉTOILES ====================
function StarRating({ rating, size = 16 }: { rating: number; size?: number }) {
  const fullStars = Math.floor(rating)
  const hasHalf = rating % 1 >= 0.5

  return (
    <div className="flex items-center gap-0.5">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          size={size}
          fill={i < fullStars ? '#FFA41C' : i === fullStars && hasHalf ? '#FFA41C' : 'transparent'}
          stroke="#FFA41C"
        />
      ))}
    </div>
  )
}

// ==================== MODULE INFOS PRODUIT ====================
function ProductInfo({
  product,
  selectedColor,
  selectedCapacity,
  onColorChange,
  onCapacityChange,
  price,
  stock
}: {
  product: Product
  selectedColor: string
  selectedCapacity: string
  onColorChange: (color: string) => void
  onCapacityChange: (capacity: string) => void
  price: number
  stock: number
}) {
  const [wishlist, setWishlist] = useState(false)

  const colors = product.variants.filter(v => v.type === 'color')
  const capacities = product.variants.filter(v => v.type === 'capacity')

  return (
    <div className="space-y-4">
      {/* Titre */}
      <div>
        <h1 className="text-xl md:text-2xl font-normal text-[#0F1111] leading-tight line-clamp-3">
          {product.title}
        </h1>
        {product.brandLink && (
          <a href={product.brandLink} className="text-sm text-[#007185] hover:text-[#C7511F] hover:underline mt-1 inline-block">
            Visiter la boutique {product.brand}
          </a>
        )}
        {product.subtitle && (
          <p className="text-sm text-[#565959] mt-1">{product.subtitle}</p>
        )}
      </div>

      {/* Notation */}
      <div className="flex flex-wrap items-center gap-2 text-sm">
        <div className="flex items-center gap-1">
          <StarRating rating={product.rating} />
          <span className="text-[#007185] hover:text-[#C7511F] cursor-pointer">{product.rating} sur 5</span>
        </div>
        <span className="text-[#565959]">|</span>
        <a href="#reviews" className="text-[#007185] hover:text-[#C7511F] hover:underline">
          {product.totalRatings.toLocaleString('fr-FR')} évaluations
        </a>
        {product.boughtLastMonth && (
          <>
            <span className="text-[#565959]">|</span>
            <span className="text-[#565959]">
              {product.boughtLastMonth} achetés le mois dernier
            </span>
          </>
        )}
      </div>

      {/* Prix */}
      <div className="bg-[#F7F8F8] p-3 rounded-lg space-y-2">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-2xl text-[#B12704] font-normal">
            <span className="text-base align-top">€</span>{price.toFixed(2)}
          </span>
          {product.originalPrice && product.originalPrice > price && (
            <span className="text-sm text-[#565959] line-through">
              €{product.originalPrice.toFixed(2)}
            </span>
          )}
          {product.discount && (
            <span className="bg-[#CC0C39] text-white text-xs font-bold px-2 py-0.5 rounded">
              -{product.discount}%
            </span>
          )}
        </div>

        {product.coupon && (
          <div className="flex items-center gap-2">
            <Gift className="text-[#067D62]" size={16} />
            <span className="text-sm text-[#067D62] font-medium">
              Économisez €{product.coupon} avec le coupon
            </span>
          </div>
        )}

        {product.installment && (
          <p className="text-xs text-[#565959]">
            ou €{product.installment.toFixed(2)}/mois x 12 mois sans frais
          </p>
        )}
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2">
        {product.prime && (
          <span className="inline-flex items-center gap-1 bg-[#232F3E] text-white text-xs font-bold px-2 py-1 rounded">
            <Zap size={12} className="text-[#00A8E1]" />
            Prime
          </span>
        )}
        {product.freeShipping && (
          <span className="inline-flex items-center gap-1 bg-[#067D62] text-white text-xs font-medium px-2 py-1 rounded">
            <Truck size={12} />
            Livraison Gratuite
          </span>
        )}
        {product.flashSale && (
          <span className="inline-flex items-center gap-1 bg-[#CC0C39] text-white text-xs font-bold px-2 py-1 rounded">
            <Zap size={12} />
            Vente Flash
          </span>
        )}
        {product.isNew && (
          <span className="inline-flex items-center gap-1 bg-[#007185] text-white text-xs font-bold px-2 py-1 rounded">
            Nouveau
          </span>
        )}
      </div>

      {/* Couleurs */}
      {colors.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm text-[#0F1111]">
            <span className="text-[#565959]">Couleur :</span> 
            <span className="font-medium ml-1">{colors.find(c => c.value === selectedColor)?.name}</span>
          </p>
          <div className="flex flex-wrap gap-2">
            {colors.map((color) => {
              const isOutOfStock = color.stock === 0
              return (
                <button
                  key={color.id}
                  disabled={isOutOfStock}
                  onClick={() => onColorChange(color.value)}
                  className={`relative w-10 h-10 rounded-full border-2 transition-all ${
                    selectedColor === color.value 
                      ? 'border-[#C7511F] ring-2 ring-[#C7511F]/30' 
                      : 'border-[#DDD] hover:border-[#007185]'
                  } ${isOutOfStock ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}
                  style={{ backgroundColor: color.hex || '#ccc' }}
                  title={color.name}
                >
                  {selectedColor === color.value && !isOutOfStock && (
                    <Check size={16} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white drop-shadow-md" />
                  )}
                  {isOutOfStock && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-full h-0.5 bg-red-500 rotate-45 transform origin-center"></div>
                    </div>
                  )}
                </button>
              )
            })}
          </div>
          {colors.find(c => c.value === selectedColor)?.stock !== undefined && 
           colors.find(c => c.value === selectedColor)!.stock < 5 && 
           colors.find(c => c.value === selectedColor)!.stock > 0 && (
            <p className="text-sm text-[#B12704] font-medium">
              Plus que {colors.find(c => c.value === selectedColor)?.stock} en stock !
            </p>
          )}
        </div>
      )}

      {/* Capacités */}
      {capacities.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm text-[#0F1111]">
            <span className="text-[#565959]">Capacité :</span>
            <span className="font-medium ml-1">{capacities.find(c => c.value === selectedCapacity)?.name}</span>
          </p>
          <div className="flex flex-wrap gap-2">
            {capacities.map((cap) => {
              const isOutOfStock = cap.stock === 0
              const isLowStock = cap.stock > 0 && cap.stock < 10
              return (
                <button
                  key={cap.id}
                  disabled={isOutOfStock}
                  onClick={() => onCapacityChange(cap.value)}
                  className={`relative px-4 py-2 rounded-lg border-2 text-sm font-medium transition-all ${
                    selectedCapacity === cap.value 
                      ? 'border-[#C7511F] bg-[#FFF8F0]' 
                      : isOutOfStock 
                        ? 'border-[#DDD] bg-gray-50 text-gray-400 cursor-not-allowed line-through'
                        : 'border-[#DDD] hover:border-[#007185] bg-white'
                  }`}
                >
                  {cap.name}
                  {cap.price && cap.price > price && (
                    <span className="ml-1 text-[#B12704]">+€{(cap.price - price).toFixed(0)}</span>
                  )}
                  {isLowStock && !isOutOfStock && (
                    <span className="absolute -top-2 -right-2 bg-[#CC0C39] text-white text-[10px] px-1 rounded">
                      Stock limité
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Caractéristiques */}
      {product.features.length > 0 && (
        <div className="grid grid-cols-2 gap-3 pt-2">
          {product.features.map((feature) => (
            <div key={feature.id} className="flex items-start gap-2 p-2 bg-[#F7F8F8] rounded-lg">
              <div className="p-1 bg-[#007185]/10 rounded">
                {feature.icon === 'headphones' && <HeadphonesIcon size={18} className="text-[#007185]" />}
                {feature.icon === 'shield' && <Shield size={18} className="text-[#007185]" />}
                {feature.icon === 'battery' && <Zap size={18} className="text-[#007185]" />}
                {feature.icon === 'droplet' && <Package size={18} className="text-[#007185]" />}
              </div>
              <div>
                <p className="text-xs font-medium text-[#0F1111]">{feature.title}</p>
                <p className="text-[10px] text-[#565959]">{feature.desc}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Wishlist */}
      <button
        onClick={() => setWishlist(!wishlist)}
        className="flex items-center gap-2 text-sm text-[#007185] hover:text-[#C7511F] transition-colors"
      >
        <Heart 
          size={18} 
          fill={wishlist ? '#C7511F' : 'transparent'} 
          stroke={wishlist ? '#C7511F' : '#007185'}
        />
        {wishlist ? 'Ajouté à la liste d\'envies' : 'Ajouter à la liste d\'envies'}
      </button>
    </div>
  )
}

// ==================== BUY BOX ====================
function BuyBox({
  product,
  price,
  stock,
  onAddToCart
}: {
  product: Product
  price: number
  stock: number
  onAddToCart: () => void
}) {
  const [quantity, setQuantity] = useState(1)
  const [showToast, setShowToast] = useState(false)

  const handleQuantityChange = (value: number) => {
    const newValue = Math.max(1, Math.min(value, stock))
    setQuantity(newValue)
  }

  const handleAddToCart = () => {
    setShowToast(true)
    onAddToCart()
    setTimeout(() => setShowToast(false), 3000)
  }

  const getStockStatus = () => {
    if (stock === 0) return { text: 'Actuellement indisponible', color: 'text-[#B12704]', inStock: false }
    if (stock < 5) return { text: `Plus que ${stock} en stock - commandez vite !`, color: 'text-[#B12704]', inStock: true }
    return { text: 'En stock', color: 'text-[#067D62]', inStock: true }
  }

  const stockStatus = getStockStatus()

  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)
  const standardDelivery = new Date(today)
  standardDelivery.setDate(standardDelivery.getDate() + 3)

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })
  }

  return (
    <>
      {showToast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-[#067D62] text-white px-4 py-2 rounded-lg shadow-lg z-50 flex items-center gap-2 animate-slideDown">
          <Check size={18} />
          Ajouté au panier ✓
        </div>
      )}

      <div className="bg-white border border-[#D5D9D9] rounded-xl p-4 space-y-4 shadow-sm">
        {/* Prix */}
        <div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl text-[#B12704] font-normal">
              <span className="text-base align-top">€</span>{price.toFixed(2)}
            </span>
          </div>
          {product.originalPrice && product.originalPrice > price && (
            <p className="text-sm text-[#565959]">
              Prix conseillé : <span className="line-through">€{product.originalPrice.toFixed(2)}</span>
            </p>
          )}
        </div>

        {/* Livraison */}
        <div className="space-y-3 text-sm">
          <div className="flex items-start gap-2">
            <MapPin size={16} className="text-[#565959] mt-0.5 shrink-0" />
            <div>
              <span className="text-[#565959]">Livrer à </span>
              <span className="text-[#007185] hover:text-[#C7511F] cursor-pointer underline">Paris</span>
            </div>
          </div>

          {stockStatus.inStock && (
            <>
              <div className="flex items-start gap-2 bg-[#F7F8F8] p-2 rounded-lg">
                <Zap size={16} className="text-[#00A8E1] mt-0.5 shrink-0" />
                <div>
                  <p className="text-[#067D62] font-bold">Livraison demain {formatDate(tomorrow)}</p>
                  <p className="text-xs text-[#565959]">Commandez rapidement</p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Truck size={16} className="text-[#565959] mt-0.5 shrink-0" />
                <div>
                  <p className="font-medium">Livraison gratuite</p>
                  <p className="text-xs text-[#565959]">Reçu le {formatDate(standardDelivery)}</p>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Stock */}
        <div className="flex items-center gap-2">
          <Package size={16} className={stockStatus.color} />
          <span className={`text-sm font-medium ${stockStatus.color}`}>
            {stockStatus.text}
          </span>
        </div>

        {/* Quantité */}
        {stockStatus.inStock && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-[#0F1111]">Qté :</span>
            <div className="flex items-center border border-[#D5D9D9] rounded-lg overflow-hidden">
              <button
                onClick={() => handleQuantityChange(quantity - 1)}
                disabled={quantity <= 1}
                className="p-2 hover:bg-[#F7F8F8] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Minus size={14} />
              </button>
              <input
                type="number"
                value={quantity}
                onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                className="w-12 text-center border-x border-[#D5D9D9] py-1 text-sm focus:outline-none"
                min={1}
                max={stock}
              />
              <button
                onClick={() => handleQuantityChange(quantity + 1)}
                disabled={quantity >= stock}
                className="p-2 hover:bg-[#F7F8F8] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Plus size={14} />
              </button>
            </div>
            <span className="text-xs text-[#565959]">({stock} disponibles)</span>
          </div>
        )}

        {/* Boutons */}
        {stockStatus.inStock && (
          <div className="space-y-2">
            <button
              onClick={handleAddToCart}
              className="w-full py-2.5 px-4 bg-[#FFD814] hover:bg-[#F7CA00] text-[#111] font-medium rounded-full transition-all active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <ShoppingCart size={18} />
              Ajouter au panier
            </button>
            <button className="w-full py-2.5 px-4 bg-[#FFA41C] hover:bg-[#FA8900] text-[#111] font-medium rounded-full transition-all active:scale-[0.98] flex items-center justify-center gap-2">
              <Zap size={18} />
              Acheter maintenant
            </button>
          </div>
        )}

        {!stockStatus.inStock && (
          <p className="text-sm text-[#565959] text-center py-2">
            Nous vous informerons quand cet article sera disponible.
          </p>
        )}

        {/* Vendeur */}
        <div className="text-xs text-[#565959] border-t border-[#DDD] pt-3 space-y-1">
          <p><span className="font-medium">Vendu par</span> {product.brand} Store</p>
        </div>

        {/* Garanties */}
        <div className="flex flex-wrap gap-2 text-xs border-t border-[#DDD] pt-3">
          <div className="flex items-center gap-1 text-[#565959]">
            <Shield size={14} className="text-[#067D62]" />
            <span>Garantie 2 ans</span>
          </div>
          <div className="flex items-center gap-1 text-[#565959]">
            <RotateCcw size={14} className="text-[#067D62]" />
            <span>Retour 30 jours</span>
          </div>
        </div>
      </div>
    </>
  )
}

// ==================== ONGLETS ====================
function ProductTabs({ activeTab, setActiveTab }: { activeTab: string; setActiveTab: (tab: string) => void }) {
  const tabs = [
    { id: 'specs', label: 'Spécifications' },
    { id: 'details', label: 'Détails' },
    { id: 'reviews', label: 'Avis Clients' },
    { id: 'related', label: 'Produits Liés' },
  ]

  return (
    <div className="border-b border-[#DDD] sticky top-0 bg-white z-10">
      <div className="flex gap-1 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-3 text-sm font-medium whitespace-nowrap transition-all relative ${
              activeTab === tab.id ? 'text-[#0F1111]' : 'text-[#565959] hover:text-[#007185]'
            }`}
          >
            {tab.label}
            {activeTab === tab.id && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#C7511F]" />
            )}
          </button>
        ))}
      </div>
    </div>
  )
}

// ==================== CONTENU ONGLETS ====================
function TabContent({ product, activeTab }: { product: Product; activeTab: string }) {
  const [helpfulReviews, setHelpfulReviews] = useState<string[]>([])
  const relatedRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  const checkScrollButtons = useCallback(() => {
    if (relatedRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = relatedRef.current
      setCanScrollLeft(scrollLeft > 0)
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10)
    }
  }, [])

  useEffect(() => {
    checkScrollButtons()
    const ref = relatedRef.current
    if (ref) {
      ref.addEventListener('scroll', checkScrollButtons)
      return () => ref.removeEventListener('scroll', checkScrollButtons)
    }
  }, [checkScrollButtons, activeTab])

  const scrollRelated = (direction: 'left' | 'right') => {
    if (relatedRef.current) {
      const scrollAmount = 250
      relatedRef.current.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' })
    }
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'specs':
        return (
          <div className="py-4">
            <h3 className="text-lg font-medium text-[#0F1111] mb-4">Spécifications Techniques</h3>
            {product.specifications.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <tbody>
                    {product.specifications.map((spec, i) => (
                      <tr key={spec.id} className={i % 2 === 0 ? 'bg-[#F7F8F8]' : 'bg-white'}>
                        <td className="py-3 px-4 text-[#565959] font-medium w-1/3">{spec.name}</td>
                        <td className="py-3 px-4 text-[#0F1111]">{spec.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-[#565959]">Aucune spécification disponible</p>
            )}
          </div>
        )

      case 'details':
        return (
          <div className="py-4 space-y-6">
            <div className="bg-[#F7F8F8] p-6 rounded-lg">
              <h3 className="text-lg font-medium text-[#0F1111] mb-4">Ce qui rend ce produit unique</h3>
              {product.features.length > 0 ? (
                <div className="grid md:grid-cols-2 gap-4">
                  {product.features.map((feature) => (
                    <div key={feature.id} className="flex gap-3">
                      <div className="p-2 bg-[#007185]/10 rounded-lg h-fit">
                        {feature.icon === 'headphones' && <HeadphonesIcon className="text-[#007185]" size={20} />}
                        {feature.icon === 'shield' && <Shield className="text-[#007185]" size={20} />}
                        {feature.icon === 'battery' && <Zap className="text-[#007185]" size={20} />}
                        {feature.icon === 'droplet' && <Package className="text-[#007185]" size={20} />}
                      </div>
                      <div>
                        <h4 className="font-medium text-[#0F1111]">{feature.title}</h4>
                        <p className="text-sm text-[#565959]">{feature.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[#565959]">Aucune caractéristique spéciale disponible</p>
              )}
            </div>

            {product.description && (
              <div className="prose prose-sm max-w-none text-[#0F1111]">
                <h4 className="font-medium">Description du produit</h4>
                <p className="text-[#565959]">{product.description}</p>
              </div>
            )}
          </div>
        )

      case 'reviews':
        return (
          <div className="py-4" id="reviews">
            <div className="grid md:grid-cols-[280px_1fr] gap-6">
              <div className="bg-[#F7F8F8] p-4 rounded-lg h-fit">
                <div className="text-center mb-4">
                  <div className="text-4xl font-bold text-[#0F1111]">{product.rating}</div>
                  <StarRating rating={product.rating} size={20} />
                  <p className="text-sm text-[#565959] mt-1">{product.totalRatings.toLocaleString('fr-FR')} évaluations</p>
                </div>
                <div className="space-y-2">
                  {[5, 4, 3, 2, 1].map((stars) => {
                    const percentage = product.reviews.length > 0 
                      ? Math.round((product.reviews.filter(r => r.rating === stars).length / product.reviews.length) * 100)
                      : 0
                    return (
                      <div key={stars} className="flex items-center gap-2 text-sm">
                        <span className="w-8 text-[#007185]">{stars} ★</span>
                        <div className="flex-1 h-4 bg-[#DDD] rounded-full overflow-hidden">
                          <div className="h-full bg-[#FFA41C] rounded-full" style={{ width: `${percentage}%` }} />
                        </div>
                        <span className="w-8 text-[#565959] text-right">{percentage}%</span>
                      </div>
                    )
                  })}
                </div>
              </div>

              <div className="space-y-4">
                {product.reviews.length > 0 ? (
                  product.reviews.map((review) => (
                    <div key={review.id} className="border-b border-[#DDD] pb-4">
                      <div className="flex items-center gap-2 mb-2">
                        {review.avatar && (
                          <SafeImage src={review.avatar} alt={review.author} className="w-10 h-10 rounded-full" fallbackClassName="w-10 h-10 rounded-full" />
                        )}
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-[#0F1111]">{review.author}</span>
                            {review.verified && (
                              <span className="text-xs text-[#067D62] flex items-center gap-1">
                                <BadgeCheck size={12} />
                                Achat vérifié
                              </span>
                            )}
                          </div>
                          <StarRating rating={review.rating} size={12} />
                        </div>
                      </div>
                      <h4 className="font-medium text-[#0F1111] mb-1">{review.title}</h4>
                      <p className="text-sm text-[#565959] mb-2">{review.content}</p>
                      <p className="text-xs text-[#565959] mb-2">Publié le {review.date}</p>
                      <button
                        onClick={() => setHelpfulReviews(prev => 
                          prev.includes(review.id) ? prev.filter(id => id !== review.id) : [...prev, review.id]
                        )}
                        className={`flex items-center gap-1 text-xs px-3 py-1 border rounded-full transition-colors ${
                          helpfulReviews.includes(review.id)
                            ? 'border-[#067D62] text-[#067D62] bg-[#067D62]/10'
                            : 'border-[#DDD] text-[#565959] hover:border-[#007185]'
                        }`}
                      >
                        <ThumbsUp size={12} fill={helpfulReviews.includes(review.id) ? '#067D62' : 'transparent'} />
                        Utile ({helpfulReviews.includes(review.id) ? review.helpful + 1 : review.helpful})
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="text-[#565959]">Aucun avis pour ce produit</p>
                )}
              </div>
            </div>
          </div>
        )

      case 'related':
        return (
          <div className="py-4 relative">
            <h3 className="text-lg font-medium text-[#0F1111] mb-4">Produits fréquemment achetés ensemble</h3>
            
            {canScrollLeft && (
              <button
                onClick={() => scrollRelated('left')}
                className="absolute left-0 top-1/2 z-10 bg-white shadow-lg rounded-full p-2 hover:bg-[#F7F8F8] transition-colors"
                style={{ transform: 'translateY(-50%)' }}
              >
                <ChevronLeft size={24} />
              </button>
            )}
            {canScrollRight && product.relatedProducts.length > 3 && (
              <button
                onClick={() => scrollRelated('right')}
                className="absolute right-0 top-1/2 z-10 bg-white shadow-lg rounded-full p-2 hover:bg-[#F7F8F8] transition-colors"
                style={{ transform: 'translateY(-50%)' }}
              >
                <ChevronRight size={24} />
              </button>
            )}

            {product.relatedProducts.length > 0 ? (
              <div ref={relatedRef} className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                {product.relatedProducts.map((rp) => (
                  <div key={rp.id} className="min-w-[180px] bg-white border border-[#DDD] rounded-lg p-3 hover:shadow-md transition-shadow cursor-pointer group">
                    <div className="w-full aspect-square rounded mb-2 overflow-hidden">
                      <SafeImage src={rp.image} alt={rp.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" fallbackClassName="w-full h-full" />
                    </div>
                    <h4 className="text-sm text-[#0F1111] line-clamp-2 mb-1 group-hover:text-[#C7511F]">{rp.title}</h4>
                    <div className="flex items-center gap-1 mb-1">
                      <StarRating rating={rp.rating} size={10} />
                      <span className="text-xs text-[#007185]">{rp.reviews.toLocaleString('fr-FR')}</span>
                    </div>
                    <p className="text-lg text-[#B12704]">€{rp.price.toFixed(2)}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[#565959]">Aucun produit lié disponible</p>
            )}
          </div>
        )

      default:
        return null
    }
  }

  return <div className="transition-all duration-300 opacity-100 transform translate-y-0">{renderContent()}</div>
}

// ==================== APRÈS-VENTE ====================
function AfterSalesService() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null)

  const services = [
    { icon: <RotateCcw size={20} />, title: 'Retour sous 30 jours', description: 'Retour gratuit sous 30 jours sans justification. Remboursement intégral ou échange.' },
    { icon: <BadgeCheck size={20} />, title: 'Authenticité garantie', description: 'Produit 100% authentique vendu et expédié par notre boutique officielle.' },
    { icon: <Shield size={20} />, title: 'Garantie 2 ans', description: 'Garantie constructeur de 2 ans couvrant tous les défauts de fabrication.' },
    { icon: <Zap size={20} />, title: 'Remboursement express', description: 'Remboursement sous 24h après réception et vérification du retour.' },
    { icon: <Package size={20} />, title: 'Assurance livraison', description: 'Votre colis est assuré contre la perte et les dommages pendant le transport.' }
  ]

  return (
    <div className="bg-[#F7F8F8] rounded-lg p-4 mt-6">
      <h3 className="font-medium text-[#0F1111] mb-4">Nos garanties</h3>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {services.map((service, index) => (
          <div
            key={index}
            className="bg-white border border-[#DDD] rounded-lg p-3 cursor-pointer hover:border-[#007185] transition-colors"
            onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
          >
            <div className="flex flex-col items-center text-center gap-2">
              <div className="p-2 bg-[#067D62]/10 rounded-full text-[#067D62]">{service.icon}</div>
              <span className="text-xs font-medium text-[#0F1111]">{service.title}</span>
            </div>
            {expandedIndex === index && (
              <p className="text-xs text-[#565959] mt-2 text-center animate-fadeIn">{service.description}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

// ==================== FOOTER ====================
function Footer({ relatedProducts }: { relatedProducts: RelatedProduct[] }) {
  return (
    <footer className="bg-[#232F3E] text-white mt-8">
      {relatedProducts.length > 0 && (
        <div className="py-6 px-4 border-b border-white/10">
          <h3 className="text-sm font-medium mb-4">Les clients ayant consulté cet article ont également regardé</h3>
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
            {relatedProducts.slice(0, 5).map((product) => (
              <div key={product.id} className="min-w-[120px] text-center cursor-pointer group">
                <div className="w-24 h-24 mx-auto rounded overflow-hidden">
                  <SafeImage src={product.image} alt={product.title} className="w-full h-full object-cover group-hover:opacity-80 transition-opacity" fallbackClassName="w-full h-full" />
                </div>
                <p className="text-xs mt-2 line-clamp-2 group-hover:underline">{product.title}</p>
                <p className="text-sm font-bold">€{product.price.toFixed(2)}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="py-6 px-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
        <div>
          <h4 className="font-bold mb-3">Service Client</h4>
          <ul className="space-y-2 text-white/70">
            <li className="hover:underline cursor-pointer">Centre d'aide</li>
            <li className="hover:underline cursor-pointer">Suivi de commande</li>
            <li className="hover:underline cursor-pointer">Retours et remboursements</li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-3">À propos</h4>
          <ul className="space-y-2 text-white/70">
            <li className="hover:underline cursor-pointer">Qui sommes-nous</li>
            <li className="hover:underline cursor-pointer">Carrières</li>
            <li className="hover:underline cursor-pointer">Presse</li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-3">Paiement sécurisé</h4>
          <ul className="space-y-2 text-white/70">
            <li className="hover:underline cursor-pointer">Modes de paiement</li>
            <li className="hover:underline cursor-pointer">Paiement échelonné</li>
            <li className="hover:underline cursor-pointer">Cartes cadeaux</li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-3">Légal</h4>
          <ul className="space-y-2 text-white/70">
            <li className="hover:underline cursor-pointer">Conditions d'utilisation</li>
            <li className="hover:underline cursor-pointer">Politique de confidentialité</li>
            <li className="hover:underline cursor-pointer">Mentions légales</li>
          </ul>
        </div>
      </div>

      <div className="py-4 px-4 border-t border-white/10 text-center text-sm text-white/60">
        <div className="flex items-center justify-center gap-2 mb-2">
          <img src="/logo.svg" alt="Logo" className="h-6 w-auto brightness-0 invert" />
        </div>
        <p>© 2026 - Développé par ABDOULAHI</p>
      </div>
    </footer>
  )
}

// ==================== PANNEAU ADMIN ====================
function AdminPanel({
  isOpen,
  onClose,
  onSave,
  editingProduct,
  onRefresh
}: {
  isOpen: boolean
  onClose: () => void
  onSave: () => void
  editingProduct: Product | null
  onRefresh: () => void
}) {
  const [formData, setFormData] = useState({
    title: '',
    brand: '',
    subtitle: '',
    price: '',
    originalPrice: '',
    discount: '',
    stock: '',
    description: ''
  })
  const [images, setImages] = useState<string[]>([''])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (editingProduct) {
      setFormData({
        title: editingProduct.title,
        brand: editingProduct.brand,
        subtitle: editingProduct.subtitle || '',
        price: editingProduct.price.toString(),
        originalPrice: editingProduct.originalPrice?.toString() || '',
        discount: editingProduct.discount?.toString() || '',
        stock: editingProduct.stock.toString(),
        description: editingProduct.description || ''
      })
      setImages(editingProduct.images.map(i => i.url))
    } else {
      setFormData({ title: '', brand: '', subtitle: '', price: '', originalPrice: '', discount: '', stock: '', description: '' })
      setImages([''])
    }
  }, [editingProduct])

  const handleSave = async () => {
    setLoading(true)
    try {
      const productData = {
        ...formData,
        price: parseFloat(formData.price) || 0,
        originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : null,
        discount: formData.discount ? parseInt(formData.discount) : null,
        stock: parseInt(formData.stock) || 0,
        images: images.filter(url => url.trim()).map((url, i) => ({ url, alt: `Image ${i + 1}`, order: i })),
        variants: [],
        specifications: [],
        features: [],
        reviews: [],
        relatedProducts: [],
        rating: editingProduct?.rating || 4.5,
        totalRatings: editingProduct?.totalRatings || 0,
        prime: true,
        freeShipping: true,
        flashSale: false,
        isNew: true
      }

      if (editingProduct) {
        await fetch(`/api/products/${editingProduct.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(productData)
        })
      } else {
        await fetch('/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(productData)
        })
      }

      onSave()
      onRefresh()
    } catch (error) {
      console.error('Error saving product:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-[#DDD] p-4 flex items-center justify-between">
          <h2 className="text-lg font-bold">{editingProduct ? 'Modifier le produit' : 'Ajouter un produit'}</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <X size={20} />
          </button>
        </div>

        <div className="p-4 space-y-4">
          {/* Titre */}
          <div>
            <label className="block text-sm font-medium text-[#0F1111] mb-1">Titre du produit *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full border border-[#DDD] rounded-lg px-3 py-2 focus:outline-none focus:border-[#007185]"
              placeholder="Ex: Écouteurs Sans Fil Bluetooth 5.3"
            />
          </div>

          {/* Marque */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#0F1111] mb-1">Marque *</label>
              <input
                type="text"
                value={formData.brand}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                className="w-full border border-[#DDD] rounded-lg px-3 py-2 focus:outline-none focus:border-[#007185]"
                placeholder="Ex: SoundMax"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#0F1111] mb-1">Stock</label>
              <input
                type="number"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                className="w-full border border-[#DDD] rounded-lg px-3 py-2 focus:outline-none focus:border-[#007185]"
                placeholder="Ex: 50"
              />
            </div>
          </div>

          {/* Sous-titre */}
          <div>
            <label className="block text-sm font-medium text-[#0F1111] mb-1">Sous-titre</label>
            <input
              type="text"
              value={formData.subtitle}
              onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
              className="w-full border border-[#DDD] rounded-lg px-3 py-2 focus:outline-none focus:border-[#007185]"
              placeholder="Caractéristiques principales..."
            />
          </div>

          {/* Prix */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#0F1111] mb-1">Prix (€) *</label>
              <input
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full border border-[#DDD] rounded-lg px-3 py-2 focus:outline-none focus:border-[#007185]"
                placeholder="89.99"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#0F1111] mb-1">Prix original (€)</label>
              <input
                type="number"
                step="0.01"
                value={formData.originalPrice}
                onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                className="w-full border border-[#DDD] rounded-lg px-3 py-2 focus:outline-none focus:border-[#007185]"
                placeholder="139.99"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#0F1111] mb-1">Remise (%)</label>
              <input
                type="number"
                value={formData.discount}
                onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                className="w-full border border-[#DDD] rounded-lg px-3 py-2 focus:outline-none focus:border-[#007185]"
                placeholder="35"
              />
            </div>
          </div>

          {/* Images */}
          <div>
            <label className="block text-sm font-medium text-[#0F1111] mb-1">Images (URLs)</label>
            {images.map((url, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={url}
                  onChange={(e) => {
                    const newImages = [...images]
                    newImages[index] = e.target.value
                    setImages(newImages)
                  }}
                  className="flex-1 border border-[#DDD] rounded-lg px-3 py-2 focus:outline-none focus:border-[#007185]"
                  placeholder="https://exemple.com/image.jpg"
                />
                {images.length > 1 && (
                  <button
                    onClick={() => setImages(images.filter((_, i) => i !== index))}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 size={20} />
                  </button>
                )}
              </div>
            ))}
            <button
              onClick={() => setImages([...images, ''])}
              className="text-sm text-[#007185] hover:underline flex items-center gap-1"
            >
              <Plus size={16} /> Ajouter une image
            </button>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-[#0F1111] mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full border border-[#DDD] rounded-lg px-3 py-2 focus:outline-none focus:border-[#007185] min-h-[100px]"
              placeholder="Description détaillée du produit..."
            />
          </div>
        </div>

        <div className="sticky bottom-0 bg-white border-t border-[#DDD] p-4 flex gap-2 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-[#DDD] rounded-lg hover:bg-gray-50 transition-colors"
          >
            Annuler
          </button>
          <button
            onClick={handleSave}
            disabled={loading || !formData.title || !formData.brand || !formData.price}
            className="px-4 py-2 bg-[#FFD814] hover:bg-[#F7CA00] rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
            {loading ? 'Enregistrement...' : 'Enregistrer'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ==================== LISTE PRODUITS (ADMIN) ====================
function ProductList({
  products,
  onEdit,
  onDelete,
  onSelect
}: {
  products: Product[]
  onEdit: (product: Product) => void
  onDelete: (id: string) => void
  onSelect: (product: Product) => void
}) {
  return (
    <div className="bg-white rounded-xl border border-[#DDD] overflow-hidden">
      <div className="p-4 border-b border-[#DDD]">
        <h3 className="font-bold text-[#0F1111]">Vos produits ({products.length})</h3>
      </div>
      {products.length === 0 ? (
        <div className="p-8 text-center text-[#565959]">
          <Package className="mx-auto mb-2" size={48} />
          <p>Aucun produit. Ajoutez votre premier produit !</p>
        </div>
      ) : (
        <div className="divide-y divide-[#DDD] max-h-96 overflow-y-auto">
          {products.map((product) => (
            <div key={product.id} className="p-3 flex items-center gap-3 hover:bg-[#F7F8F8] transition-colors">
              <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 bg-gray-100">
                {product.images[0] && (
                  <SafeImage src={product.images[0].url} alt={product.title} className="w-full h-full object-cover" fallbackClassName="w-full h-full" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-[#0F1111] line-clamp-1">{product.title}</h4>
                <p className="text-sm text-[#B12704]">€{product.price.toFixed(2)}</p>
                <p className="text-xs text-[#565959]">{product.brand} • Stock: {product.stock}</p>
              </div>
              <div className="flex gap-1 shrink-0">
                <button
                  onClick={() => onSelect(product)}
                  className="p-2 text-[#007185] hover:bg-[#007185]/10 rounded-lg transition-colors"
                  title="Afficher"
                >
                  <ChevronRight size={18} />
                </button>
                <button
                  onClick={() => onEdit(product)}
                  className="p-2 text-[#565959] hover:bg-gray-100 rounded-lg transition-colors"
                  title="Modifier"
                >
                  <Edit size={18} />
                </button>
                <button
                  onClick={() => onDelete(product.id)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  title="Supprimer"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ==================== PAGE PRINCIPALE ====================
export default function ProductPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [showAdmin, setShowAdmin] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)

  const [selectedColor, setSelectedColor] = useState('')
  const [selectedCapacity, setSelectedCapacity] = useState('')
  const [activeTab, setActiveTab] = useState('specs')
  const [cartCount, setCartCount] = useState(0)
  
  // Ref pour éviter le seed en boucle
  const seedAttemptedRef = useRef(false)
  const initializedRef = useRef(false)

  // Charger les produits
  const loadProducts = useCallback(async () => {
    try {
      const res = await fetch('/api/products')
      const data = await res.json()
      setProducts(data.products || [])
      
      if (data.products && data.products.length > 0) {
        const product = data.products[0]
        setCurrentProduct(product)
        const colors = product.variants.filter((v: ProductVariant) => v.type === 'color')
        const capacities = product.variants.filter((v: ProductVariant) => v.type === 'capacity')
        if (colors.length > 0) setSelectedColor(colors[0].value)
        if (capacities.length > 0) setSelectedCapacity(capacities[0].value)
      }
      return data.products || []
    } catch (error) {
      console.error('Error loading products:', error)
      return []
    } finally {
      setLoading(false)
    }
  }, [])

  // Initialisation au montage uniquement
  useEffect(() => {
    if (initializedRef.current) return
    initializedRef.current = true
    
    const init = async () => {
      const prods = await loadProducts()
      // Si aucun produit et pas encore tenté de seed
      if (prods.length === 0 && !seedAttemptedRef.current) {
        seedAttemptedRef.current = true
        try {
          await fetch('/api/seed', { method: 'POST' })
          await loadProducts()
        } catch (error) {
          console.error('Error seeding:', error)
        }
      }
    }
    init()
  }, [loadProducts])

  // Calcul SKU actuel
  const getCurrentSku = () => {
    if (!currentProduct) return { price: 0, stock: 0 }
    const color = currentProduct.variants.find(v => v.type === 'color' && v.value === selectedColor)
    const capacity = currentProduct.variants.find(v => v.type === 'capacity' && v.value === selectedCapacity)
    return {
      price: capacity?.price || currentProduct.price,
      stock: Math.min(color?.stock || currentProduct.stock, capacity?.stock || currentProduct.stock),
      imageIndex: color?.imageIndex || 0
    }
  }

  const currentSku = getCurrentSku()

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) return
    try {
      await fetch(`/api/products/${id}`, { method: 'DELETE' })
      loadProducts()
      if (currentProduct?.id === id) {
        setCurrentProduct(products[0] || null)
      }
    } catch (error) {
      console.error('Error deleting product:', error)
    }
  }

  const handleSelectProduct = (product: Product) => {
    setCurrentProduct(product)
    const colors = product.variants.filter(v => v.type === 'color')
    const capacities = product.variants.filter(v => v.type === 'capacity')
    if (colors.length > 0) setSelectedColor(colors[0].value)
    if (capacities.length > 0) setSelectedCapacity(capacities[0].value)
    setShowAdmin(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="animate-spin text-[#007185]" size={48} />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Header */}
      <header className="bg-[#131921] text-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-2 flex items-center gap-4">
          <a href="/" className="flex items-center gap-1 shrink-0">
            <img src="/logo.svg" alt="Logo" className="h-8 w-auto brightness-0 invert" />
          </a>

          <div className="flex-1 max-w-2xl">
            <div className="flex">
              <select className="px-3 py-2 bg-[#E6E6E6] text-[#0F1111] text-sm rounded-l-lg border-r border-[#CDCDCD] focus:outline-none">
                <option>Toutes catégories</option>
                <option>Électronique</option>
                <option>Audio</option>
              </select>
              <input
                type="text"
                placeholder="Rechercher..."
                className="flex-1 px-4 py-2 text-[#0F1111] focus:outline-none"
              />
              <button className="px-4 py-2 bg-[#FEBD69] hover:bg-[#F3A847] rounded-r-lg transition-colors">
                <svg className="w-5 h-5 text-[#131921]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </div>

          <div className="flex items-center gap-4 text-sm">
            <button
              onClick={() => setShowAdmin(!showAdmin)}
              className={`hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors ${showAdmin ? 'bg-[#FFD814] text-[#131921]' : 'hover:bg-white/10'}`}
            >
              <Settings size={18} />
              Admin
            </button>
            <button className="relative hover:opacity-80 transition-opacity">
              <ShoppingCart size={28} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#FFA41C] text-[#131921] text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      <Breadcrumb />

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 py-4">
          {/* Panneau Admin */}
          {showAdmin && (
            <div className="mb-6 bg-[#F7F8F8] rounded-xl p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-[#0F1111]">Panneau d'administration</h2>
                <button
                  onClick={() => {
                    setEditingProduct(null)
                    setShowAddModal(true)
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-[#FFD814] hover:bg-[#F7CA00] rounded-lg font-medium transition-colors"
                >
                  <Plus size={18} />
                  Ajouter un produit
                </button>
              </div>
              <ProductList
                products={products}
                onEdit={(product) => {
                  setEditingProduct(product)
                }}
                onDelete={handleDelete}
                onSelect={handleSelectProduct}
              />
            </div>
          )}

          {currentProduct ? (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                {/* Galerie */}
                <div className="lg:col-span-5">
                  <ImageGallery images={currentProduct.images} />
                </div>

                {/* Infos */}
                <div className="lg:col-span-4">
                  <ProductInfo
                    product={currentProduct}
                    selectedColor={selectedColor}
                    selectedCapacity={selectedCapacity}
                    onColorChange={setSelectedColor}
                    onCapacityChange={setSelectedCapacity}
                    price={currentSku.price}
                    stock={currentSku.stock}
                  />
                </div>

                {/* Buy Box */}
                <div className="lg:col-span-3">
                  <div className="lg:sticky lg:top-20">
                    <BuyBox
                      product={currentProduct}
                      price={currentSku.price}
                      stock={currentSku.stock}
                      onAddToCart={() => setCartCount(prev => prev + 1)}
                    />
                  </div>
                </div>
              </div>

              {/* Onglets */}
              <div className="mt-8 border-t border-[#DDD]">
                <ProductTabs activeTab={activeTab} setActiveTab={setActiveTab} />
                <TabContent product={currentProduct} activeTab={activeTab} />
              </div>

              <AfterSalesService />
            </>
          ) : (
            <div className="text-center py-12">
              <Package className="mx-auto mb-4 text-[#565959]" size={64} />
              <h2 className="text-xl font-bold text-[#0F1111] mb-2">Aucun produit</h2>
              <p className="text-[#565959] mb-4">Ajoutez votre premier produit pour commencer</p>
              <button
                onClick={() => {
                  setEditingProduct(null)
                  setShowAddModal(true)
                }}
                className="px-6 py-3 bg-[#FFD814] hover:bg-[#F7CA00] rounded-lg font-medium"
              >
                Ajouter un produit
              </button>
            </div>
          )}
        </div>
      </main>

      <Footer relatedProducts={currentProduct?.relatedProducts || []} />

      {/* Modal Admin - Uniquement pour ajouter/modifier un produit */}
      <AdminPanel
        isOpen={showAddModal || (showAdmin && editingProduct !== null)}
        onClose={() => {
          setShowAddModal(false)
          setShowAdmin(false)
          setEditingProduct(null)
        }}
        onSave={() => {
          setShowAddModal(false)
          setShowAdmin(false)
          setEditingProduct(null)
        }}
        editingProduct={editingProduct}
        onRefresh={loadProducts}
      />

      {/* Styles */}
      <style jsx global>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translate(-50%, -20px); }
          to { opacity: 1; transform: translate(-50%, 0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-slideDown { animation: slideDown 0.3s ease-out; }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        .line-clamp-1 { display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical; overflow: hidden; }
        .line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
        .line-clamp-3 { display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
      `}</style>
    </div>
  )
}
