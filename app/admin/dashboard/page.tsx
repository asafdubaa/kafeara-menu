'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import Cookies from 'js-cookie';
import { type MenuData, type Category, type MenuItem } from '@/app/lib/supabase';

export default function AdminDashboard() {
  const router = useRouter();
  const [menuData, setMenuData] = useState<MenuData | null>(null);
  const [newCategory, setNewCategory] = useState({
    name: '',
    name_tr: '',
    description: '',
    description_tr: ''
  });
  const [newItem, setNewItem] = useState<{
    category_id: string;
    name: string;
    name_tr: string;
    description: string;
    description_tr: string;
    price: string;
    is_vegetarian: boolean;
    is_vegan: boolean;
    image_url: string | null;
  }>({
    category_id: '',
    name: '',
    name_tr: '',
    description: '',
    description_tr: '',
    price: '',
    is_vegetarian: false,
    is_vegan: false,
    image_url: null
  });

  useEffect(() => {
    const token = Cookies.get('admin-token');
    if (!token) {
      router.push('/admin/login');
      return;
    }

    const fetchMenuData = async () => {
      try {
        const response = await fetch('/api/menu');
        const data = await response.json();
        // Assuming the API returns data in the MenuData structure { categories: [] }
        if (data && data.categories) {
          setMenuData(data);
        } else {
           // Handle unexpected data structure
           console.error('Unexpected data structure from API:', data);
           toast.error('Failed to fetch menu data: Unexpected format');
        }
      } catch (error) {
        console.error('Error fetching menu data:', error);
        toast.error('Failed to fetch menu data');
      }
    };

    fetchMenuData();
  }, [router]);

  const handleLogout = () => {
    Cookies.remove('admin-token');
    router.push('/admin/login');
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
    
    setNewCategory(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleItemChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
    
    setNewItem(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleAddCategory = async () => {
    if (!newCategory.name.trim()) {
      toast.error('Category name (English) is required');
      return;
    }

    if (!newCategory.name_tr.trim()) {
      toast.error('Category name (Turkish) is required');
      return;
    }

    if (!menuData) return;

    // Generate a simple ID for the new category (you might use UUIDs in production)
    const newCategoryId = Date.now().toString();

    const updatedData: MenuData = {
      categories: [ 
        ...(menuData.categories || []), // Ensure categories is an array
        {
          id: newCategoryId,
          name: newCategory.name.trim(),
          name_tr: newCategory.name_tr.trim(),
          description: newCategory.description.trim() || null,
          description_tr: newCategory.description_tr.trim() || null,
          items: [],
        },
      ],
    };

    try {
      const response = await fetch('/api/menu', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) throw new Error('Failed to update menu');

      const result = await response.json(); // Read the response to avoid body stream errors
      setMenuData(updatedData);
      setNewCategory({
        name: '',
        name_tr: '',
        description: '',
        description_tr: ''
      });
      toast.success('Category added successfully');
    } catch (error) {
      console.error('Error adding category:', error);
      toast.error('Failed to add category');
    }
  };

  const handleAddItem = async () => {
    if (!newItem.category_id || !newItem.name.trim() || !newItem.name_tr.trim() || !newItem.price) {
      toast.error('Please fill in all required fields (including both English and Turkish names)');
      return;
    }

    if (!menuData) return;

    const categoryIndex = menuData.categories.findIndex(cat => cat.id === newItem.category_id);

    if (categoryIndex === -1) {
      toast.error('Invalid category selected');
      return;
    }

    const newItemData: MenuItem = {
      id: Date.now().toString(),
      category_id: newItem.category_id,
      name: newItem.name.trim(),
      name_tr: newItem.name_tr.trim(),
      description: newItem.description.trim() || null,
      description_tr: newItem.description_tr.trim() || null,
      price: parseFloat(newItem.price),
      image_url: null,
      is_vegetarian: newItem.is_vegetarian || false,
      is_vegan: newItem.is_vegan || false,
    };

    const updatedCategories = [...(menuData.categories || [])];
    updatedCategories[categoryIndex] = {
      ...updatedCategories[categoryIndex],
      items: [...updatedCategories[categoryIndex].items, newItemData],
    };

    const updatedData: MenuData = { categories: updatedCategories };

    try {
      const response = await fetch('/api/menu', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) throw new Error('Failed to update menu');

      const result = await response.json(); // Read the response
      setMenuData(updatedData);
      setNewItem({
        category_id: '',
        name: '',
        name_tr: '',
        description: '',
        description_tr: '',
        price: '',
        is_vegetarian: false,
        is_vegan: false,
        image_url: null
      });
      toast.success('Item added successfully');
    } catch (error) {
      console.error('Error adding item:', error);
      toast.error('Failed to add item');
    }
  };

  const handleEditItem = (item: MenuItem) => {
    setNewItem({
      category_id: item.category_id,
      name: item.name,
      name_tr: item.name_tr,
      description: item.description || '',
      description_tr: item.description_tr || '',
      price: item.price.toString(),
      is_vegetarian: item.is_vegetarian,
      is_vegan: item.is_vegan,
      image_url: item.image_url
    });
    // Scroll to the form
    document.getElementById('add-item-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleDeleteCategory = async (categoryId: string) => {
    if (!menuData) return;

    const updatedCategories = (menuData.categories || []).filter(cat => cat.id !== categoryId);
    const updatedData: MenuData = { categories: updatedCategories };

    try {
      const response = await fetch('/api/menu', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) throw new Error('Failed to update menu');

      const result = await response.json(); // Read the response
      setMenuData(updatedData);
      toast.success('Category deleted successfully');
    } catch (error) {
      console.error('Error deleting category:', error);
      toast.error('Failed to delete category');
    }
  };

  const handleDeleteItem = async (categoryId: string, itemId: string) => {
    if (!confirm('Are you sure you want to delete this item? This action cannot be undone.')) {
      return;
    }

    if (!menuData) return;

    const updatedCategories = menuData.categories.map((category) => {
      if (category.id === categoryId) {
        return {
          ...category,
          items: category.items.filter((item) => item.id !== itemId),
        };
      }
      return category;
    });

    const updatedData: MenuData = { categories: updatedCategories };

    try {
      const response = await fetch('/api/menu', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) throw new Error('Failed to delete item');

      setMenuData(updatedData);
      toast.success('Item deleted successfully');
    } catch (error) {
      console.error('Error deleting item:', error);
      toast.error('Failed to delete item');
    }
  };

  if (!menuData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <Button variant="outline" onClick={handleLogout}>
          Logout
        </Button>
      </div>

      <div className="grid gap-8">
        {/* Add Category Section */}
        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4">Add Category</h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <div>
                  <Label htmlFor="name">Category Name (English) *</Label>
                  <Input
                    id="name"
                    name="name"
                    value={newCategory.name}
                    onChange={handleCategoryChange}
                    placeholder="Enter category name in English"
                  />
                </div>
                <div>
                  <Label htmlFor="name_tr">Category Name (Turkish) *</Label>
                  <Input
                    id="name_tr"
                    name="name_tr"
                    value={newCategory.name_tr}
                    onChange={handleCategoryChange}
                    placeholder="Enter category name in Turkish"
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description (English)</Label>
                  <Input
                    id="description"
                    name="description"
                    value={newCategory.description}
                    onChange={handleCategoryChange}
                    placeholder="Enter description in English"
                  />
                </div>
                <div>
                  <Label htmlFor="description_tr">Description (Turkish)</Label>
                  <Input
                    id="description_tr"
                    name="description_tr"
                    value={newCategory.description_tr}
                    onChange={handleCategoryChange}
                    placeholder="Enter description in Turkish"
                  />
                </div>
              </div>
              <Button 
                onClick={handleAddCategory} 
                className="w-full"
                disabled={!newCategory.name.trim() || !newCategory.name_tr.trim()}
              >
                Add Category
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Add Item Section */}
        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4">Add Item</h2>
            <div className="grid gap-4">
              <div>
                <Label>Category</Label>
                <select
                  className="w-full p-2 border rounded"
                  value={newItem.category_id}
                  onChange={(e) =>
                    setNewItem((prev) => ({ ...prev, category_id: e.target.value }))
                  }
                >
                  <option value="">Select a category</option>
                  {(menuData.categories || []).map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label>Name (English)</Label>
                <Input
                  value={newItem.name}
                  onChange={(e) =>
                    setNewItem((prev) => ({ ...prev, name: e.target.value }))
                  }
                />
              </div>
              <div>
                <Label>Name (Turkish)</Label>
                <Input
                  value={newItem.name_tr}
                  onChange={(e) =>
                    setNewItem((prev) => ({ ...prev, name_tr: e.target.value }))
                  }
                />
              </div>
              <div>
                <Label>Description (English)</Label>
                <Input
                  value={newItem.description}
                  name="description"
                  onChange={handleItemChange}
                  placeholder="Enter description in English"
                />
              </div>
              <div>
                <Label>Description (Turkish)</Label>
                <Input
                  value={newItem.description_tr}
                  name="description_tr"
                  onChange={handleItemChange}
                  placeholder="Enter description in Turkish"
                />
              </div>
              <div>
                <Label>Price *</Label>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  name="price"
                  value={newItem.price}
                  onChange={handleItemChange}
                  placeholder="Enter price"
                />
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="is_vegetarian"
                    name="is_vegetarian"
                    checked={newItem.is_vegetarian}
                    onChange={handleItemChange}
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <Label htmlFor="is_vegetarian" className="text-sm font-medium text-gray-700">
                    Vegetarian
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="is_vegan"
                    name="is_vegan"
                    checked={newItem.is_vegan}
                    onChange={handleItemChange}
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <Label htmlFor="is_vegan" className="text-sm font-medium text-gray-700">
                    Vegan
                  </Label>
                </div>
              </div>
              <Button 
                onClick={handleAddItem} 
                className="w-full"
                disabled={!newItem.category_id || !newItem.name.trim() || !newItem.name_tr.trim() || !newItem.price}
              >
                Add Item
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Menu Preview Section */}
        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4">Menu Preview</h2>
            <div className="grid gap-4">
              {(menuData.categories || []).map((category) => (
                <div key={category.id} className="border rounded p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium">{category.name}</h3>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteCategory(category.id)}
                    >
                      Delete Category
                    </Button>
                  </div>
                  <div className="grid gap-2">
                    {(category.items || []).map((item) => (
                      <div
                        key={item.id}
                        className="flex justify-between items-center p-2 bg-accent/50 rounded"
                      >
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {item.description}
                          </p>
                          <p className="text-sm">${item.price}</p>
                        </div>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteItem(category.id, item.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 