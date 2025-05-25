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
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newItem, setNewItem] = useState({
    category_id: '',
    name: '',
    description: '',
    price: '',
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

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) {
      toast.error('Category name is required');
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
          name: newCategoryName,
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
      setNewCategoryName('');
      toast.success('Category added successfully');
    } catch (error) {
      console.error('Error adding category:', error);
      toast.error('Failed to add category');
    }
  };

  const handleAddItem = async () => {
    if (!newItem.category_id || !newItem.name || !newItem.price) {
      toast.error('All fields are required');
      return;
    }

    if (!menuData) return;

    const categoryIndex = menuData.categories.findIndex(cat => cat.id === newItem.category_id);

    if (categoryIndex === -1) {
      toast.error('Invalid category selected');
      return;
    }

    const item: MenuItem = {
      id: Date.now().toString(), // Simple ID generation
      name: newItem.name,
      description: newItem.description || null,
      price: parseFloat(newItem.price),
      image_url: null, // Add image URL if you have it
    };

    const updatedCategories = [...(menuData.categories || [])];
    updatedCategories[categoryIndex] = {
      ...updatedCategories[categoryIndex],
      items: [...updatedCategories[categoryIndex].items, item],
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
        description: '',
        price: '',
      });
      toast.success('Item added successfully');
    } catch (error) {
      console.error('Error adding item:', error);
      toast.error('Failed to add item');
    }
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
    if (!menuData) return;

    const updatedCategories = (menuData.categories || []).map(category => {
      if (category.id === categoryId) {
        return {
          ...category,
          items: category.items.filter(item => item.id !== itemId),
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

      if (!response.ok) throw new Error('Failed to update menu');

      const result = await response.json(); // Read the response
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
            <div className="flex gap-4">
              <Input
                placeholder="Category name"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
              />
              <Button onClick={handleAddCategory}>Add Category</Button>
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
                <Label>Name</Label>
                <Input
                  value={newItem.name}
                  onChange={(e) =>
                    setNewItem((prev) => ({ ...prev, name: e.target.value }))
                  }
                />
              </div>
              <div>
                <Label>Description</Label>
                <Input
                  value={newItem.description || ''}
                  onChange={(e) =>
                    setNewItem((prev) => ({ ...prev, description: e.target.value }))
                  }
                />
              </div>
              <div>
                <Label>Price</Label>
                <Input
                  type="number"
                  value={newItem.price}
                  onChange={(e) =>
                    setNewItem((prev) => ({ ...prev, price: e.target.value }))
                  }
                />
              </div>
              <Button onClick={handleAddItem}>Add Item</Button>
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