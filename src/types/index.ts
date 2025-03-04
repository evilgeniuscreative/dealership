interface Car {
  id: number;
  make: string;
  model: string;
  year: number;
  color: string;
  doors: number;
  engineDisplacement: string;
  horsepower: number;
  mileage: number;
  price: number;
  summary: string;
  description: string;
  imageUrl: string;
}

// CarouselImageInput and CarouselImage are now imported from './carousel'

interface SearchFilters {
  make?: string;
  model?: string;
  minPrice?: number;
  maxPrice?: number;
  maxMileage?: number;
}

interface PageHero {
  title: string;
  subtitle?: string;
  imageUrl: string;
  height: number;
}

interface ContactForm {
  name: string;
  email: string;
  phone?: string;
  message: string;
}

// Import and re-export carousel types
export * from './carousel';

export type {
  Car,
  SearchFilters,
  PageHero,
  ContactForm
};
