'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { type MenuData, type MenuItem, type Category } from '@/app/lib/supabase';

export default function MenuCard() {
  const [isClient, setIsClient] = useState(false);
  const [menuData, setMenuData] = useState<MenuData | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<{ [key: string]: boolean }>({});
  const [selectedLanguage, setSelectedLanguage] = useState<'en' | 'ar'>('en');

  useEffect(() => {
    setIsClient(true);
    const storedLang = localStorage.getItem('selectedLanguage') as 'en' | 'ar';
    if (storedLang) {
      setSelectedLanguage(storedLang);
    }
  }, []);

  useEffect(() => {
    const fetchMenuData = async () => {
      try {
        const response = await fetch('/api/menu');
        const data = await response.json();
        setMenuData(data);
      } catch (error) {
        console.error('Error fetching menu data:', error);
      }
    };

    fetchMenuData();
  }, []);

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };

  if (!isClient || !menuData) {
    return null;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-end mb-4">
        <Button
          variant="outline"
          onClick={() => {
            const newLang = selectedLanguage === 'en' ? 'ar' : 'en';
            setSelectedLanguage(newLang);
            localStorage.setItem('selectedLanguage', newLang);
          }}
        >
          {selectedLanguage === 'en' ? 'العربية' : 'English'}
        </Button>
      </div>
      <div className="grid gap-4">
        {menuData.categories.map((category) => (
          <Card key={category.id} className="overflow-hidden">
            <CardContent className="p-0">
              <div
                className="p-4 flex justify-between items-center cursor-pointer hover:bg-accent/50"
                onClick={() => toggleCategory(category.id)}
              >
                <h2 className="text-xl font-semibold">
                  {selectedLanguage === 'en' ? category.name : category.name}
                </h2>
                {expandedCategories[category.id] ? (
                  <ChevronUp className="h-5 w-5" />
                ) : (
                  <ChevronDown className="h-5 w-5" />
                )}
              </div>
              {expandedCategories[category.id] && (
                <div className="p-4 pt-0">
                  <div className="grid gap-4">
                    {category.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex justify-between items-start p-2 hover:bg-accent/50 rounded-lg"
                      >
                        <div>
                          <h3 className="font-medium">{item.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {item.description}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">
                            {selectedLanguage === 'en' ? `$${item.price}` : `${item.price} ريال`}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
} 