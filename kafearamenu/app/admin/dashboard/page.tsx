"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import Cookies from "js-cookie";
import { ChevronDown, ChevronUp, Plus, Trash2, Edit2, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface MenuItem {
  name_en: string;
  description_en: string;
  ingredients_en: string;
  name_tr: string;
  description_tr: string;
  ingredients_tr: string;
  price: string;
}

type Category = "salads" | "snacks" | "pastas" | "mainDishes" | "desserts" | "coldBeverages" | "coffee" | "tea";

interface MenuData {
  salads: MenuItem[];
  snacks: MenuItem[];
  pastas: MenuItem[];
  mainDishes: MenuItem[];
  desserts: MenuItem[];
  coldBeverages: MenuItem[];
  coffee: MenuItem[];
  tea: MenuItem[];
}

export default function AdminDashboard() {
  const router = useRouter();
  const [menuData, setMenuData] = useState<MenuData | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<Record<Category, boolean>>({
    salads: true,
    snacks: true,
    pastas: true,
    mainDishes: true,
    desserts: true,
    coldBeverages: true,
    coffee: true,
    tea: true,
  });
  const [editingItem, setEditingItem] = useState<{ category: Category; index: number } | null>(null);
  const [newItem, setNewItem] = useState<MenuItem>({
    name_en: "",
    description_en: "",
    ingredients_en: "",
    name_tr: "",
    description_tr: "",
    ingredients_tr: "",
    price: "",
  });
  const [selectedCategory, setSelectedCategory] = useState<Category>("salads");

  useEffect(() => {
    const token = Cookies.get("adminToken");
    if (!token) {
      router.push("/admin");
      return;
    }

    const fetchMenuData = async () => {
      try {
        const response = await fetch('/api/menu');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: MenuData = await response.json();
        setMenuData(data);
      } catch (error) {
        console.error('Error fetching menu data:', error);
        toast.error('Failed to load menu data.');
      }
    };

    fetchMenuData();
  }, [router]);

  const updateMenuData = async (newData: MenuData) => {
    try {
      const response = await fetch('/api/menu', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Assuming the update was successful, update the state
      setMenuData(newData);
      toast.success('Menu data updated successfully.');
    } catch (error) {
      console.error('Error updating menu data:', error);
      toast.error('Failed to update menu data.');
    }
  };

  const handleAddItem = () => {
    if (!menuData) return;
    if (!newItem.name_en || !newItem.price) {
      toast.error("Name (English) and price are required");
      return;
    }

    const updatedMenu = { ...menuData };
    updatedMenu[selectedCategory] = [...updatedMenu[selectedCategory], newItem];
    updateMenuData(updatedMenu);

    setNewItem({
      name_en: "",
      description_en: "",
      ingredients_en: "",
      name_tr: "",
      description_tr: "",
      ingredients_tr: "",
      price: "",
    });
  };

  const handleEditItem = (category: Category, index: number) => {
    if (!menuData) return;
    setEditingItem({ category, index });
    setNewItem(menuData[category][index]);
  };

  const handleSaveEdit = () => {
    if (!editingItem || !menuData) return;
    if (!newItem.name_en || !newItem.price) {
      toast.error("Name (English) and price are required");
      return;
    }

    const updatedMenu = { ...menuData };
    updatedMenu[editingItem.category][editingItem.index] = newItem;
    updateMenuData(updatedMenu);

    setEditingItem(null);
    setNewItem({
      name_en: "",
      description_en: "",
      ingredients_en: "",
      name_tr: "",
      description_tr: "",
      ingredients_tr: "",
      price: "",
    });
  };

  const handleDeleteItem = (category: Category, index: number) => {
    if (!menuData) return;
    const updatedMenu = { ...menuData };
    updatedMenu[category] = updatedMenu[category].filter((_, i) => i !== index);
    updateMenuData(updatedMenu);
  };

  const handleLogout = () => {
    Cookies.remove("adminToken");
    router.push("/admin");
  };

  const toggleCategory = (category: Category) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  if (!menuData) {
    return (
      <div className="min-h-screen bg-[#f5e8c9] p-8 flex justify-center items-center">
        <p className="text-amber-950">Loading menu data...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5e8c9] p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-serif text-amber-950">Menu Management</h1>
          <Button
            variant="outline"
            onClick={handleLogout}
            className="border-amber-950 text-amber-950 hover:bg-amber-950/10"
          >
            Logout
          </Button>
        </div>

        {/* Add/Edit Item Form */}
        <Card className="border-4 border-double border-amber-950/40 bg-[#f5e8c9] shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-serif text-amber-950">
              {editingItem ? "Edit Menu Item" : "Add Menu Item"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-amber-950">Category</Label>
                  <select
                    className="w-full p-2 border border-amber-950/40 rounded-md bg-[#f5e8c9] text-amber-950"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value as Category)}
                    disabled={!!editingItem}
                  >
                    <option value="salads">Salads</option>
                    <option value="snacks">Snacks</option>
                    <option value="pastas">Pastas</option>
                    <option value="mainDishes">Main Dishes</option>
                    <option value="desserts">Desserts</option>
                    <option value="coldBeverages">Cold Beverages</option>
                    <option value="coffee">Coffee</option>
                    <option value="tea">Tea</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label className="text-amber-950">Name (English)</Label>
                  <Input
                    value={newItem.name_en}
                    onChange={(e) => setNewItem({ ...newItem, name_en: e.target.value })}
                    placeholder="Item name in English"
                    className="border-amber-950/40 bg-[#f5e8c9] text-amber-950"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-2">
                    <Label className="text-amber-950">Description (English)</Label>
                    <Input
                      value={newItem.description_en}
                      onChange={(e) => setNewItem({ ...newItem, description_en: e.target.value })}
                      placeholder="Item description in English"
                      className="border-amber-950/40 bg-[#f5e8c9] text-amber-950"
                    />
                 </div>
                 <div className="space-y-2">
                    <Label className="text-amber-950">Ingredients (English)</Label>
                    <Input
                      value={newItem.ingredients_en}
                      onChange={(e) => setNewItem({ ...newItem, ingredients_en: e.target.value })}
                      placeholder="Item ingredients in English"
                      className="border-amber-950/40 bg-[#f5e8c9] text-amber-950"
                    />
                 </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-2">
                    <Label className="text-amber-950">Name (Turkish)</Label>
                    <Input
                      value={newItem.name_tr}
                      onChange={(e) => setNewItem({ ...newItem, name_tr: e.target.value })}
                      placeholder="Item name in Turkish"
                      className="border-amber-950/40 bg-[#f5e8c9] text-amber-950"
                    />
                 </div>
                 <div className="space-y-2">
                    <Label className="text-amber-950">Description (Turkish)</Label>
                    <Input
                      value={newItem.description_tr}
                      onChange={(e) => setNewItem({ ...newItem, description_tr: e.target.value })}
                      placeholder="Item description in Turkish"
                      className="border-amber-950/40 bg-[#f5e8c9] text-amber-950"
                    />
                 </div>
              </div>
               <div className="space-y-2">
                  <Label className="text-amber-950">Ingredients (Turkish)</Label>
                  <Input
                    value={newItem.ingredients_tr}
                    onChange={(e) => setNewItem({ ...newItem, ingredients_tr: e.target.value })}
                    placeholder="Item ingredients in Turkish"
                    className="border-amber-950/40 bg-[#f5e8c9] text-amber-950"
                  />
               </div>
              <div className="space-y-2">
                <Label className="text-amber-950">Price</Label>
                <Input
                  value={newItem.price}
                  onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                  placeholder="Item price (e.g., 85 TL)"
                  className="border-amber-950/40 bg-[#f5e8c9] text-amber-950"
                />
              </div>
              <div className="flex gap-2">
                {editingItem ? (
                  <>
                    <Button
                      onClick={handleSaveEdit}
                      className="bg-amber-950 text-[#f5e8c9] hover:bg-amber-900"
                    >
                      Save Changes
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setEditingItem(null);
                        setNewItem({
                          name_en: "",
                          description_en: "",
                          ingredients_en: "",
                          name_tr: "",
                          description_tr: "",
                          ingredients_tr: "",
                          price: "",
                        });
                      }}
                      className="border-amber-950 text-amber-950 hover:bg-amber-950/10"
                    >
                      Cancel
                    </Button>
                  </>
                ) : (
                  <Button
                    onClick={handleAddItem}
                    className="bg-amber-950 text-[#f5e8c9] hover:bg-amber-900"
                  >
                    Add Item
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Menu Categories */}
        <div className="space-y-6">
          {(Object.entries(menuData) as [Category, MenuItem[]][]).map(([category, items]) => (
            <Card key={category} className="border-4 border-double border-amber-950/40 bg-[#f5e8c9] shadow-lg">
              <CardHeader>
                <button
                  onClick={() => toggleCategory(category)}
                  className="w-full flex justify-between items-center"
                >
                  <CardTitle className="text-2xl font-serif text-amber-950">
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </CardTitle>
                  {expandedCategories[category] ? (
                    <ChevronUp className="h-5 w-5 text-amber-950" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-amber-950" />
                  )}
                </button>
              </CardHeader>
              <CardContent>
                <div
                  className={cn(
                    "grid gap-4 transition-all duration-300 ease-in-out overflow-hidden",
                    expandedCategories[category] ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  )}
                >
                  <div className="min-h-0">
                    {Array.isArray(items) && items.length > 0 ? (
                      items.map((item: MenuItem, index: number) => (
                        <div key={index} className="mb-6 last:mb-0 p-4 border border-amber-950/30 rounded-lg">
                          <div className="flex justify-between items-start">
                            <div className="flex-grow">
                              <div className="flex justify-between items-baseline">
                                <h3 className="text-xl font-medium text-amber-950">{item.name_en} / {item.name_tr}</h3>
                                <span className="text-xl font-medium text-amber-950">{item.price}</span>
                              </div>
                              {item.description_en && <p className="text-amber-950/80 italic">EN: {item.description_en}</p>}
                               {item.description_tr && <p className="text-amber-950/80 italic">TR: {item.description_tr}</p>}
                              {item.ingredients_en && <p className="text-sm text-amber-950/70">EN: {item.ingredients_en}</p>}
                              {item.ingredients_tr && <p className="text-sm text-amber-950/70">TR: {item.ingredients_tr}</p>}
                            </div>
                            <div className="flex gap-2 ml-4">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEditItem(category, index)}
                                className="border-amber-950 text-amber-950 hover:bg-amber-950/10"
                              >
                                <Edit2 className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDeleteItem(category, index)}
                                className="border-amber-950 text-amber-950 hover:bg-amber-950/10"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : ( expandedCategories[category] && (
                      <p className="text-amber-950/60 text-center py-4">No items in this category</p>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
} 