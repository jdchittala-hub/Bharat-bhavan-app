import PocketBase from 'pocketbase';
import { getLocalDay } from './utils';
export const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;
// Valid for 1 year since 16-June-2025
export const TOKEN = process.env.EXPO_PUBLIC_TOKEN;
// PocketBase instance
export const pb = new PocketBase(BASE_URL);
// Set the token directly in authStore
if (TOKEN) {
  pb.authStore.save(TOKEN, null);
}

export const fetchCategories = async (): Promise<Category[]> => {
  try {
    const records = (await pb.collection('category').getFullList({ sort: 'order' }));
    return records.map((record) => ({
      collectionId: record.collectionId,
      collectionName: record.collectionName,
      created: record.created,
      id: record.id,
      image: record.image,
      name: record.name,
      unavailable: record.unavailable,
      unavailableDays: record.unavailableDays,
      order: record.order,
      updated: record.updated,
    }));
  } catch (error) {
    console.error('Failed to fetch categories:', error);
    return [];
  }
};
export const fetchSubCategories = async (categoryId: string): Promise<SubCategory[]> => {
  try {
    const records = await pb
      .collection('sub_category')
      .getFullList({ filter: `categoryId='${categoryId}'`, sort: 'order' });
    return records.map((record) => ({
      categoryId: record.categoryId,
      collectionId: record.collectionId,
      collectionName: record.collectionName,
      created: record.created,
      id: record.id,
      name: record.name,
      unavailable: record.unavailable,
      unavailableDays: record.unavailableDays,
      order: record.order,
      updated: record.updated,
    }));
  } catch (error) {
    console.error('Failed to fetch subcategories:', error);
    return [];
  }
};

// there is no specific schedule for foodItem, therefore the sorting is done in this function only
export const fetchFoodItems = async (subCategoryId: string): Promise<MenuItem[]> => {
  try {
    const records = await pb
      .collection('food_item')
      .getFullList({ filter: `subCategoryId='${subCategoryId}'`, sort: 'order' });
    const today = getLocalDay();
    return records
      .map((record) => ({
        available: record.available,
        order: record.order,
        categoryId: record.categoryId,
        collectionId: record.collectionId,
        collectionName: record.collectionName,
        created: record.created,
        description: record.description,
        allergens: record.allergens,
        availableDays: record.availableDays,
        coming_soon_text: record.coming_soon_text,
        id: record.id,
        image: record.image,
        name: record.name,
        price: record.price,
        subCategoryId: record.subCategoryId,
        ingredients: record.ingredients,
        making_video_link: record.making_video_link,
        prep_time: record.prep_time,
        recommended_dishes: record.recommended_dishes,
        new_addition: record.new_addition,
        updated: record.updated,
      }))
      .sort((a, b) => {
        // First, check if either item is unavailable
        if (!a.available && b.available) return 1; // Push unavailable items to the end
        if (a.available && !b.available) return -1;

        // If both items have the same availability status, proceed with the existing sorting logic
        const aAvailableToday = a.availableDays?.availableDays?.includes(today) ?? false;
        const bAvailableToday = b.availableDays?.availableDays?.includes(today) ?? false;

        // TODO: think upon availableDays and unavailableDays
        // Check if availableDays is null and available is true
        const aPriority = a.available && (aAvailableToday || a.availableDays === null);
        const bPriority = b.available && (bAvailableToday || b.availableDays === null);

        // Prioritize items based on the criteria
        if (aPriority && !bPriority) return -1; // `a` has higher priority
        if (!aPriority && bPriority) return 1; // `b` has higher priority

        // If both have the same priority, sort by `order`
        if (aPriority && bPriority) {
          return a.order - b.order;
        }

        // If neither has populated availableDays, sort by order
        return a.order - b.order;
      });
  } catch (error) {
    console.error('Failed to fetch food items:', error);
    return [];
  }
};

export const fetchFoodItemById = async (id: string): Promise<MenuItem | null> => {
  try {
    const record = await pb.collection('food_item').getOne(id);
    return {
      available: record.available,
      order: record.order,
      categoryId: record.categoryId,
      collectionId: record.collectionId,
      collectionName: record.collectionName,
      created: record.created,
      description: record.description,
      allergens: record.allergens,
      availableDays: record.availableDays,
      coming_soon_text: record.coming_soon_text,
      id: record.id,
      image: record.image,
      name: record.name,
      price: record.price,
      subCategoryId: record.subCategoryId,
      ingredients: record.ingredients,
      making_video_link: record.making_video_link,
      prep_time: record.prep_time,
      new_addition: record.new_addition,
      recommended_dishes: record.recommended_dishes,
      updated: record.updated,
    }
  } catch (error) {
    console.error('Failed to fetch food item by id:', error);
    return null;
  }
}

