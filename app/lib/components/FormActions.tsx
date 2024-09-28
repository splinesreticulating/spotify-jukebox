import Link from "next/link";
import { Button } from "@/app/ui/button";

interface FormActionsProps {
  songId: number;
}

export const FormActions: React.FC<FormActionsProps> = ({ songId }) => (
  <div className="mt-6 flex justify-end gap-4">
    <Link
      href={`http://192.168.193.76:6969/songs/${songId}/edit`}
      className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
    >
      Legacy
    </Link>
    <Link
      href="/dashboard/songs"
      className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
    >
      Cancel
    </Link>
    <Button type="submit">Update</Button>
  </div>
);
