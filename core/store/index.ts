import {
  fetchNotices,
  fetchSubcategorySchedule,
  fetchRestaurantImages,
  fetchNewAdditionFoodItems,
  fetchBackgroundWrapperImages,
} from '~/core/api';
import { create } from 'zustand';
import { persist, subscribeWithSelector, } from 'zustand/middleware';
import { fetchCategories, fetchFoodItems, fetchSubCategories, fetchCategorySchedule } from '../api';
import { sortCategories, sortSubCategories } from '../utils';

interface FoodMenuStoreInterface {
  categories: Category[];
  selectedCategory: Category | null;
  selectedSubCategory: SubCategory | null;
  subCategories: SubCategory[];
  foodItems: MenuItem[];
  categorySchedule: CategorySchedule[];
  subcategorySchedule: SubcategorySchedule[];
  notices: Notice[];
  backgroundWrapperImages: BackgroundWrapperImage[];
  restaurantImages: RestaurantImage[];
  currentSubCategoryIndex: number;
  currentRecommendedFoodItems: MenuItem[];
  newAdditions: MenuItem[];
  updateFoodItems: (foodItems: MenuItem[]) => void;
  updateSelectedCategory: (categoryId: string, subCategoryId: string | null) => Promise<void>;
  updateSelectedSubCategory: (subCategoryId: string) => Promise<void>;
  fetchCategories: () => Promise<void>;
  fetchSubCategories: (categoryId: string, subCategoryId: string | null) => Promise<void>;
  fetchFoodItems: (subCategoryId: string) => Promise<void>;
  fetchNewAdditions: () => Promise<void>;
  fetchCategorySchedule: () => Promise<void>;
  fetchSubcategorySchedule: () => Promise<void>;
  fetchNotices: () => Promise<void>;
  fetchBackgroundWrapperImages: () => Promise<void>;
  setCurrentSubCategoryIndex: (subCategoryId: string) => Promise<void>;
  updateCurrentSubCategoryIndex: (updatedSubCategoryIndex: number) => Promise<void>;
  setCurrentRecommendedFoodItems: (recommendedFoodItems: MenuItem[]) => Promise<void>;
  fetchRestaurantImages: () => Promise<void>;
  resetSubCategories: () => void;
  resetFoodItems: () => void;
}

const useFoodMenuStore = create<FoodMenuStoreInterface>()(
  subscribeWithSelector(
    persist(
      (set, get) => ({
        categories: [],
        selectedCategory: null,
        selectedSubCategory: null,
        subCategories: [],
        foodItems: [],
        newAdditions: [],
        categorySchedule: [],
        subcategorySchedule: [],
        notices: [],
        backgroundWrapperImages: [],
        currentSubCategoryIndex: 0,
        restaurantImages: [],
        currentRecommendedFoodItems: [],
        updateFoodItems: (updatedFoodItems: MenuItem[]) => {
          set({ foodItems: updatedFoodItems });
        },
        updateSelectedCategory: async (categoryId: string, subCategoryId: string | null) => {
          const categoryToBeSelected = get().categories.find(
            (category) => category.id === categoryId
          );
          set({ selectedCategory: categoryToBeSelected });
          get().fetchSubCategories(categoryId, subCategoryId);
        },
        updateSelectedSubCategory: async (subCategoryId: string) => {
          const subCategoryToBeSelected = get().subCategories.find(
            (subCategory) => subCategory.id === subCategoryId
          );
          set({ selectedSubCategory: subCategoryToBeSelected });
          get().setCurrentSubCategoryIndex(subCategoryId);
          get().fetchFoodItems(subCategoryId);
        },
        fetchCategories: async () => {
          const categories = await fetchCategories();
          set({ categories });
        },
        fetchSubCategories: async (categoryId: string, subCategoryId: string | null) => {
          const subCategories = await fetchSubCategories(categoryId);
          set({ subCategories });
          if (subCategories.length > 0) {
            if (!subCategoryId) {
              get().updateSelectedSubCategory(subCategories[0].id);
            } else {
              get().updateSelectedSubCategory(subCategoryId);
            }
          }
        },
        fetchFoodItems: async (subCategoryId: string) => {
          const foodItems = await fetchFoodItems(subCategoryId);
          set({ foodItems });
        },
        fetchNewAdditions: async () => {
          const newAdditions = await fetchNewAdditionFoodItems();
          set({ newAdditions: newAdditions })
        },
        fetchCategorySchedule: async () => {
          const categorySchedule = await fetchCategorySchedule();
          set({ categorySchedule });
        },
        fetchSubcategorySchedule: async () => {
          const subcategorySchedule = await fetchSubcategorySchedule();
          set({ subcategorySchedule });
        },
        fetchNotices: async () => {
          const notices = await fetchNotices();
          set({ notices });
        },
        fetchBackgroundWrapperImages: async () => {
          const images = await fetchBackgroundWrapperImages();
          set({ backgroundWrapperImages: images });
        },
        fetchRestaurantImages: async () => {
          const images = await fetchRestaurantImages();
          set({ restaurantImages: images });
        },
        setCurrentSubCategoryIndex: async (subCategoryId: string) => {
          const currentSubCategoryIndex = get().subCategories.findIndex(
            (subCategory) => subCategory.id === subCategoryId
          );
          set({ currentSubCategoryIndex });
        },
        updateCurrentSubCategoryIndex: async (updatedSubCategoryIndex: number) => {
          set({ currentSubCategoryIndex: updatedSubCategoryIndex });
        },
        resetSubCategories: () => {
          set({ subCategories: [] });
        },
        resetFoodItems: () => {
          set({ foodItems: [] });
        },
        setCurrentRecommendedFoodItems: async (recommendedFoodItems: MenuItem[]) => {
          set({ currentRecommendedFoodItems: recommendedFoodItems });
        },
      }),
      { name: 'bharat-bhavan-foodMenuStore' },
    )
  )
);

// TODO: fix types for argument sent in below sortCategories and sortSubCategories function call
useFoodMenuStore.subscribe(
  (state) => [state.categories, state.categorySchedule],
  ([categories, categorySchedule]) => {
    sortCategories(categories, categorySchedule);
  }
)

useFoodMenuStore.subscribe(
  (state) => [state.subCategories, state.subCategories],
  ([subCategories, subCategorySchedule]) => {
    sortSubCategories(subCategories, subCategorySchedule);
  }
)
export default useFoodMenuStore;
