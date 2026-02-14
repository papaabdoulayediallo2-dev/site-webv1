import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

// GET - Récupérer tous les produits
export async function GET() {
  try {
    const products = await db.product.findMany({
      include: {
        images: { orderBy: { order: 'asc' } },
        variants: true,
        specifications: { orderBy: { order: 'asc' } },
        features: { orderBy: { order: 'asc' } },
        reviews: true,
        relatedProducts: true
      },
      orderBy: { createdAt: 'desc' }
    })
    
    return NextResponse.json({ products })
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json({ error: 'Erreur lors de la récupération des produits' }, { status: 500 })
  }
}

// POST - Créer un nouveau produit
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { 
      title, brand, brandLink, subtitle, description,
      price, originalPrice, discount, coupon, installment,
      rating, totalRatings, boughtLastMonth,
      prime, freeShipping, flashSale, isNew, stock,
      images, variants, specifications, features, reviews, relatedProducts
    } = body

    const product = await db.product.create({
      data: {
        title,
        brand,
        brandLink,
        subtitle,
        description,
        price: parseFloat(price),
        originalPrice: originalPrice ? parseFloat(originalPrice) : null,
        discount: discount ? parseInt(discount) : null,
        coupon: coupon ? parseFloat(coupon) : null,
        installment: installment ? parseFloat(installment) : null,
        rating: rating ? parseFloat(rating) : 0,
        totalRatings: totalRatings ? parseInt(totalRatings) : 0,
        boughtLastMonth,
        prime: prime || false,
        freeShipping: freeShipping !== false,
        flashSale: flashSale || false,
        isNew: isNew || false,
        stock: stock ? parseInt(stock) : 0,
        images: {
          create: images?.map((img: { url: string; alt?: string; order?: number }, index: number) => ({
            url: img.url,
            alt: img.alt || '',
            order: img.order ?? index
          })) || []
        },
        variants: {
          create: variants?.map((v: { type: string; name: string; value: string; hex?: string; price?: number; stock?: number; imageIndex?: number }) => ({
            type: v.type,
            name: v.name,
            value: v.value,
            hex: v.hex,
            price: v.price ? parseFloat(v.price) : null,
            stock: v.stock ? parseInt(v.stock) : 0,
            imageIndex: v.imageIndex
          })) || []
        },
        specifications: {
          create: specifications?.map((s: { name: string; value: string }, index: number) => ({
            name: s.name,
            value: s.value,
            order: index
          })) || []
        },
        features: {
          create: features?.map((f: { icon: string; title: string; desc: string }, index: number) => ({
            icon: f.icon,
            title: f.title,
            desc: f.desc,
            order: index
          })) || []
        },
        reviews: {
          create: reviews?.map((r: { author: string; avatar?: string; rating: number; title: string; content: string; date: string; verified?: boolean; helpful?: number }) => ({
            author: r.author,
            avatar: r.avatar,
            rating: r.rating,
            title: r.title,
            content: r.content,
            date: r.date,
            verified: r.verified || false,
            helpful: r.helpful || 0
          })) || []
        },
        relatedProducts: {
          create: relatedProducts?.map((rp: { title: string; price: number; rating: number; reviews: number; image: string }) => ({
            title: rp.title,
            price: parseFloat(rp.price),
            rating: parseFloat(rp.rating),
            reviews: rp.reviews,
            image: rp.image
          })) || []
        }
      },
      include: {
        images: true,
        variants: true,
        specifications: true,
        features: true,
        reviews: true,
        relatedProducts: true
      }
    })

    return NextResponse.json({ product })
  } catch (error) {
    console.error('Error creating product:', error)
    return NextResponse.json({ error: 'Erreur lors de la création du produit' }, { status: 500 })
  }
}
