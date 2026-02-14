import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

// POST - Seed un produit de démonstration
export async function POST() {
  try {
    // Vérifier s'il y a déjà des produits
    const existingProducts = await db.product.count()
    if (existingProducts > 0) {
      return NextResponse.json({ message: 'Des produits existent déjà', count: existingProducts })
    }

    // Créer le produit de démonstration
    const product = await db.product.create({
      data: {
        title: "Écouteurs Sans Fil Bluetooth 5.3, Casque Audio avec Réduction de Bruit Active, 40H d'Autonomie, Étanche IPX7",
        brand: "SoundMax Pro",
        brandLink: "/brands/soundmax",
        subtitle: "Technologie hybride ANC, Mode transparent, 4 micros pour appels HD, Charge rapide USB-C",
        price: 89.99,
        originalPrice: 139.99,
        discount: 35,
        coupon: 20,
        installment: 7.50,
        rating: 4.7,
        totalRatings: 12847,
        boughtLastMonth: "10K+",
        prime: true,
        freeShipping: true,
        flashSale: true,
        isNew: true,
        stock: 45,
        images: {
          create: [
            { url: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&q=80", alt: "Vue principale", order: 0 },
            { url: "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=800&q=80", alt: "Vue 2", order: 1 },
            { url: "https://images.unsplash.com/photo-1598331668826-20cecc596b86?w=800&q=80", alt: "Vue 3", order: 2 },
            { url: "https://images.unsplash.com/photo-1608156639585-b3a7a6e98d0c?w=800&q=80", alt: "Vue 4", order: 3 },
            { url: "https://images.unsplash.com/photo-1613040809024-b4ef7ba99bc3?w=800&q=80", alt: "Vue 5", order: 4 },
          ]
        },
        variants: {
          create: [
            { type: "color", name: "Noir", value: "black", hex: "#1a1a1a", stock: 45, imageIndex: 0 },
            { type: "color", name: "Blanc", value: "white", hex: "#ffffff", stock: 23, imageIndex: 1 },
            { type: "color", name: "Bleu Marine", value: "navy", hex: "#1e3a5f", stock: 8, imageIndex: 2 },
            { type: "color", name: "Rose", value: "rose", hex: "#f8bbd9", stock: 0, imageIndex: 3 },
            { type: "capacity", name: "Standard (40H)", value: "standard", stock: 50, price: null },
            { type: "capacity", name: "Pro (60H)", value: "pro", stock: 15, price: 119.99 },
            { type: "capacity", name: "Ultra (80H)", value: "ultra", stock: 5, price: 149.99 },
          ]
        },
        specifications: {
          create: [
            { name: "Type", value: "Écouteurs intra-auriculaires True Wireless", order: 0 },
            { name: "Connectivité", value: "Bluetooth 5.3, Portée 15m", order: 1 },
            { name: "Autonomie", value: "40H (écouteurs + boîtier)", order: 2 },
            { name: "Réduction de bruit", value: "ANC Hybride -35dB", order: 3 },
            { name: "Résistance eau", value: "IPX7 (étanche)", order: 4 },
            { name: "Microphones", value: "4 micros ENC pour appels", order: 5 },
            { name: "Compatibilité", value: "iOS, Android, Windows, Mac", order: 6 },
            { name: "Poids", value: "5.4g par écouteur", order: 7 },
            { name: "Charge", value: "USB-C, Charge sans fil Qi", order: 8 },
            { name: "Codecs", value: "AAC, SBC, aptX HD", order: 9 },
          ]
        },
        features: {
          create: [
            { icon: "headphones", title: "Son Haute Fidélité", desc: "Drivers 13mm avec basses profondes", order: 0 },
            { icon: "shield", title: "ANC Hybride", desc: "Réduction active du bruit environnemental", order: 1 },
            { icon: "battery", title: "40H d'Autonomie", desc: "Écoutez toute la semaine sans recharge", order: 2 },
            { icon: "droplet", title: "IPX7 Étanche", desc: "Résistant à l'eau et à la transpiration", order: 3 },
          ]
        },
        reviews: {
          create: [
            {
              author: "Marie D.",
              avatar: "https://i.pravatar.cc/100?img=1",
              rating: 5,
              title: "Excellent rapport qualité-prix !",
              content: "Je suis impressionnée par la qualité sonore et l'efficacité de la réduction de bruit. Les écouteurs sont très confortables et ne tombent pas, même pendant le sport. L'autonomie est remarquable - je les charge une fois par semaine seulement.",
              date: "15 janvier 2025",
              verified: true,
              helpful: 234
            },
            {
              author: "Thomas L.",
              avatar: "https://i.pravatar.cc/100?img=3",
              rating: 4,
              title: "Très bien mais quelques défauts mineurs",
              content: "Dans l'ensemble, très satisfait de mon achat. Le son est excellent et l'ANC fonctionne parfaitement. Le seul bémol : l'application parfois lente à se connecter. Mais pour ce prix, c'est vraiment un excellent choix.",
              date: "10 janvier 2025",
              verified: true,
              helpful: 156
            },
            {
              author: "Sophie M.",
              avatar: "https://i.pravatar.cc/100?img=5",
              rating: 5,
              title: "Parfaits pour le sport !",
              content: "Je les utilise pour la course à pied et ils ne bougent pas. L'étanchéité IPX7 est un vrai plus. Le mode transparent est très utile pour rester conscient de son environnement.",
              date: "5 janvier 2025",
              verified: true,
              helpful: 89
            },
          ]
        },
        relatedProducts: {
          create: [
            { title: "Coque de Protection Rigide", price: 12.99, rating: 4.5, reviews: 2341, image: "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=300&q=80" },
            { title: "Câble USB-C Charge Rapide", price: 8.99, rating: 4.3, reviews: 5678, image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&q=80" },
            { title: "Support Magnétique Voiture", price: 15.99, rating: 4.6, reviews: 1234, image: "https://images.unsplash.com/photo-1600508774634-4e11e34d6e73?w=300&q=80" },
            { title: "Étui en Cuir Premium", price: 24.99, rating: 4.4, reviews: 876, image: "https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=300&q=80" },
            { title: "Chargeur Sans Fil Qi", price: 19.99, rating: 4.7, reviews: 3456, image: "https://images.unsplash.com/photo-1586816879360-004f5b0c51e5?w=300&q=80" },
          ]
        }
      }
    })

    return NextResponse.json({ message: 'Produit de démonstration créé', product })
  } catch (error) {
    console.error('Error seeding product:', error)
    return NextResponse.json({ error: 'Erreur lors de la création du produit de démonstration' }, { status: 500 })
  }
}
