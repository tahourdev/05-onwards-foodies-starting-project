'use server';

import { redirect } from 'next/navigation';
import { saveMeal } from './meals';
import { revalidatePath } from 'next/cache';

function isInValidText(text) {
  return !text || text.trim() === '';
}

export async function shareMeal(prevState, formData) {
  const meal = {
    title: formData.get('title'),
    summary: formData.get('summary'),
    instructions: formData.get('instructions'),
    creator: formData.get('name'),
    creator_email: formData.get('email'),
    image: formData.get('image'),
  };

  if (
    isInValidText(meal.title) ||
    isInValidText(meal.summary) ||
    isInValidText(meal.instructions) ||
    isInValidText(meal.creator) ||
    isInValidText(meal.creator_email) ||
    !meal.creator_email.includes('@') ||
    !meal.image ||
    meal.image.size === 0
  ) {
    return {
      message: 'Invalid input',
    };
  }
  await saveMeal(meal);
  revalidatePath('/meals'); // Calling the 'revalidatePath' function to initiate revalidation for the '/meals' path.

  redirect('/meals'); // Redirecting the user to the '/meals' path.
}
