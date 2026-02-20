export const getLocalDay = () => {
  // Get current date based on device's local time zone
  const now = new Date();
  // Get day of week (0-6, where 0 is Sunday)
  const dayOfWeek = now.getDay();
  // Map day numbers to day names
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[dayOfWeek];
};

export const isCategoryAvailable = (category: Category, categorySchedule: CategorySchedule[]) => {
  if (category.unavailable || category.unavailableDays.includes(getLocalDay())) {
    return false;
  }
  const currentDay = getLocalDay();
  const matchingSchedule = categorySchedule.find((schedule) => {
    return (
      schedule.category_id === category.id && schedule.category_schedule_day.includes(currentDay)
    );
  });

  if (!matchingSchedule) return true;
  // If the start_time and end_time are empty string, item is unavailable for the day
  if (!matchingSchedule.start_time && !matchingSchedule.end_time) {
    return false;
  }

  const now = new Date();
  const currentTimeInMinutes = now.getUTCHours() * 60 + now.getUTCMinutes();
  const startTime = new Date(matchingSchedule.start_time);
  const endTime = new Date(matchingSchedule.end_time);
  const startTimeInMinutes = startTime.getUTCHours() * 60 + startTime.getUTCMinutes();
  const endTimeInMinutes = endTime.getUTCHours() * 60 + endTime.getUTCMinutes();

  // Only check time if the current day is in the schedule
  return currentTimeInMinutes >= startTimeInMinutes && currentTimeInMinutes <= endTimeInMinutes;
};

export const isSubCategoryAvailable = (
  subCategory: SubCategory,
  subCategorySchedule: SubcategorySchedule[]
) => {
  if (subCategory.unavailable || subCategory.unavailableDays.includes(getLocalDay())) {
    return false;
  }
  const currentDay = getLocalDay();
  const matchingSchedule = subCategorySchedule.find((schedule) => {
    return (
      schedule.sub_category_id === subCategory.id &&
      schedule.sub_category_schedule_day.includes(currentDay)
    );
  });

  if (!matchingSchedule) return true;

  // If the start_time and end_time are empty string, item is unavailable for the day
  if (!matchingSchedule.start_time && !matchingSchedule.end_time) {
    return false;
  }

  const now = new Date();
  const currentTimeInMinutes = now.getUTCHours() * 60 + now.getUTCMinutes();
  const startTime = new Date(matchingSchedule.start_time);
  const endTime = new Date(matchingSchedule.end_time);
  const startTimeInMinutes = startTime.getUTCHours() * 60 + startTime.getUTCMinutes();
  const endTimeInMinutes = endTime.getUTCHours() * 60 + endTime.getUTCMinutes();

  // Only check time if the current day is in the schedule
  return currentTimeInMinutes >= startTimeInMinutes && currentTimeInMinutes <= endTimeInMinutes;
};

export const isVideoLink = (link: string | undefined) => {
  return !!link && (link.startsWith('https://www.youtube.com/watch?v=') || link.startsWith('https://youtu.be/'));
};

export const getYoutubeVideoId = (url: string | undefined) => {
  if (!url) return null;

  // Handle youtube.com links
  if (url.includes('youtube.com/watch?v=')) {
    const urlParams = new URLSearchParams(url.split('?')[1]);
    return urlParams.get('v');
  }

  // Handle youtu.be links
  if (url.includes('youtu.be/')) {
    return url.split('youtu.be/')[1].split('?')[0];
  }
  return null;
};

export const getYoutubeThumbnail = (url: string | undefined, quality: 'default' | 'medium' | 'high' | 'standard' | 'maximum' = 'high') => {
  const videoId = getYoutubeVideoId(url);
  if (!videoId) return null;

  const qualityMap = {
    default: 'default.jpg',
    medium: 'mqdefault.jpg',
    high: 'hqdefault.jpg',
    standard: 'sddefault.jpg',
    maximum: 'maxresdefault.jpg'
  };

  return `https://img.youtube.com/vi/${videoId}/${qualityMap[quality]}`;
};

export const sortCategories = (categories: Category[], categorySchedule: CategorySchedule[]) => {
  return categories.sort((a, b) => {
    const aAvailable = isCategoryAvailable(a, categorySchedule);
    const bAvailable = isCategoryAvailable(b, categorySchedule);
    if (aAvailable && !bAvailable) return -1;
    if (!aAvailable && bAvailable) return 1;
    return a.order - b.order;
  })
}

export const sortSubCategories = (subCategories: SubCategory[], subCategorySchedule: SubcategorySchedule[]) => {
  return subCategories.sort((a, b) => {
    const aAvailable = isSubCategoryAvailable(a, subCategorySchedule);
    const bAvailable = isSubCategoryAvailable(b, subCategorySchedule);
    if (aAvailable && !bAvailable) return -1;
    if (!aAvailable && bAvailable) return 1;
    return a.order - b.order;
  })
}