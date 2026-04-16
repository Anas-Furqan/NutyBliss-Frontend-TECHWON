export type NutyProduct = {
  id: string;
  slug: string;
  name: string;
  category: 'Organic' | 'Classic' | 'Crunchy';
  price: number;
  image: string;
  labelImage: string;
  tagline: string;
  description: string;
  ingredients: string[];
  nutrition: { key: string; value: string }[];
};

export const nutyProducts: NutyProduct[] = [
  {
    id: 'nuty-organic-smooth',
    slug: 'organic-smooth',
    name: 'Organic Smooth Jar',
    category: 'Organic',
    price: 1690,
    image: '/images/product (1).jpeg',
    labelImage: '/images/logo.jpeg',
    tagline: 'Small-batch roasted with velvet finish',
    description: 'Creamy mouthfeel and clean energy built from premium peanuts and cacao trace notes.',
    ingredients: ['Organic peanuts', 'Cold-pressed peanut oil', 'Cocoa nib essence', 'Sea salt'],
    nutrition: [
      { key: 'Serving', value: '32g' },
      { key: 'Calories', value: '190 kcal' },
      { key: 'Protein', value: '8g' },
      { key: 'Carbs', value: '6g' },
      { key: 'Fat', value: '15g' },
    ],
  },
  {
    id: 'nuty-classic-roast',
    slug: 'classic-roast',
    name: 'Classic Roast Jar',
    category: 'Classic',
    price: 1490,
    image: '/images/product (2).jpeg',
    labelImage: '/images/logo.jpeg',
    tagline: 'Balanced roast for daily ritual',
    description: 'Signature roast profile with naturally sweet peanut finish and spreadable texture.',
    ingredients: ['Roasted peanuts', 'Peanut oil', 'Natural cane sugar', 'Sea salt'],
    nutrition: [
      { key: 'Serving', value: '32g' },
      { key: 'Calories', value: '185 kcal' },
      { key: 'Protein', value: '7g' },
      { key: 'Carbs', value: '7g' },
      { key: 'Fat', value: '14g' },
    ],
  },
  {
    id: 'nuty-crunchy-bites',
    slug: 'crunchy-bites',
    name: 'Crunchy Bites Jar',
    category: 'Crunchy',
    price: 1790,
    image: '/images/product (3).jpeg',
    labelImage: '/images/logo.jpeg',
    tagline: 'Chunky texture with toasted bites',
    description: 'Toasted peanut shards folded into rich cream for elevated crunch in every spoon.',
    ingredients: ['Roasted peanuts', 'Toasted peanut chunks', 'Natural cocoa dust', 'Sea salt'],
    nutrition: [
      { key: 'Serving', value: '32g' },
      { key: 'Calories', value: '195 kcal' },
      { key: 'Protein', value: '8g' },
      { key: 'Carbs', value: '6g' },
      { key: 'Fat', value: '16g' },
    ],
  },
  {
    id: 'nuty-organic-cacao',
    slug: 'organic-cacao',
    name: 'Organic Cacao Swirl',
    category: 'Organic',
    price: 1890,
    image: '/images/product (4).jpeg',
    labelImage: '/images/logo.jpeg',
    tagline: 'Organic peanut and dark cocoa blend',
    description: 'Layered cocoa ribbons and creamy organic peanuts in an indulgent but clean formula.',
    ingredients: ['Organic peanuts', 'Raw cacao', 'Peanut oil', 'Mineral salt'],
    nutrition: [
      { key: 'Serving', value: '32g' },
      { key: 'Calories', value: '200 kcal' },
      { key: 'Protein', value: '8g' },
      { key: 'Carbs', value: '7g' },
      { key: 'Fat', value: '16g' },
    ],
  },
  {
    id: 'nuty-classic-lite',
    slug: 'classic-lite',
    name: 'Classic Lite Jar',
    category: 'Classic',
    price: 1390,
    image: '/images/product (5).jpeg',
    labelImage: '/images/logo.jpeg',
    tagline: 'Light roast and clean everyday spread',
    description: 'A lighter roast profile for breakfast bowls, toast layering, and smoothie depth.',
    ingredients: ['Roasted peanuts', 'Peanut oil', 'Sea salt'],
    nutrition: [
      { key: 'Serving', value: '32g' },
      { key: 'Calories', value: '175 kcal' },
      { key: 'Protein', value: '7g' },
      { key: 'Carbs', value: '5g' },
      { key: 'Fat', value: '14g' },
    ],
  },
];

export const deliverySteps = ['Order Placed', 'Packed', 'In Transit', 'Out for Delivery', 'Delivered'];
