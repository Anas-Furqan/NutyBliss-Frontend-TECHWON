import HeroSlider from '@/components/home/HeroSlider';
import FeatureIcons from '@/components/home/FeatureIcons';
import CategoryCards from '@/components/home/CategoryCards';
import ProductSection from '@/components/home/ProductSection';
import FAQSection from '@/components/home/FAQSection';
import { productsAPI } from '@/lib/api';

async function getProducts() {
  try {
    const [hotSelling, newArrivals, featured] = await Promise.all([
      productsAPI.getAll({ hotSelling: 'true', limit: 4 }),
      productsAPI.getAll({ newArrival: 'true', limit: 4 }),
      productsAPI.getAll({ featured: 'true', limit: 8 }),
    ]);

    return {
      hotSelling: hotSelling.data.products,
      newArrivals: newArrivals.data.products,
      featured: featured.data.products,
    };
  } catch (error) {
    return { hotSelling: [], newArrivals: [], featured: [] };
  }
}

export default async function HomePage() {
  const { hotSelling, newArrivals, featured } = await getProducts();

  return (
    <>
      <HeroSlider />
      <FeatureIcons />
      <CategoryCards />

      <ProductSection
        title="Hot Selling"
        subtitle="Our most popular products"
        products={hotSelling}
        viewAllLink="/products?hotSelling=true"
      />

      <ProductSection
        title="New Arrivals"
        subtitle="Fresh additions to our collection"
        products={newArrivals}
        viewAllLink="/products?newArrival=true"
      />

      {/* CTA Banner */}
      <section className="py-16 bg-primary-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Start Your Healthy Journey?
          </h2>
          <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
            Join thousands of happy customers who have made Nuty Bliss a part of their daily routine.
          </p>
          <a
            href="/products"
            className="inline-block bg-accent-400 text-gray-900 px-8 py-4 rounded-full font-semibold
                     hover:bg-accent-500 transition-colors"
          >
            Shop All Products
          </a>
        </div>
      </section>

      <ProductSection
        title="Featured Products"
        subtitle="Handpicked just for you"
        products={featured}
        viewAllLink="/products?featured=true"
      />

      <FAQSection />

      {/* Newsletter */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
          <p className="text-gray-400 mb-8">
            Subscribe to get special offers, new product launches, and healthy recipes.
          </p>
          <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-6 py-4 rounded-full text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <button
              type="submit"
              className="px-8 py-4 bg-primary-500 rounded-full font-semibold hover:bg-primary-600 transition-colors"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </>
  );
}
