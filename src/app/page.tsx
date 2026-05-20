import Image from "next/image";
import { Star, LogIn, LogOut, PlusCircle } from "lucide-react";
import pool from "@/lib/db";
import { Attraction } from "@/types";
import Link from "next/link";
import { getServerSession } from "next-auth";

async function getAttractions(): Promise<Attraction[]> {
  try {
    const res = await pool.query("SELECT * FROM attractions ORDER BY created_at DESC");
    return res.rows;
  } catch (error) {
    console.error("Failed to fetch attractions:", error);
    return [];
  }
}

export default async function Home() {
  const attractions = await getAttractions();
  const session = await getServerSession();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center">
          <Link href="/">
            <h1 className="text-3xl font-bold text-blue-600">ไทยเที่ยวไทย รีวิว</h1>
          </Link>
          <div className="flex items-center gap-4">
            {session ? (
              <>
                <Link
                  href="/add-attraction"
                  className="flex items-center gap-1 text-gray-600 hover:text-blue-600"
                >
                  <PlusCircle className="w-5 h-5" />
                  <span>เพิ่มสถานที่</span>
                </Link>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">สวัสดี, {session.user?.name}</span>
                  <Link href="/api/auth/signout" className="p-2 text-gray-400 hover:text-red-500">
                    <LogOut className="w-5 h-5" />
                  </Link>
                </div>
              </>
            ) : (
              <Link
                href="/auth/signin"
                className="flex items-center gap-1 text-gray-600 hover:text-blue-600"
              >
                <LogIn className="w-5 h-5" />
                <span>เข้าสู่ระบบ</span>
              </Link>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">สถานที่ท่องเที่ยวยอดนิยม</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {attractions.map((attraction) => (
              <div
                key={attraction.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="relative h-48 w-full">
                  <Image
                    src={attraction.image_url || "/placeholder.jpg"}
                    alt={attraction.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-gray-900">{attraction.name}</h3>
                    <div className="flex items-center text-yellow-500">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="ml-1 text-sm font-medium">{attraction.rating || 0}</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 mb-2">{attraction.location}</p>
                  <p className="text-gray-600 line-clamp-2">{attraction.description}</p>
                  <Link
                    href={`/attractions/${attraction.id}`}
                    className="mt-4 block w-full bg-blue-600 text-white py-2 rounded-md text-center hover:bg-blue-700 transition-colors"
                  >
                    ดูรีวิวและโหวต
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="bg-white mt-12 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 text-center text-gray-500">
          <p>© 2026 ไทยเที่ยวไทย รีวิว.</p>
        </div>
      </footer>
    </div>
  );
}
