'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { type MenuData, type MenuItem, type Category } from '@/app/lib/supabase';

type Language = 'en' | 'tr';

export default function MenuCard() {
  const [isClient, setIsClient] = useState(false);
  const [menuData, setMenuData] = useState<MenuData | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<{ [key: string]: boolean }>({});
  const [selectedLanguage, setSelectedLanguage] = useState<Language>('en');

  const toggleLanguage = () => {
    const newLang: Language = selectedLanguage === 'en' ? 'tr' : 'en';
    setSelectedLanguage(newLang);
    localStorage.setItem('selectedLanguage', newLang);
  };

  useEffect(() => {
    setIsClient(true);
    const storedLang = localStorage.getItem('selectedLanguage') as Language | null;
    if (storedLang === 'en' || storedLang === 'tr') {
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
          onClick={toggleLanguage}
        >
          {selectedLanguage === 'en' ? 'Türkçe' : 'English'}
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
                <div>
                  <h2 className="text-xl font-semibold">
                    {selectedLanguage === 'en' ? category.name : category.name_tr}
                  </h2>
                  {category.description && (
                    <p className="text-sm text-muted-foreground">
                      {selectedLanguage === 'en' ? category.description : category.description_tr}
                    </p>
                  )}
                </div>
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
                          <div>
                            <h3 className="font-medium inline">
                              {selectedLanguage === 'en' ? item.name : item.name_tr}
                            </h3>
                            {item.is_vegetarian && (
                              <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                                {selectedLanguage === 'en' ? 'Vegetarian' : 'Vejetaryen'}
                              </span>
                            )}
                            {item.is_vegan && (
                              <span className="ml-1 text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                                {selectedLanguage === 'en' ? 'Vegan' : 'Vegan'}
                              </span>
                            )}
                          </div>
                          {item.description && (
                            <p className="text-sm text-muted-foreground">
                              {selectedLanguage === 'en' ? item.description : item.description_tr}
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="font-medium whitespace-nowrap">
                            {selectedLanguage === 'en' ? `$${item.price}` : `${item.price} TL`}
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