import { type PropsWithChildren, Suspense } from "react";
import { CategoryServer } from "@/modules/category/ui/category-server";
import { MediaServer } from "@/modules/media/ui/media-server";

export default function StoreLayout({ children }: PropsWithChildren) {
  return (
    <>
      <Suspense fallback={null}>
        <CategoryServer />
      </Suspense>
      <Suspense fallback={null}>
        <MediaServer />
      </Suspense>
      {children}
    </>
  );
}
