import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

// GET - Récupérer un produit par ID
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const product = await db.product.findUnique({
      where: { id },
      include: {
        images: { orderBy: { order: 'asc' } },
        variants: true,
        specifications: { orderBy: { order: 'asc' } },
        features: { orderBy: { order: 'asc' } },
        reviews: true,
        relatedProducts: true
      }
    })

    if (!product) {
      return NextResponse.json({ error: 'Produit non trouvé' }, { status: 404 })
    }

    return NextResponse.json({ product })
  } catch (error) {
    console.error('Error fetching product:', error)
    return NextResponse.json({ error: 'Erreur lors de la récupération du produit' }, { status: 500 })
  }
}

// PUT - Mettre à jour un produit
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    
    const { 
      title, brand, brandLink, subtitle, description,
      price, originalPrice, discount, coupon, installment,
      rating, totalRatings, boughtLastMonth,
      prime, freeShipping, flashSale, isNew, stock
    } = body

    const product = await db.product.update({
      where: { id },
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
        stock: stock ? parseInt(stock) : 0
      }
    })

    return NextResponse.json({ product })
  } catch (error) {
    console.error('Error updating product:', error)
    return NextResponse.json({ error: 'Erreur lors de la mise à jour du produit' }, { status: 500 })
  }
}

// DELETE - Supprimer un produit
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await db.product.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting product:', error)
    return NextResponse.json({ error: 'Erreur lors de la suppression du produit' }, { status: 500 })
  }
}
