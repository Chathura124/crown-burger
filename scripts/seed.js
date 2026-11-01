require('dotenv').config();const mongoose=require('mongoose');const {Product}=require('../src/server');
const products=[
['The Royal Smash','Beef',1890,'Double-seared beef patties, melted cheddar, caramelized onions, pickles and signature crown sauce.',38,'Bestseller',1,0],
['Inferno King','Beef',2190,'Flame-grilled beef, smoked chilli glaze, jalapeños, pepper jack and fiery house mayo.',42,'Hot pick',1,3],
['Golden Crispy','Chicken',1690,'Ultra-crispy buttermilk chicken, crunchy slaw, pickles and silky garlic aioli.',35,'Fan favorite',1,0],
['Truffle Royale','Beef',2490,'Juicy Angus-style beef patty, mushroom medley, Swiss cheese and rich truffle mayo.',27,'Premium',1,0],
['Hot Honey Chick','Chicken',1890,'Crispy chicken tossed in hot honey, cheddar, pickled cabbage and ranch.',30,'Sweet heat',0,2],
['Garden Rebel','Veggie',1590,'Chargrilled plant-based patty, avocado-style green sauce, lettuce and tomato.',29,'Plant power',0,0],
['BBQ Smokehouse','Beef',2290,'Smoky beef stack with barbecue glaze, onion rings, cheddar and crispy lettuce.',25,'Smoky',0,0],
['Spicy Nashville','Chicken',1990,'Nashville-style hot chicken, cooling slaw, dill pickles and buttery toasted bun.',23,'Spicy',0,3],
['Mushroom Melt','Veggie',1790,'Roasted mushroom patty, cheese melt, peppery rocket and sweet onion jam.',26,'Veggie',0,0],
['Loaded Crown Fries','Sides',990,'Golden-cut fries with cheese sauce, smoky spice and tangy house dressing.',50,'Side kick',0,0],
['Crunchy Onion Rings','Sides',790,'Thick-cut onion rings coated in our crunchy seasoned batter.',55,'Crispy',0,0],
['Vanilla Cloud Shake','Drinks',890,'Thick creamy vanilla milkshake finished with a cloud of whipped cream.',40,'Chill',0,0]
].map(([name,category,price,description,stock,badge,isFeatured,spice],i)=>({name,category,price,description,stock,badge,isFeatured:!!isFeatured,spice,image:({Sides:i===9?'/assets/fries.svg':'/assets/rings.svg',Drinks:'/assets/shake.svg'})[category]||('/assets/burger-'+([1,4,3,2,3,1,4,3,1][i]||1)+'.jpg'),theme:['classic','fire','chicken','truffle','honey','green','bbq','fire','green','fries','rings','shake'][i],isAvailable:true}));
(async()=>{try{await mongoose.connect(process.env.MONGODB_URI||'mongodb://127.0.0.1:27017/crown_burger');let count=await Product.countDocuments();if(count){console.log('Products already exist ('+count+'). No duplicate seed added.');}else{await Product.insertMany(products);console.log('Seeded '+products.length+' products.');}await mongoose.disconnect();}catch(e){console.error(e.message);process.exit(1);}})();
