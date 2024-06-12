import { fetchArtists } from '@/app/lib/data';
import Form from '@/app/ui/songs/create-form';
import Breadcrumbs from '@/app/ui/songs/breadcrumbs';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Create Song',
};

export default async function Page() {
  const artists = await fetchArtists();

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Songs', href: '/dashboard/songs' },
          {
            label: 'Create Song',
            href: '/dashboard/songs/create',
            active: true,
          },
        ]}
      />
      <Form artists={artists} />
    </main>
  );
}
