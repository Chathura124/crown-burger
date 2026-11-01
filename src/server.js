require('dotenv').config();
const express=require('express');
const mongoose=require('mongoose');
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');
const helmet=require('helmet');
const rateLimit=require('express-rate-limit');
const morgan=require('morgan');
const path=require('path');

const productSchema=new mongoose.Schema({name:{type:String,required:true,trim:true,maxlength:80},category:{type:String,required:true,enum:['Beef','Chicken','Veggie','Sides','Drinks']},description:{type:String,required:true,trim:true,maxlength:500},price:{type:Number,required:true,min:0},originalPrice:{type:Number,min:0},image:{type:String,default:''},theme:{type:String,default:'classic'},badge:{type:String,default:''},isFeatured:{type:Boolean,default:false},isAvailable:{type:Boolean,default:true},stock:{type:Number,required:true,min:0,default:20},spice:{type:Number,min:0,max:3,default:0}}, {timestamps:true});
const Product=mongoose.model('Product',productSchema);
const orderSchema=new mongoose.Schema({customer:{name:{type:String,required:true},email:{type:String,required:true},phone:{type:String,required:true},address:{type:String,required:true}},items:[{product:{type:mongoose.Schema.Types.ObjectId,ref:'Product'},name:String,quantity:Number,unitPrice:Number,subtotal:Number}],subtotal:Number,deliveryFee:Number,total:Number,status:{type:String,enum:['Pending','Preparing','Ready','Delivered','Cancelled'],default:'Pending'},paymentMethod:{type:String,enum:['Cash on Delivery'],default:'Cash on Delivery'}},{timestamps:true});
const Order=mongoose.model('Order',orderSchema);
const app=express();app.disable('x-powered-by');
app.use(helmet({contentSecurityPolicy:false})); // Inline animations and GSAP CDN used in this educational project.
app.use(morgan('dev'));app.use(express.json({limit:'30kb'}));
const root=path.join(__dirname,'../public');app.use(express.static(root));
const asyncRoute=fn=>(req,res,next)=>Promise.resolve(fn(req,res,next)).catch(next);
function validateProduct(body){
 const errors=[];const s=(v,n,max)=>typeof v==='string'&&v.trim().length>=n&&v.trim().length<=max;
 if(!s(body.name,2,80))errors.push('Product name must have 2–80 characters.');
 if(!['Beef','Chicken','Veggie','Sides','Drinks'].includes(body.category))errors.push('Choose a valid category.');
 if(!s(body.description,8,500))errors.push('Description must have 8–500 characters.');
 if(typeof body.price!=='number'||!Number.isFinite(body.price)||body.price<=0||body.price>100000)errors.push('Price must be between 0 and 100000.');
 if(!Number.isInteger(body.stock)||body.stock<0||body.stock>100000)errors.push('Stock must be a non-negative whole number.');
 if(body.image&&(!s(body.image,1,500)||!/^https:\/\/|^\/assets\//.test(body.image)))errors.push('Image must use HTTPS or /assets/.');
 if(body.spice!==undefined&&(!Number.isInteger(body.spice)||body.spice<0||body.spice>3))errors.push('Spice level must be 0–3.');
 return errors;
}
const productFields=['name','category','description','price','originalPrice','image','theme','badge','isFeatured','isAvailable','stock','spice'];
const pickProduct=b=>Object.fromEntries(productFields.filter(k=>Object.prototype.hasOwnProperty.call(b,k)).map(k=>[k,b[k]]));
const auth=(req,res,next)=>{try{const t=(req.headers.authorization||'').replace(/^Bearer /,'');const p=jwt.verify(t,process.env.JWT_SECRET);if(p.role!=='admin')throw Error();req.admin=p;next();}catch(e){res.status(401).json({error:'Admin login required.'});}};

app.get('/api/health',asyncRoute(async(req,res)=>res.json({status:'ok',database:mongoose.connection.readyState===1?'connected':'disconnected'})));
app.get('/api/products',asyncRoute(async(req,res)=>{
 const filter={isAvailable:true};if(req.query.category&&req.query.category!=='All')filter.category=req.query.category;
 if(req.query.q){const q=String(req.query.q).slice(0,80).replace(/[.*+?^${}()|[\]\\]/g,'\\$&');filter.$or=[{name:{$regex:q,$options:'i'}},{description:{$regex:q,$options:'i'}}];}
 const sorts={featured:{isFeatured:-1,createdAt:-1},price_asc:{price:1},price_desc:{price:-1},newest:{createdAt:-1},name:{name:1}};
 const products=await Product.find(filter).sort(sorts[req.query.sort]||sorts.featured).limit(100).lean();res.json(products);
}));
app.get('/api/products/:id',asyncRoute(async(req,res)=>{if(!mongoose.isValidObjectId(req.params.id))return res.status(400).json({error:'Invalid product ID.'});const p=await Product.findById(req.params.id);if(!p||!p.isAvailable)return res.status(404).json({error:'Product not found.'});res.json(p);}));
app.post('/api/auth/login',rateLimit({windowMs:15*60*1000,limit:8,standardHeaders:'draft-7',legacyHeaders:false}),asyncRoute(async(req,res)=>{
 const email=String(req.body.email||'').trim().toLowerCase();const pass=String(req.body.password||'');
 const correctUser=email===String(process.env.ADMIN_EMAIL||'').toLowerCase();const correctPassword=pass&&process.env.ADMIN_PASSWORD&&await bcrypt.compare(pass,await bcrypt.hash(process.env.ADMIN_PASSWORD,10));
 if(!correctUser||!correctPassword)return res.status(401).json({error:'Invalid email or password.'});
 res.json({token:jwt.sign({role:'admin',email},process.env.JWT_SECRET,{expiresIn:'3h'})});
}));
app.get('/api/admin/products',auth,asyncRoute(async(req,res)=>res.json(await Product.find().sort({createdAt:-1}))));
app.post('/api/admin/products',auth,asyncRoute(async(req,res)=>{let data=pickProduct(req.body);let errors=validateProduct(data);if(errors.length)return res.status(400).json({error:errors.join(' ')});res.status(201).json(await Product.create(data));}));
app.put('/api/admin/products/:id',auth,asyncRoute(async(req,res)=>{if(!mongoose.isValidObjectId(req.params.id))return res.status(400).json({error:'Invalid ID.'});let data=pickProduct(req.body),errors=validateProduct(data);if(errors.length)return res.status(400).json({error:errors.join(' ')});let p=await Product.findByIdAndUpdate(req.params.id,data,{new:true,runValidators:true});if(!p)return res.status(404).json({error:'Product not found.'});res.json(p);}));
app.delete('/api/admin/products/:id',auth,asyncRoute(async(req,res)=>{if(!mongoose.isValidObjectId(req.params.id))return res.status(400).json({error:'Invalid ID.'});let p=await Product.findByIdAndDelete(req.params.id);if(!p)return res.status(404).json({error:'Product not found.'});res.json({success:true});}));
app.post('/api/orders',rateLimit({windowMs:60*1000,limit:15}),asyncRoute(async(req,res)=>{
 const {customer,items}=req.body||{};
 if(!customer||!['name','email','phone','address'].every(k=>typeof customer[k]==='string'&&customer[k].trim().length>=3&&customer[k].length<=250)||!/^\S+@\S+\.\S+$/.test(customer.email))return res.status(400).json({error:'Please enter valid name, email, phone and delivery address.'});
 if(!Array.isArray(items)||items.length<1||items.length>30||items.some(x=>!mongoose.isValidObjectId(x.productId)||!Number.isInteger(x.quantity)||x.quantity<1||x.quantity>20))return res.status(400).json({error:'Invalid cart contents.'});
 const grouped=new Map();for(const x of items)grouped.set(x.productId,(grouped.get(x.productId)||0)+x.quantity);
 const ids=[...grouped.keys()];const products=await Product.find({_id:{$in:ids}});if(products.length!==ids.length)return res.status(400).json({error:'Some products are no longer available.'});
 const lines=[];for(const p of products){const quantity=grouped.get(String(p._id));if(!p.isAvailable||p.stock<quantity)return res.status(400).json({error:`Not enough stock for ${p.name}.`});lines.push({product:p._id,name:p.name,quantity,unitPrice:p.price,subtotal:p.price*quantity});}
 // Reserve inventory atomically per product; revert earlier reservations if one fails.
 const reserved=[];for(const l of lines){let result=await Product.updateOne({_id:l.product,stock:{$gte:l.quantity},isAvailable:true},{$inc:{stock:-l.quantity}});if(!result.modifiedCount){for(const r of reserved)await Product.updateOne({_id:r.product},{$inc:{stock:r.quantity}});return res.status(409).json({error:'Stock changed; please retry.'});}reserved.push(l);}
 const subtotal=lines.reduce((s,l)=>s+l.subtotal,0),deliveryFee=subtotal>=3500?0:350;
 try{const order=await Order.create({customer,items:lines,subtotal,deliveryFee,total:subtotal+deliveryFee});return res.status(201).json({orderId:order._id,total:order.total,status:order.status});}catch(e){for(const r of reserved)await Product.updateOne({_id:r.product},{$inc:{stock:r.quantity}});throw e;}
}));
app.get('/api/admin/orders',auth,asyncRoute(async(req,res)=>res.json(await Order.find().sort({createdAt:-1}).limit(150))));
app.patch('/api/admin/orders/:id',auth,asyncRoute(async(req,res)=>{if(!mongoose.isValidObjectId(req.params.id)||!['Pending','Preparing','Ready','Delivered','Cancelled'].includes(req.body.status))return res.status(400).json({error:'Invalid order or status.'});const current=await Order.findById(req.params.id);if(!current)return res.status(404).json({error:'Order not found.'});if(current.status==='Cancelled'&&req.body.status!=='Cancelled')return res.status(400).json({error:'Cancelled orders cannot be reopened.'});if(current.status==='Delivered'&&req.body.status==='Cancelled')return res.status(400).json({error:'Delivered orders cannot be cancelled.'});if(current.status!=='Cancelled'&&req.body.status==='Cancelled')for(const l of current.items)await Product.updateOne({_id:l.product},{$inc:{stock:l.quantity}});current.status=req.body.status;await current.save();res.json(current);}));
app.get('/admin',(req,res)=>res.sendFile(path.join(root,'admin.html')));
app.use('/api',(req,res)=>res.status(404).json({error:'API route not found.'}));
app.use((err,req,res,next)=>{console.error(err);if(err.name==='ValidationError')return res.status(400).json({error:Object.values(err.errors).map(x=>x.message).join(' ')});res.status(500).json({error:'Server error. Please try again.'});});
async function start(){if(!process.env.JWT_SECRET||process.env.JWT_SECRET.length<32||!process.env.ADMIN_PASSWORD)throw Error('Configure JWT_SECRET (32+ characters) and ADMIN_PASSWORD in .env');await mongoose.connect(process.env.MONGODB_URI||'mongodb://127.0.0.1:27017/crown_burger');app.listen(Number(process.env.PORT)||3000,()=>console.log('CROWN BURGER → http://localhost:'+(process.env.PORT||3000)));}
if(require.main===module)start().catch(e=>{console.error('Startup error:',e.message);process.exit(1)});
module.exports={app,Product,Order,validateProduct};