export const fetchNewAdditionFoodItems = async () => {
  try {
    const records = await pb.collection('food_item').getFullList({
      filter: 'new_addition = true'
    });
    return records
      .map((record) => ({
        available: record.available,
        order: record.order,
        categoryId: record.categoryId,
        collectionId: record.collectionId,
        collectionName: record.collectionName,
        created: record.created,
        description: record.description,
        allergens: record.allergens,
        availableDays: record.availableDays,
        coming_soon_text: record.coming_soon_text,
        id: record.id,
        image: record.image,
        name: record.name,
        price: record.price,
        subCategoryId: record.subCategoryId,
        ingredients: record.ingredients,
        making_video_link: record.making_video_link,
        prep_time: record.prep_time,
        recommended_dishes: record.recommended_dishes,
        new_addition: record.new_addition,
        updated: record.updated,
      }));
  } catch (error) {
    console.error('Failed to fetch newAdditions food items');
  }
}

export const getFoodItemNameById = async (id: string) => {
  try {
    const record = await pb.collection('food_item').getOne(id);
    return record.name;
  } catch (error) {
    console.error('Failed to fetch food name by id:', error);
  }
  return '';
}

export const fetchNotices = async (): Promise<Notice[]> => {
  try {
    const records = await pb.collection('notices').getFullList({
      sort: 'created',
    });

    return records.map((record) => ({
      id: record.id,
      collectionId: record.collectionId,
      collectionName: record.collectionName,
      created: record.created,
      updated: record.updated,
      content: record.content,
      isActive: record.isActive,
      timer: record.timer,
    }));
  } catch (error) {
    console.error('Failed to fetch notice carousel items:', error);
    return []; // Return empty array in case of error
  }
};

export const fetchCategorySchedule = async () => {
  try {
    const records = await pb.collection('category_schedule').getFullList();
    return records.map((record) => ({
      id: record.id,
      collectionId: record.collectionId,
      collectionName: record.collectionName,
      created: record.created,
      updated: record.updated,
      category_id: record.category_id,
      category_schedule_day: record.category_schedule_day,
      start_time: record.start_time,
      end_time: record.end_time,
      unavailable_text: record.unavailable_text,
    }));
  } catch (error) {
    console.error('Failed to fetch category schedule items:', error);
    return [];
  }
};

export const fetchSubcategorySchedule = async () => {
  try {
    const records = await pb.collection('sub_category_schedule').getFullList();
    return records.map((record) => ({
      id: record.id,
      collectionId: record.collectionId,
      collectionName: record.collectionName,
      created: record.created,
      updated: record.updated,
      sub_category_id: record.sub_category_id,
      sub_category_schedule_day: record.sub_category_schedule_day,
      start_time: record.start_time,
      end_time: record.end_time,
      unavailable_text: record.unavailable_text,
    }));
  } catch (error) {
    console.error('Failed to fetch subcategory schedule items:', error);
    return [];
  }
};

export const fetchBackgroundWrapperImages = async (): Promise<BackgroundWrapperImage[]> => {
  try {
    const records = await pb.collection('background_wrapper_image').getFullList({
      sort: 'order',
    });
    return records.map((record) => ({
      id: record.id,
      collectionId: record.collectionId,
      collectionName: record.collectionName,
      created: record.created,
      updated: record.updated,
      image: record.image,
      order: record.order,
    }));
  } catch (error) {
    console.error('Failed to fetch background wrapper images:', error);
    return [];
  }
};

export const fetchRestaurantImages = async (): Promise<RestaurantImage[]> => {
  try {

    const records = await pb.collection('restaurant_images').getFullList({
    });
    const restroImages = records.map((record) => ({
      id: record.id,
      collectionId: record.collectionId,
      collectionName: record.collectionName,
      created: record.created,
      updated: record.updated,
      images: record.images,
    }));
    return restroImages;
  } catch (error) {
    console.error('Failed to fetch restaurant images:', error);
    return [];
  }
};
