import CategoryItem from "./CategoryItem";
import Image from "next/image";
import Heading from "./Heading";
import DOMPurify from "isomorphic-dompurify";

type Category = {
  id: number;
  name: string;
  slug: string;
  image_url: string | null;
  description: string;
};

const getCategories = async (): Promise<Category[]> => {
  try {
    const res = await fetch("https://jezkimhardware.dukasasa.co.ke/api/categories", {
      next: { revalidate: 60 },
    });

    const data = await res.json();
    return data.data.filter((cat: Category) => cat.slug !== "root");
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    return [];
  }
};

const CategoryMenu = async () => {
  const categories = await getCategories();

  return (
    <section className="py-16 bg-gradient-to-br from-[#a73800] via-[#cc4e00] to-[#ff5b00] text-white">
      <Heading title="BROWSE CATEGORIES" />

      <div className="max-w-screen-2xl mx-auto px-6 md:px-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 mt-10">
        {categories.length === 0 ? (
          <div className="col-span-full text-center text-white text-sm">
            No categories found.
          </div>
        ) : (
          categories.map((category) => (
            <CategoryItem
              key={category.id}
              title={category.name}
              href={`/categories/${category.slug}`}
            >
              <div className="p-4 bg-white rounded-2xl shadow-md hover:shadow-xl transition-transform hover:scale-[1.03] text-center group">
                
                {/* Category Image */}
                <div className="relative w-16 h-16 mx-auto mb-2">
                  <Image
                    src={
                      category.image_url?.startsWith("http")
                        ? category.image_url
                        : "https://placehold.co/64x64?text=No+Image"
                    }
                    alt={category.name}
                    fill
                    className="object-contain rounded"
                    sizes="64px"
                  />
                </div>

                {/* Category Name */}
                <p className="font-semibold text-sm transition-colors group-hover:text-[#d64a00]" style={{ color: "#ff5b00" }}>
                  {category.name}
                </p>

                {/* Category Description */}
                <div
                  className="text-gray-600 text-xs mt-1 min-h-[2rem] line-clamp-2"
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(category.description || ""),
                  }}
                />

                {/* Product Count (Placeholder) */}
                <p className="text-[11px] text-gray-400 mt-1 italic">
                  ~20 products
                </p>
              </div>
            </CategoryItem>
          ))
        )}
      </div>
    </section>
  );
};

export default CategoryMenu;