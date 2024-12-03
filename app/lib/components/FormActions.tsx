import Link from 'next/link'
import { Button } from '@/app/ui/button'

interface FormActionsProps {
  className?: string
}

export const FormActions: React.FC<FormActionsProps> = ({ className }) => (
  <div className={`mt-6 flex justify-end gap-4 ${className}`}>
    <Link
      href="/dashboard/songs"
      className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
    >
      Cancel
    </Link>
    <Button type="submit">Update</Button>
  </div>
)
