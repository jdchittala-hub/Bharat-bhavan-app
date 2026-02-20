interface MenuItem {
  available: boolean;
  order: number;
  categoryId: string;
  collectionId: string;
  collectionName: string;
  created: string;
  description: string;
  allergens: string[];
  // expand: MenuItem;
  availableDays: JSON;
  coming_soon_text: string;
  id: string;
  image: string[];
  name: string;
  price: number;
  subCategoryId: string;
  ingredients: string;
  making_video_link: string;
  prep_time: string;
  recommended_dishes: string[];
  new_addition: boolean;
  updated: string;
}

interface SubCategory {
  categoryId: string;
  collectionId: string;
  collectionName: string;
  created: string;
  id: string;
  name: string;
  unavailable: boolean;
  unavailableDays: string[];
  order: number;
  updated: string;
}

interface Category {
  collectionId: string;
  collectionName: string;
  created: string;
  id: string;
  image: string;
  name: string;
  unavailable: boolean;
  unavailableDays: string[];
  order: number;
  updated: string;
}

interface TodaySpecial {
  id: string;
  collectionName: string;
  text: string;
  image: string;
  categoryId: string;
  subCategoryId: string;
  foodItemId: string;
  isTextEnabled: boolean;
  timer: number;
}

interface CategorySchedule {
  id: string;
  collectionId: string;
  collectionName: string;
  created: string;
  updated: string;
  category_id: string;
  category_schedule_day: string[];
  start_time: string;
  end_time: string;
  unavailable_text: string;
}

interface Notice {
  id: string;
  collectionId: string;
  collectionName: string;
  created: string;
  updated: string;
  content: string;
  isActive: boolean;
  timer: number;
}

interface SubcategorySchedule {
  id: string;
  collectionId: string;
  collectionName: string;
  created: string;
  updated: string;
  sub_category_id: string;
  sub_category_schedule_day: string[];
  start_time: string;
  end_time: string;
  unavailable_text: string;
}

interface BackgroundWrapperImage {
  id: string;
  collectionId: string;
  collectionName: string;
  created: string;
  updated: string;
  image: string;
  order: number;
}

interface RestaurantImage {
  id: string;
  collectionId: string;
  collectionName: string;
  created: string;
  updated: string;
  images: string[];
}

interface Allergen {
  id: string;
  collectionId: string;
  collectionName: string;
  name: string;
  image: string;
  food_items: MenuItem[];
}
