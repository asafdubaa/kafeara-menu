-- Create categories table if not exists
CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  name_en TEXT NOT NULL,
  name_tr TEXT,
  display_order INTEGER NOT NULL
);

-- Create menu_items table if not exists
CREATE TABLE IF NOT EXISTS menu_items (
  id SERIAL PRIMARY KEY,
  category_id INTEGER REFERENCES categories(id) ON DELETE CASCADE,
  name_en TEXT NOT NULL,
  name_tr TEXT,
  description_en TEXT,
  description_tr TEXT,
  price INTEGER NOT NULL,
  is_vegetarian BOOLEAN DEFAULT false,
  is_vegan BOOLEAN DEFAULT false,
  display_order INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert categories
INSERT INTO categories (name_en, name_tr, display_order) VALUES
('Salads', 'Salatalar', 1),
('Snacks', 'Atıştırmalıklar', 2),
('Pastas', 'Makarnalar', 3),
('Main Dishes', 'Ana Yemekler', 4),
('Desserts', 'Tatlılar', 5),
('Cold Beverages', 'Meşrubat', 6),
('Coffee', 'Kahve', 7),
('Tea', 'Çay', 8)
ON CONFLICT DO NOTHING;

-- Insert menu items
-- Salads
INSERT INTO menu_items (category_id, name_en, name_tr, description_en, description_tr, price, is_vegetarian, is_vegan, display_order) VALUES
(1, 'Crispy Chicken Salad', 'Çıtır Tavuk Salatası', 'Mixed greens served with fried 180 gr. chicken pieces coated with spicy corn chips, marinated sun dried tomato, capers, green olives from Edremit, radish, lentil sprouts and fresh herbs vinaigrette', 'Mısır gevreği ile kaplanıp kızartılmış 180 gr tavuk göğsü dilimleri, marine edilmiş kuru domates, kapari, yeşil kırma Edremit zeytini, turp dilimleri, mercimek filizi, karışık yeşillikler ve taze otlu vinegret', 395, false, false, 1),
(1, 'Honey Mustard Chicken Salad', 'Hardal Soslu Tavuk Salatası', '230 gr. pan-fried slices of chicken marinated with honey mustard sauce served with mixed greens, quinoa, pomegranate and fresh herbs vinaigrette', 'Ballı hardal sos ile marine edilip döküm tavada pişirilmiş 230 gr tavuk budu dilimleri, kinoa, nar, karışık yeşillikler ve taze otlu vinegret', 425, false, false, 2),
(1, 'Black Eyed Pea and Courgette Salad with Grilled Sea Bass', 'Levrekli Kuru Börülce ve Izgara Kabak Salatası', 'Cast iron grilled fillet of sea bass (120 gr.) served on grilled ribbons of courgette, black eyed peas, green olives from Edremit, fresh chili flakes, scallion, rocket and mint leaves and fresh herbs vinaigrette', 'Izgara kabak şeritleri, haşlanmış kuru börülce, yeşil kırma Edremit zeytini, acı Meksika biberi parçacıkları, yeşil soğan, roka ve nane yaprakları üzerinde döküm tavada ızgara edilmiş 120 gr levrek filetosu ve taze otlu vinegret', 470, false, false, 3),
(1, 'Farro Salad with Pomegranate Sauce', 'Nar Ekşili Buğday ve Baklagil Salatası', 'Farro salad with black eyed peas, green lentil, fresh herbs, scallion, rocket leaves, lentil sprouts, pomegranate, toasted almond, crumbled white cheese and special pomegranate sauce', 'Haşlanmış buğday, kuru börülce ve yeşil mercimek ile karıştırılmış maydanoz, nane, fesleğen, roka, taze soğan, nar, mercimek filizi, kavrulmuş badem, ufalanmış Ezine beyaz peyniri ve özel nar ekşisi sosu', 390, true, false, 4),
(1, 'Goat Cheese Salad with Almonds', 'Bademli Keçi Peynirli Salata', 'Mixed greens served with warm goat cheese, roasted almond, dried barberry and special pomegranate sauce', 'Ilık keçi peyniri, kavrulmuş badem, nar, özel nar ekşisi sosu ve karışık yeşillikler', 390, true, false, 5),
(1, 'Ara Salad', 'Ara Salata', 'Yedikule lettuce, half avocado, green apple, Mihaliç cheese, walnut, special lime vinaigrette', 'Yedikule marul, yarım avokado, yeşil elma, Mihaliç peyniri, ceviz, özel lime vinegret', 330, true, false, 6),
(1, 'Vegan Farro Salad with Pomegranate Sauce', 'Vegan Buğday ve Baklagil Salatası', '', '', 350, true, true, 7)
ON CONFLICT DO NOTHING;

-- Snacks
INSERT INTO menu_items (category_id, name_en, name_tr, description_en, description_tr, price, is_vegetarian, is_vegan, display_order) VALUES
(2, 'Tulum Cheese Eggplant Panini', 'Tulum Peynirli Köz Patlıcanlı Tost', 'Slices of Bergama tulum cheese, charred eggplant purée and thyme toasted in between slices of sourdough bread; served with green salad with fresh herbs vinaigrette', 'Ekşi mayalı ekmek dilimleri arasında Bergama tulum peyniri, közlenmiş patlıcan ve kekik tost edilmiş; taze otlu vinegretli karışık yeşillikler eşliğinde', 330, true, false, 1),
(2, 'Chicken and Mushroom Wrap', 'Tavuklu Mantarlı Dürüm', 'Lavaş wrap with chicken, mushroom and red onion sautéed with cream and smoky Çerkez cheese; served with pommes frittes', 'İnce lavaş ekmeğine sarılmış isli Çerkez peyniri, krema ile sote edilmiş tavuk göğsü parçaları, istiridye ve kültür mantarları ve kırmızı soğan; kızarmış patates eşliğinde', 420, false, false, 2),
(2, 'Fried Balls of Zucchini and Potato', 'Kabaklı Patatesli Mücver', '4 pieces of fried balls of zucchini, potato, Edremit sepet cheese and fresh herbs; served with yoghurt sauce with cucumber and fresh herbs', 'Kabak, patates, Edremit sepet peyniri, taze yeşilliklerle yapıp çıtır ekmek kırıntısıyla kaplayıp kızarttığımız unsuz ve yumurtasız 4 adet mücver; salatalıklı ve taze yeşillikli süzme yoğurt sosu eşliğinde', 380, true, false, 3),
(2, 'Crisp Basket', 'Kıtır Sepet', '280 gr. fried chicken pieces coated with spicy corn chips and pommes frittes; served with creamy mustard sauce and pickled cucumber', 'Mısır gevreği ile kaplanıp kızartılmış 280 gr tavuk göğsü dilimleri ve kızarmış patates; salatalık turşusu ve özel hardal sos eşliğinde', 450, false, false, 4),
(2, 'Puff Beurreck (with Minced Meat)', 'Puf Böreği (Kıymalı)', '5 pieces of fried beurrecks with minced meat filling; served with green salad with fresh herbs vinaigrette', '5 adet elde açılmış ve kızartılmış puf böreği hamuru içinde kıymalı veya lor peynirli karışım; taze otlu vinegretli karışık yeşillikler eşliğinde', 420, false, false, 5),
(2, 'Puff Beurreck (with Lor Cheese)', 'Puf Böreği (Lor Peynirli)', '5 pieces of fried beurrecks with lor cheese filling; served with green salad with fresh herbs vinaigrette', '5 adet elde açılmış ve kızartılmış puf böreği hamuru içinde kıymalı veya lor peynirli karışım; taze otlu vinegretli karışık yeşillikler eşliğinde', 420, true, false, 6),
(2, 'Falafel Plate', 'Falafel Tabağı', '7 fried of falafel balls served with lemon-tahini sauce, leaves of Yedikule lettuce, slices of tomato, pickled cucumber and thin slices of red onion with fresh herbs vinaigrette', 'Nohut, kişniş, maydanoz, çeşitli baharatlar, soğan, sarımsak ile yoğurulup kızartılmış 7 adet falafel topu; ekşili tahin sos, taze otlu vinegretli Yedikule marulu yaprakları, domates dilimleri, salatalık turşusu ve ince kırmızı soğan dilimleri eşliğinde', 400, true, true, 7),
(2, 'Pommes Frittes', 'Kızarmış Patates', '', '', 250, true, true, 8),
(2, 'Soup Of The Day', 'Günün Çorbası', '', '', 160, true, true, 9)
ON CONFLICT DO NOTHING;

-- Pastas
INSERT INTO menu_items (category_id, name_en, name_tr, description_en, description_tr, price, is_vegetarian, is_vegan, display_order) VALUES
(3, 'Penne with Three Kinds of Mushroom and Smoked Beef Rib Sauce', 'Üç Mantarlı ve Füme Etli Makarna', 'Penne served with a creamy sauce of three kinds of mushrooms, 40 gr. smoked beef rib, spinach leaves, sun dried tomato and curry, fresh basil and parmesan cheese', 'Kültür, kestane ve kayın mantarlı, 40 gr füme dana kaburgalı, ıspanak yapraklı, kuru domatesli, körili, hafif kremalı sos, fesleğen yaprakları ve parmesan peyniri eşliğinde penne', 450, false, false, 1),
(3, 'Penne with Sun-dried Tomato Paste and Lor Cheese', 'Kurutulmuş Domates Pestolu & Ayvalık Lor Peynirli Makarna', 'Penne served with sun-dried tomato pasto, black olives from Ayvalık, lor cheese and basil', 'Kurutulmuş domates pesto, siyah yuvarlama Ayvalık zeytini, Ayvalık lor peyniri ve taze fesleğen eşliğinde penne', 420, true, false, 2),
(3, 'Vegan Penne with Sun-dried Tomato Paste', 'Vegan Kurutulmuş Domates Pestolu Makarna', 'Penne served with sun-dried tomato pasto, black olives from Ayvalık, and basil', 'Kurutulmuş domates pesto, siyah yuvarlama Ayvalık zeytini ve taze fesleğen eşliğinde penne', 420, true, true, 3),
(3, 'Fresh Tagliatelle with Vegetable, Chicken and Soy Sauce', 'Tavuk ve Sebzeli Soyalı Makarna', 'Kafe Ara made fresh tagliatelle served with a sauce of winter vegetables, chicken, soy sauce, spinach leaves, cream, parmesan cheese and fresh basil', 'Karışık kış sebzeli, tavuklu, soyalı, ıspanak yapraklı, kremalı sos, parmesan peyniri ve fesleğen yaprakları eşliğinde Kafe Ara yapımı taze tagliatelle', 440, false, false, 4),
(3, 'Short Egg Tagliatelle with Cheese Sauce', 'Cevizli ve Peynirli Erişte', 'Turkish style short egg tagliatelle served with white cheese and Bergama tulum cheese sauce with butter, walnut, garlic, parsley, dill and scallion', 'Ezine beyaz peynirli ve Bergama tulum peynirli, tereyağlı, cevizli, hafif sarımsaklı, maydanozlu, dereotlu, taze soğanlı sos eşliğinde bol yumurtalı ve sütlü Edremit eriştesi', 425, true, false, 5),
(3, 'Turkish Style Dumplings with Minced Meat', 'Mantı', '200 gr. Turkish style dumplings filled with minced meat; served with yoghurt with garlic and melted butter and olive oil with spices and tomato paste', 'Hafif sarımsaklı yoğurt ve salçalı, baharatlı tereyağı ve zeytinyağı eşliğinde kıymalı 200 gr mantı', 425, false, false, 6)
ON CONFLICT DO NOTHING;

-- Main Dishes
INSERT INTO menu_items (category_id, name_en, name_tr, description_en, description_tr, price, is_vegetarian, is_vegan, display_order) VALUES
(4, 'Hamburger', 'Dana Burger', '150 gr. hamburger patty, mayonnaise with charred eggplant, caramelized onion and pickled cucumber in Kafe Ara made brioche bread; served with pommes frittes', 'Kafe Ara yapımı briyoş ekmeği içinde 150 gr. dana ve kuzu karışımı hamburger köftesi, köz patlıcanlı mayonez, karamelize soğan ve salatalık turşusu; patates kızartması eşliğinde', 530, false, false, 1),
(4, 'Çökertme with Meatballs', 'Köfteli Çökertme', '160 gr. slices of grilled meatballs served on fried potatoes; served with yoghurt, basil tomato sauce and grilled pepper', 'Kızarmış kibrit patates üzerinde 160 gr. ızgara köfte dilimleri, yoğurt, fesleğenli domates sosu ve közlenmiş biber', 520, false, false, 2),
(4, 'Roast Chicken', 'Fırın Tavuk', '300 gr. chicken roasted slowly with rosemary, thyme, sage, carrot, onion, celery stick and garlic cloves; served with roast potatoes with rosemary and rocket leaves with fresh herbs vinaigrette', 'Biberiye, kekik, adaçayı, havuç, soğan, kereviz sapı ve kabuklu sarımsaklarla fırında ağır ağır pişirilmiş 300 gr. tavuk; fırınlanmış sarımsaklı patates püresi ve taze otlu vinegretli roka yaprakları eşliğinde', 510, false, false, 3),
(4, 'Balkan Style Meatballs', 'Balkan Köfte', '160 gr. slices of grilled meatballs served on roasted eggplant purée; served with yoghurt, basil tomato sauce and grilled slices of pepper and tomato', 'Közlenmiş patlıcan püresi üzerinde 160 gr. ızgara köfte dilimleri, fesleğenli domates sosu, yoğurt ve közlenmiş biber ve domates dilimleri', 535, false, false, 4),
(4, 'Grilled Meatballs', 'Izgara Köfte', '200 gr. served with siyez (einkorn) pilaf with roast winter vegetables and rocket leaves with fresh herbs vinaigrette', 'Fırınlanmış kış sebzeli siyez pilavı ve taze otlu vinegretli roka yaprakları eşliğinde 200 gr. ızgara köfte', 515, false, false, 5),
(4, 'Oven Baked Sea Bass', 'Zeytinli Levrek', '120 gr. sea bass ovened with scallion, capers, slices of green olives, roasted almond, basil and slice of orange; served with roasted garlic mashed potatoes', 'Taze soğan, kapari, yeşil zeytin, badem, fesleğen ve portakal dilimi ile fırınlanmış 120 gr levrek filetosu; patates püresi eşliğinde', 550, false, false, 6),
(4, 'Vegetable Dish Of The Day', 'Günün Zeytinyağlısı', '', '', 280, true, true, 7)
ON CONFLICT DO NOTHING;

-- Desserts
INSERT INTO menu_items (category_id, name_en, name_tr, description_en, description_tr, price, is_vegetarian, is_vegan, display_order) VALUES
(5, 'Milk Pudding with Cardamom and Lemon Zest (without Ice-cream)', 'Kakuleli Limon Kabuklu Fırın Sütlaç (Sade)', '', '', 330, true, false, 1),
(5, 'Milk Pudding with Cardamom and Lemon Zest (with Ice-cream)', 'Kakuleli Limon Kabuklu Fırın Sütlaç (Dondurmalı)', '', '', 460, true, false, 2),
(5, 'San Sebastian Cheesecake in a Bowl', 'Kasede San Sebastian Cheesecake', 'Sour Cherry Sauce / Chocolate Sauce / Plain', 'Vişne Sos / Çikolata Sos / Sade', 295, true, false, 3),
(5, 'Wet Chocolate Cake (without Ice-cream)', 'Çikolatalı Islak Kek (Sade)', 'Served with hot chocolate sauce and cream', 'Kafe Ara yapımı çikolata sos ve krema eşliğinde', 335, true, false, 4),
(5, 'Wet Chocolate Cake (with Ice-cream)', 'Çikolatalı Islak Kek (Dondurmalı)', 'Served with hot chocolate sauce and cream', 'Kafe Ara yapımı çikolata sos ve krema eşliğinde', 465, true, false, 5),
(5, 'Gingerbread Cookie', 'Zencefilli Kurabiye', '', '', 45, true, true, 6),
(5, 'Şevki Usta''s Double-Cream Ice Cream', 'Şevki Usta''nın Kaymaklı Dondurması', '100% buffalo milk', '%100 manda sütü', 130, true, false, 7)
ON CONFLICT DO NOTHING;

-- Cold Beverages
INSERT INTO menu_items (category_id, name_en, name_tr, description_en, description_tr, price, is_vegetarian, is_vegan, display_order) VALUES
(6, 'Freshly squeezed fruit juice 300 ml', 'Taze Sıkılmış Meyve Suyu 300 ml', 'Orange / Grapefruit / Apple / Carrot / Mixed', 'Portakal / Greyfurt / Elma / Havuç / Karışık', 160, true, true, 1),
(6, 'Ginger Beer 330 ml', 'Zencefil Gazozu 330 ml', 'Home-made', 'Soda ile kendi yaptığımız yalancı zencefil gazozu', 145, true, true, 2),
(6, 'Lemonade 330 ml', 'Limonata 330 ml', 'Home-made', 'Kafe Ara yapımı', 145, true, true, 3),
(6, 'Uludağ Soda Pop 250 ml', 'Uludağ Efsane Gazoz 250 ml', '', '', 80, true, true, 4),
(6, 'Coca Cola / Fanta / Sprite 300 ml', 'Coca Cola / Fanta / Sprite 300 ml', '', '', 85, true, true, 5),
(6, 'Canned fruit juice 250 ml', 'Cappy Meyve Suyu 250 ml', 'Cherry / Apricot / Peach', 'Vişne / Kayısı / Şeftali', 85, true, true, 6),
(6, 'Ayran 245 ml', 'Ayran 245 ml', '', '', 75, true, true, 7),
(6, 'Sparkling Mineral Water 200 ml', 'Maden Suyu 200 ml', '', '', 70, true, true, 8),
(6, 'Churchill', 'Churchill', '', '', 85, true, true, 9),
(6, 'Spring Water 330 ml', 'Kestane Su 330 ml', '', '', 70, true, true, 10)
ON CONFLICT DO NOTHING;

-- Coffee
INSERT INTO menu_items (category_id, name_en, name_tr, description_en, description_tr, price, is_vegetarian, is_vegan, display_order) VALUES
(7, 'Turkish Coffee', 'Türk Kahvesi', '', '', 130, true, true, 1),
(7, 'Turkish Coffee with Milk', 'Sütlü Türk Kahvesi', '', '', 150, true, false, 2),
(7, 'Espresso', 'Espresso', '', '', 120, true, true, 3),
(7, 'Americano', 'Amerikano', '', '', 130, true, true, 4),
(7, 'Macchiato / Cortado', 'Macchiato / Cortado', '', '', 130, true, false, 5),
(7, 'Cappuccino', 'Cappuccino', '', '', 160, true, false, 6),
(7, 'Latte', 'Latte', '', '', 165, true, false, 7),
(7, 'Caramel Vanilla Latte', 'Karamelli Vanilyalı Latte', '', '', 175, true, false, 8),
(7, 'Hazelnut Chocolate Latte', 'Fındık ve Çikolatalı Latte', '', '', 175, true, false, 9),
(7, 'Filter Coffee', 'Filtre Kahve', '', '', 145, true, true, 10),
(7, 'Iced Latte', 'Buzlu Latte', '', '', 165, true, false, 11),
(7, 'Caramel Vanilla Iced Latte', 'Karamelli Vanilyalı Buzlu Latte', '', '', 175, true, false, 12),
(7, 'Hazelnut Chocolate Iced Latte', 'Fındık ve Çikolatalı Buzlu Latte', '', '', 175, true, false, 13),
(7, 'Iced Americano', 'Buzlu Amerikano', '', '', 130, true, true, 14),
(7, 'Iced Filter Coffee', 'Buzlu Filtre Kahve', '', '', 145, true, true, 15)
ON CONFLICT DO NOTHING;

-- Tea
INSERT INTO menu_items (category_id, name_en, name_tr, description_en, description_tr, price, is_vegetarian, is_vegan, display_order) VALUES
(8, 'Black Rize Tea', 'Rize Çayı', '', '', 60, true, true, 1),
(8, 'Iced Apple Green Tea', 'Buzlu Elmalı Yeşil Çay', '', '', 145, true, true, 2),
(8, 'Lipton Ice Tea 330 ml', 'Lipton Buzlu Çay 330 ml', 'Lemon / Peach / Lemon Light / Peach Light', 'Limon / Şeftali / Limon Light / Şeftali Light', 80, true, true, 3),
(8, 'Natural Kinds of Herbs Tea', 'Halis Bitki Çayları', 'Linden&Mint Tea, Sage Tea, Rose-hip Tea, Green Tea with Jasmin, Balm Tea, Fennel Tea, Camomile Tea, Relaxing Tea, İstanbul Tea', 'Ihlamur&Taze Nane Çayı, Adaçayı, Kuşburnu Çayı, Yaseminli Yeşil Çay, Melisa Çayı, Rezene Çayı, Papatya Çayı, Rahatlama Çayı, Yeşil Çay, Yasemin Çayı,Taze Nane Çayı, Ihlamur Çayı', 170, true, true, 4),
(8, 'Indian Chai / Iced Indian Chai', 'Hint Çayı / Buzlu Hint Çayı', 'Black tea brewed with cinnamon, cardamom, cloves, ginger and milk', 'Tarçın, karanfil, kakule, zencefil ve süt ile pişirilmiş siyah çay', 150, true, false, 5),
(8, 'Mixed Dried Fruits Tea', 'Karışık Meyve Kurusu Çayı', 'Apple, orange, lemon, rose-hip, cinnamon', 'Elma, portakal,limon, kuşburnu kurusu ve tarçınlı çay', 170, true, true, 6)
ON CONFLICT DO NOTHING;