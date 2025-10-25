'use server';

import { revalidatePath } from 'next/cache';

export const createLesson = async ({ comment }: { comment: string }) => {
  console.log({ comment });
  revalidatePath('/lessons');
};
