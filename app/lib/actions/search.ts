'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function updateSearchParams(formData: FormData) {
  const searchParams = new URLSearchParams()

  // Handle all filter types uniformly
  formData.forEach((value, key) => {
    if (value) {
      searchParams.set(key, value.toString())
    }
  })

  revalidatePath('/dashboard/songs')
  redirect(`/dashboard/songs?${searchParams.toString()}`)
}
