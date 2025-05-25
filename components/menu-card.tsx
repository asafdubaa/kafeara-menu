"use client"

import { useState, useRef, useEffect } from "react"
import { ChevronDown, ChevronUp, X, MapPin, Instagram, Globe, Phone } from "lucide-react"
import { cn } from "@/lib/utils"
// Remove the direct import of menuDataJson as we will fetch it from the API
// import menuDataJson from "@/data/menu-data.json"

// Debug log for CategorySection props - keep for now if needed
// console.log(`CategorySection ${title} items:`, items)

interface MenuItem {
  name_en: string;
  description_en: string;
  ingredients_en: string;
  name_tr: string;
  description_tr: string;
  ingredients_tr: string;
  price: string;
}

interface MenuData {
  salads: MenuItem[]
  snacks: MenuItem[]
  pastas: MenuItem[]
  mainDishes: MenuItem[]
  desserts: MenuItem[]
  coldBeverages: MenuItem[]
  coffee: MenuItem[]
  tea: MenuItem[]
}

export function MenuCard() {
  // Initialize menuData as null initially
  const [menuData, setMenuData] = useState<MenuData | null>(null)
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    salads: false,
    snacks: false,
    pastas: false,
    mainDishes: false,
    desserts: false,
    coldBeverages: false,
    coffee: false,
    tea: false,
  })

  const [activeLanguage, setActiveLanguage] = useState<"en" | "tr">("en")
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [showStory, setShowStory] = useState(false)
  const [showContact, setShowContact] = useState(false)
  // isClient state is no longer needed since we fetch in useEffect
  // const [isClient, setIsClient] = useState(false)

  // Create refs for each category section
  const categoryRefs = {
    salads: useRef<HTMLDivElement>(null),
    snacks: useRef<HTMLDivElement>(null),
    pastas: useRef<HTMLDivElement>(null),
    mainDishes: useRef<HTMLDivElement>(null),
    desserts: useRef<HTMLDivElement>(null),
    coldBeverages: useRef<HTMLDivElement>(null),
    coffee: useRef<HTMLDivElement>(null),
    tea: useRef<HTMLDivElement>(null),
  }

  // Fetch menu data from the API on component mount
  useEffect(() => {
    const fetchMenuData = async () => {
      try {
        const response = await fetch('/api/menu');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: MenuData = await response.json();
        console.log("Fetched menu data from API:", data);
        setMenuData(data);
      } catch (error) {
        console.error('Error fetching menu data:', error);
        // Optionally set some default data or show an error message on the UI
        setMenuData({
          salads: [],
          snacks: [],
          pastas: [],
          mainDishes: [],
          desserts: [],
          coldBeverages: [],
          coffee: [],
          tea: [],
        }); // Initialize with empty arrays on error
      }
    };

    fetchMenuData();

    // Remove localStorage logic
    // const handleStorageChange = () => {
    //   const savedMenu = localStorage.getItem("menuData")
    //   if (savedMenu) {
    //     setMenuData(JSON.parse(savedMenu))
    //   }
    // }
    // window.addEventListener("storage", handleStorageChange)
    // return () => window.removeEventListener("storage", handleStorageChange)
  }, []) // Empty dependency array means this runs once on mount

  // Debug log for current menuData state
  useEffect(() => {
    console.log("Current menuData state:", menuData)
  }, [menuData])

  const toggleCategory = (category: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }))
  }

  const scrollToCategory = (category: string) => {
    setActiveCategory(category)

    if (!expandedCategories[category]) {
      setExpandedCategories((prev) => ({
        ...prev,
        [category]: true,
      }))
    }

    setTimeout(() => {
      if (categoryRefs[category as keyof typeof categoryRefs]?.current) {
        categoryRefs[category as keyof typeof categoryRefs].current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        })
      }
    }, 100)
  }

  // Render loading state or null if menuData is not yet loaded
  if (!menuData) {
    return (
       <div className="max-w-3xl w-full mx-auto p-8 text-center text-amber-950">
         Loading menu...
       </div>
     );
  }

  // Debug log before render
  console.log("Rendering with menuData:", menuData)

  return (
    <div className="max-w-3xl w-full mx-auto">
      <div className="relative border-4 border-double border-amber-950/40 rounded-lg p-8 bg-[#f5e8c9] shadow-lg">
        {/* Texture overlay for old paper effect */}
        <div
          className="absolute inset-0 opacity-10 pointer-events-none mix-blend-multiply"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        />

        {/* Header */}
        <div className="text-center mb-8 relative">
          <h1 className="text-5xl font-serif text-amber-950 mb-2">Ara Kafe</h1>
          <h2 className="text-2xl font-serif text-amber-950 mb-4">Taksim</h2>

          {/* Lines and dot */}
          <div className="relative flex justify-center items-center mb-10 mt-2">
            <div className="h-px bg-amber-950/60 w-full"></div>
            <div className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center">
              <span className="w-4 h-4 rounded-full border border-amber-950/60 bg-[#f5e8c9] block"></span>
            </div>
            {/* Overlayed buttons */}
            <div className="absolute inset-0 flex justify-between items-center pointer-events-none">
              <div className="flex-1 flex justify-end">
                <button
                  onClick={() => setShowStory(true)}
                  className="pointer-events-auto relative z-10 px-4 py-2 border border-amber-950 text-amber-950 rounded-md font-serif text-sm hover:bg-amber-950/10 transition-colors bg-[#f5e8c9] shadow"
                  style={{ marginRight: '1.5rem' }}
                >
                  {activeLanguage === "en" ? "Our Story" : "Hikayemiz"}
                </button>
              </div>
              <div className="flex-1 flex justify-start">
                <button
                  onClick={() => setShowContact(true)}
                  className="pointer-events-auto relative z-10 px-4 py-2 border border-amber-950 text-amber-950 rounded-md font-serif text-sm hover:bg-amber-950/10 transition-colors bg-[#f5e8c9] shadow"
                  style={{ marginLeft: '1.5rem' }}
                >
                  {activeLanguage === "en" ? "Contact" : "İletişim"}
                </button>
              </div>
            </div>
          </div>

          {/* Language Switcher */}
          <div className="mt-4 inline-flex rounded-md overflow-hidden border border-amber-950/40">
            <button
              onClick={() => setActiveLanguage("en")}
              className={`px-4 py-1 ${activeLanguage === "en" ? "bg-[#f5e8c9] text-amber-950" : "bg-amber-950 text-[#f5e8c9]"}`}
            >
              English
            </button>
            <button
              onClick={() => setActiveLanguage("tr")}
              className={`px-4 py-1 ${activeLanguage === "tr" ? "bg-[#f5e8c9] text-amber-950" : "bg-amber-950 text-[#f5e8c9]"}`}
            >
              Türkçe
            </button>
          </div>

          {/* Navigation Bar */}
          <div className="mt-6 border-t border-b border-amber-950/30 py-3">
            <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-amber-950/80">
              <button
                onClick={() => scrollToCategory("salads")}
                className={`text-sm font-serif transition-colors ${
                  activeCategory === "salads"
                    ? "text-amber-950 font-semibold border-b border-amber-950"
                    : "hover:text-amber-950"
                }`}
              >
                {activeLanguage === "en" ? "Salads" : "Salatalar"}
              </button>
              <button
                onClick={() => scrollToCategory("snacks")}
                className={`text-sm font-serif transition-colors ${
                  activeCategory === "snacks"
                    ? "text-amber-950 font-semibold border-b border-amber-950"
                    : "hover:text-amber-950"
                }`}
              >
                {activeLanguage === "en" ? "Snacks" : "Aşıtırmalıklar"}
              </button>
              <button
                onClick={() => scrollToCategory("pastas")}
                className={`text-sm font-serif transition-colors ${
                  activeCategory === "pastas"
                    ? "text-amber-950 font-semibold border-b border-amber-950"
                    : "hover:text-amber-950"
                }`}
              >
                {activeLanguage === "en" ? "Pastas" : "Makarnalar"}
              </button>
              <button
                onClick={() => scrollToCategory("mainDishes")}
                className={`text-sm font-serif transition-colors ${
                  activeCategory === "mainDishes"
                    ? "text-amber-950 font-semibold border-b border-amber-950"
                    : "hover:text-amber-950"
                }`}
              >
                {activeLanguage === "en" ? "Main Dishes" : "Ana Yemekler"}
              </button>
              <button
                onClick={() => scrollToCategory("desserts")}
                className={`text-sm font-serif transition-colors ${
                  activeCategory === "desserts"
                    ? "text-amber-950 font-semibold border-b border-amber-950"
                    : "hover:text-amber-950"
                }`}
              >
                {activeLanguage === "en" ? "Desserts" : "Tatlılar"}
              </button>
              <button
                onClick={() => scrollToCategory("coldBeverages")}
                className={`text-sm font-serif transition-colors ${
                  activeCategory === "coldBeverages"
                    ? "text-amber-950 font-semibold border-b border-amber-950"
                    : "hover:text-amber-950"
                }`}
              >
                {activeLanguage === "en" ? "Cold Beverages" : "Meşrubat"}
              </button>
              <button
                onClick={() => scrollToCategory("coffee")}
                className={`text-sm font-serif transition-colors ${
                  activeCategory === "coffee"
                    ? "text-amber-950 font-semibold border-b border-amber-950"
                    : "hover:text-amber-950"
                }`}
              >
                {activeLanguage === "en" ? "Coffee" : "Kahveler"}
              </button>
              <button
                onClick={() => scrollToCategory("tea")}
                className={`text-sm font-serif transition-colors ${
                  activeCategory === "tea"
                    ? "text-amber-950 font-semibold border-b border-amber-950"
                    : "hover:text-amber-950"
                }`}
              >
                {activeLanguage === "en" ? "Tea" : "Çaylar"}
              </button>
            </nav>
          </div>
        </div>

        {/* Menu Categories */}
        <div className="space-y-6">
          {/* Salads */}
          <div ref={categoryRefs.salads}>
            <CategorySection
              title={activeLanguage === "en" ? "SALADS" : "SALATALAR"}
              items={menuData.salads || []}
              isExpanded={expandedCategories.salads}
              onToggle={() => toggleCategory("salads")}
              activeLanguage={activeLanguage}
            />
          </div>

          {/* Snacks */}
          <div ref={categoryRefs.snacks}>
            <CategorySection
              title={activeLanguage === "en" ? "SNACKS" : "ATIŞTIRMALIKLAR"}
              items={menuData.snacks || []}
              isExpanded={expandedCategories.snacks}
              onToggle={() => toggleCategory("snacks")}
              activeLanguage={activeLanguage}
            />
          </div>

          {/* Pastas */}
          <div ref={categoryRefs.pastas}>
            <CategorySection
              title={activeLanguage === "en" ? "PASTAS" : "MAKARNALAR"}
              items={menuData.pastas || []}
              isExpanded={expandedCategories.pastas}
              onToggle={() => toggleCategory("pastas")}
              activeLanguage={activeLanguage}
            />
          </div>

          {/* Main Dishes */}
          <div ref={categoryRefs.mainDishes}>
            <CategorySection
              title={activeLanguage === "en" ? "MAIN DISHES" : "ANA YEMEKLER"}
              items={menuData.mainDishes || []}
              isExpanded={expandedCategories.mainDishes}
              onToggle={() => toggleCategory("mainDishes")}
              activeLanguage={activeLanguage}
            />
          </div>

          {/* Desserts */}
          <div ref={categoryRefs.desserts}>
            <CategorySection
              title={activeLanguage === "en" ? "DESSERTS" : "TATLILAR"}
              items={menuData.desserts || []}
              isExpanded={expandedCategories.desserts}
              onToggle={() => toggleCategory("desserts")}
              activeLanguage={activeLanguage}
            />
          </div>

          {/* Cold Beverages */}
          <div ref={categoryRefs.coldBeverages}>
            <CategorySection
              title={activeLanguage === "en" ? "COLD BEVERAGES" : "SOĞUK İÇECEKLER"}
              items={menuData.coldBeverages || []}
              isExpanded={expandedCategories.coldBeverages}
              onToggle={() => toggleCategory("coldBeverages")}
              activeLanguage={activeLanguage}
            />
          </div>

          {/* Coffee */}
          <div ref={categoryRefs.coffee}>
            <CategorySection
              title={activeLanguage === "en" ? "COFFEE" : "KAHVELER"}
              items={menuData.coffee || []}
              isExpanded={expandedCategories.coffee}
              onToggle={() => toggleCategory("coffee")}
              activeLanguage={activeLanguage}
            />
          </div>

          {/* Tea */}
          <div ref={categoryRefs.tea}>
            <CategorySection
              title={activeLanguage === "en" ? "TEA" : "ÇAYLAR"}
              items={menuData.tea || []}
              isExpanded={expandedCategories.tea}
              onToggle={() => toggleCategory("tea")}
              activeLanguage={activeLanguage}
            />
          </div>
        </div>

        {/* Contact Bar */}
        <div className="mt-10 pt-6 border-t border-amber-950/30">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-amber-950" />
              <span className="text-sm text-amber-950">Tosbağa Sk. No:2, 34433 Beyoğlu/İstanbul</span>
            </div>
            <div className="flex items-center gap-4">
              <a
                href="https://instagram.com/arakafe"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-amber-950 hover:text-amber-800"
              >
                <Instagram className="h-4 w-4" />
                <span className="text-sm">@arakafe</span>
              </a>
              <a
                href="https://arakafe.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-amber-950 hover:text-amber-800"
              >
                <Globe className="h-4 w-4" />
                <span className="text-sm">arakafe.com</span>
              </a>
              <a href="tel:+902122456565" className="flex items-center gap-1 text-amber-950 hover:text-amber-800">
                <Phone className="h-4 w-4" />
                <span className="text-sm">+90 212 245 65 65</span>
              </a>
            </div>
          </div>
        </div>

        {/* Our Story Modal */}
        {showStory && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="relative max-w-2xl w-full max-h-[90vh] overflow-y-auto bg-[#f5e8c9] border-4 border-double border-amber-950/40 rounded-lg p-8 shadow-xl">
              {/* Texture overlay for old paper effect */}
              <div
                className="absolute inset-0 opacity-10 pointer-events-none mix-blend-multiply"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                }}
              />

              <button
                onClick={() => setShowStory(false)}
                className="absolute top-4 right-4 text-amber-950 hover:text-amber-800"
              >
                <X className="h-6 w-6" />
              </button>

              {/* Ara Güler Photo */}
              <div className="flex justify-center mb-6">
                <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-amber-950/40">
                  <img
                    src="/araguler.jpg?height=128&width=128"
                    alt="Ara Güler"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              <h2 className="text-3xl font-serif text-amber-950 text-center mb-4">Ara Güler – The Eye of Istanbul</h2>

              <p className="text-xl italic text-amber-950 text-center mb-6">
                "Istanbul's soul is in its stories, and every story begins at a table."
              </p>

              <p className="text-lg text-amber-950 text-center mb-8">
                Ara Kafe is inspired by the legendary photographer Ara Güler, whose lens captured the heart of Istanbul.
                Our cafe is a tribute to his vision, artistry, and love for the city's vibrant life.
              </p>

              <div className="mb-8">
                <h3 className="text-xl font-serif text-amber-950 mb-3">Ara Kafe</h3>
                <div className="w-full h-64 bg-amber-100/50 rounded overflow-hidden">
                  <img
                    src="/kafeara.jpg?height=256&width=512"
                    alt="Ara Kafe"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              <p className="text-lg text-amber-950 text-center">
                Step inside Ara Kafe, where the spirit of Istanbul and the legacy of Ara Güler come alive in every
                detail – from the carefully curated photographs on our walls to the authentic flavors of our menu.
              </p>
            </div>
          </div>
        )}

        {/* Contact Modal */}
        {showContact && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="relative max-w-md w-full bg-[#f5e8c9] border-4 border-double border-amber-950/40 rounded-lg p-8 shadow-xl">
              {/* Texture overlay for old paper effect */}
              <div
                className="absolute inset-0 opacity-10 pointer-events-none mix-blend-multiply"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                }}
              />

              <button
                onClick={() => setShowContact(false)}
                className="absolute top-4 right-4 text-amber-950 hover:text-amber-800"
              >
                <X className="h-6 w-6" />
              </button>

              <h2 className="text-3xl font-serif text-amber-950 text-center mb-6">Contact Us</h2>

              <div className="space-y-6">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-amber-950 mt-1" />
                  <div>
                    <h3 className="font-medium text-amber-950">Address</h3>
                    <p className="text-amber-950">Tosbağa Sk. No:2, 34433 Beyoğlu/İstanbul</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-amber-950 mt-1" />
                  <div>
                    <h3 className="font-medium text-amber-950">Phone</h3>
                    <p className="text-amber-950">+90 212 245 65 65</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Instagram className="h-5 w-5 text-amber-950 mt-1" />
                  <div>
                    <h3 className="font-medium text-amber-950">Instagram</h3>
                    <a
                      href="https://instagram.com/arakafe"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-amber-950 underline"
                    >
                      @arakafe
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Globe className="h-5 w-5 text-amber-950 mt-1" />
                  <div>
                    <h3 className="font-medium text-amber-950">Website</h3>
                    <a
                      href="https://arakafe.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-amber-950 underline"
                    >
                      arakafe.com
                    </a>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-amber-950/30">
                <h3 className="font-medium text-amber-950 mb-2">Opening Hours</h3>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-amber-950">Monday - Friday</p>
                    <p className="text-amber-950">Saturday - Sunday</p>
                  </div>
                  <div>
                    <p className="text-amber-950">09:00 - 23:00</p>
                    <p className="text-amber-950">10:00 - 00:00</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

