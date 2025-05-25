import { NextResponse } from 'next/server';
import { supabase, type MenuData, type Category, type MenuItem } from '@/app/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Fetch categories and their associated items from Supabase
    const { data: categories, error: categoriesError } = await supabase
      .from('categories')
      .select(`
        *,
        items (
          id,
          name,
          name_tr,
          description,
          description_tr,
          price,
          image_url,
          is_vegetarian,
          is_vegan
        )
      `)
      .order('id', { ascending: true });

    // Order items within each category
    if (categories) {
      categories.forEach((category: Category) => {
        if (category.items) {
          category.items.sort((a: MenuItem, b: MenuItem) => a.id.localeCompare(b.id));
        }
      });
    }

    if (categoriesError) {
      console.error('Error fetching categories:', categoriesError);
      return NextResponse.json(
        { error: 'Failed to fetch menu data' },
        { status: 500 }
      );
    }

    // Transform the data to the desired MenuData structure
    const menuData: MenuData = {
      categories: categories || [], // Ensure categories is an array
    };

    return NextResponse.json(menuData);
  } catch (error) {
    console.error('Error in GET /api/menu:', error);
    return NextResponse.json(
      { error: 'Failed to fetch menu data' },
      { status: 500 }
    );
  }
}

// This POST route will be used by the admin dashboard to update menu data
export async function POST(request: Request) {
  try {
    const updatedMenuData: MenuData = await request.json();

    // For simplicity, this example will overwrite existing data.
    // A more robust solution would handle individual category/item updates/deletions.

    // Start a transaction to ensure data consistency
    const { data: existingCategories, error: fetchError } = await supabase
      .from('categories')
      .select('id')
      .order('id');

    if (fetchError) {
      console.error('Error fetching existing categories:', fetchError);
      throw new Error('Failed to fetch existing menu data');
    }

    // Prepare data for batch operations
    const categoryUpserts = updatedMenuData.categories.map(category => ({
      id: category.id,
      name: category.name,
      name_tr: category.name_tr,
      description: category.description || null,
      description_tr: category.description_tr || null,
    }));

    const itemUpserts = updatedMenuData.categories.flatMap(category => 
      (category.items || []).map(item => ({
        ...item,
        category_id: category.id,
        description: item.description || null,
        description_tr: item.description_tr || null,
      }))
    );

    // Perform batch operations
    const { error: upsertCatError } = await supabase
      .from('categories')
      .upsert(categoryUpserts);

    const { error: upsertItemError } = await supabase
      .from('items')
      .upsert(itemUpserts);

    if (upsertCatError || upsertItemError) {
      console.error('Error updating data:', upsertCatError || upsertItemError);
      throw new Error('Failed to update menu data');
    }

    // Insert updated categories and items
    for (const category of updatedMenuData.categories) {
      const { data: insertedCategory, error: insertCategoryError } = await supabase
        .from('categories')
        .insert({ id: category.id, name: category.name })
        .select();

      if (insertCategoryError) {
        console.error('Error inserting category:', insertCategoryError);
        throw new Error(`Failed to insert category ${category.name}`);
      }

      if (insertedCategory && insertedCategory[0]) {
        for (const item of category.items) {
          const { error: insertItemError } = await supabase.from('items').insert({
            id: item.id,
            name: item.name,
            description: item.description,
            price: item.price,
            image_url: item.image_url,
            category_id: insertedCategory[0].id, // Link item to the inserted category
          });

          if (insertItemError) {
            console.error('Error inserting item:', insertItemError);
            throw new Error(`Failed to insert item ${item.name}`);
          }
        }
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in POST /api/menu:', error);
    return NextResponse.json(
      { error: 'Failed to update menu data' },
      { status: 500 }
    );
  }
} 