interface CategorySectionProps {
  title: string
  items: MenuItem[]
  isExpanded: boolean
  onToggle: () => void
  activeLanguage: "en" | "tr"
}

function CategorySection({ title, items = [], isExpanded, onToggle, activeLanguage }: CategorySectionProps) {
  // Debug log for CategorySection props
  console.log(`CategorySection ${title} items:`, items)

  return (
    <div className="relative">
      <button onClick={onToggle} className="w-full flex justify-between items-center border-b border-amber-950/30 pb-2">
        <h2 className="text-2xl font-serif text-amber-950">{title}</h2>
        {isExpanded ? (
          <ChevronUp className="h-5 w-5 text-amber-950" />
        ) : (
          <ChevronDown className="h-5 w-5 text-amber-950" />
        )}
      </button>

      <div
        className={cn(
          "grid gap-4 transition-all duration-300 ease-in-out overflow-hidden",
          isExpanded ? "grid-rows-[1fr] opacity-100 mt-4" : "grid-rows-[0fr] opacity-0",
        )}
      >
        <div className="min-h-0">
          {/* Conditionally render items only if expanded */}
          {isExpanded ? (
            Array.isArray(items) && items.length > 0 ? (
              items.map((item, index) => (
                <div key={index} className="mb-6 last:mb-0">
                  <div className="flex justify-between items-baseline">
                    <h3 className="text-xl font-medium text-amber-950">
                      {activeLanguage === "en" ? item.name_en : item.name_tr}
                    </h3>
                    <div className="border-b border-dotted border-amber-950/40 flex-grow mx-2"></div>
                    <span className="text-xl font-medium text-amber-950">{item.price}</span>
                  </div>
                  {(activeLanguage === "en" ? item.description_en : item.description_tr) && 
                    <p className="text-amber-950/80 italic">
                      {activeLanguage === "en" ? item.description_en : item.description_tr}
                    </p>
                  }
                  {(activeLanguage === "en" ? item.ingredients_en : item.ingredients_tr) && 
                    <p className="text-sm text-amber-950/70">
                      {activeLanguage === "en" ? item.ingredients_en : item.ingredients_tr}
                    </p>
                  }
                </div>
              ))
            ) : (
              <p className="text-amber-950/60 text-center py-4">No items in this category</p>
            )
          ) : null /* Render nothing when collapsed */}
        </div>
      </div>
    </div>
  )
}
