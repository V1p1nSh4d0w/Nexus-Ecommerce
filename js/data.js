// ===== DATA =====
const CATEGORIES = [
  {id:'electronics',name:'Electronics',icon:'💻',count:1240},
  {id:'fashion',name:'Fashion',icon:'👗',count:3560},
  {id:'shoes',name:'Footwear',icon:'👟',count:890},
  {id:'beauty',name:'Beauty',icon:'💄',count:2100},
  {id:'home',name:'Home & Living',icon:'🏠',count:1780},
  {id:'sports',name:'Sports',icon:'⚽',count:650},
  {id:'books',name:'Books',icon:'📚',count:4200},
  {id:'toys',name:'Toys & Kids',icon:'🧸',count:920},
  {id:'jewelry',name:'Jewelry',icon:'💍',count:480},
  {id:'food',name:'Food & Gourmet',icon:'🍫',count:340},
];

const PRODUCTS = [
  {id:1,name:'Wireless Noise-Cancelling Headphones',cat:'electronics',emoji:'🎧',price:8999,original:15999,rating:4.8,reviews:2341,badge:'sale',desc:'Premium sound quality with 30-hour battery life and ANC technology.',colors:['#1a1a2e','#e8e8f0','#6c63ff'],sizes:[]},
  {id:2,name:'iPhone 16 Pro Max',cat:'electronics',emoji:'📱',price:134999,original:139999,rating:4.9,reviews:5670,badge:'hot',desc:'The most advanced iPhone ever with ProRAW camera system.',colors:['#1a1a2e','#d4af37','#e8e8f0'],sizes:[]},
  {id:3,name:'Premium Sneakers X1',cat:'shoes',emoji:'👟',price:4499,original:7999,rating:4.6,reviews:892,badge:'sale',desc:'Ultra-comfortable everyday sneakers with memory foam insole.',colors:['#fff','#000','#ff6584'],sizes:['UK6','UK7','UK8','UK9','UK10','UK11']},
  {id:4,name:'Silk Evening Dress',cat:'fashion',emoji:'👗',price:3299,original:5999,rating:4.7,reviews:445,badge:'new',desc:'Luxurious silk blend dress, perfect for special occasions.',colors:['#6c63ff','#ff6584','#000'],sizes:['XS','S','M','L','XL']},
  {id:5,name:'Smart Watch Pro',cat:'electronics',emoji:'⌚',price:24999,original:34999,rating:4.8,reviews:1203,badge:'sale',desc:'Health tracking, GPS, AMOLED display, 7-day battery.',colors:['#1a1a2e','#e8e8f0','#d4af37'],sizes:[]},
  {id:6,name:'4K Gaming Monitor',cat:'electronics',emoji:'🖥️',price:42999,original:55000,rating:4.7,reviews:678,badge:'hot',desc:'144Hz refresh rate, 1ms response time, HDR10 support.',colors:['#000'],sizes:[]},
  {id:7,name:'Leather Tote Bag',cat:'fashion',emoji:'👜',price:2999,original:4999,rating:4.5,reviews:334,badge:'sale',desc:'Genuine leather spacious tote with suede interior.',colors:['#8B4513','#000','#e8e8e0'],sizes:[]},
  {id:8,name:'Running Shoes Ultra',cat:'shoes',emoji:'🏃',price:6499,original:9999,rating:4.9,reviews:1567,badge:'hot',desc:'Designed for marathon runners, ultra-responsive cushioning.',colors:['#ff6584','#6c63ff','#43e97b'],sizes:['UK6','UK7','UK8','UK9','UK10']},
  {id:9,name:'Vitamin C Serum',cat:'beauty',emoji:'🧴',price:899,original:1499,rating:4.6,reviews:2890,badge:'sale',desc:'20% Vitamin C + E + Ferulic Acid for radiant skin.',colors:[],sizes:['30ml','60ml']},
  {id:10,name:'Mechanical Keyboard',cat:'electronics',emoji:'⌨️',price:7999,original:12000,rating:4.8,reviews:445,badge:'new',desc:'TKL layout, RGB backlight, Cherry MX switches.',colors:['#1a1a2e','#e8e8f0'],sizes:[]},
  {id:11,name:'Yoga Mat Premium',cat:'sports',emoji:'🧘',price:1799,original:2999,rating:4.7,reviews:789,badge:'sale',desc:'Non-slip, eco-friendly TPE material, 6mm thick.',colors:['#6c63ff','#43e97b','#ff6584'],sizes:[]},
  {id:12,name:'Scented Candle Set',cat:'home',emoji:'🕯️',price:1299,original:1999,rating:4.6,reviews:456,badge:'new',desc:'Set of 4 soy wax candles with calming fragrances.',colors:[],sizes:[]},
  {id:13,name:'Wireless Earbuds Pro',cat:'electronics',emoji:'🎵',price:5499,original:9999,rating:4.7,reviews:3210,badge:'sale',desc:'True wireless, 36-hour total playback, IPX5 waterproof.',colors:['#fff','#000','#6c63ff'],sizes:[]},
  {id:14,name:'Denim Jacket',cat:'fashion',emoji:'🧥',price:2499,original:3999,rating:4.5,reviews:234,badge:'',desc:'Classic stonewash denim jacket, timeless wardrobe essential.',colors:['#1a3a5c','#000'],sizes:['S','M','L','XL','XXL']},
  {id:15,name:'Protein Powder 2kg',cat:'sports',emoji:'💪',price:1999,original:2799,rating:4.8,reviews:1890,badge:'hot',desc:'Whey protein isolate, 27g protein per serving, 30 flavors.',colors:[],sizes:['Chocolate','Vanilla','Strawberry']},
  {id:16,name:'Diamond Stud Earrings',cat:'jewelry',emoji:'💎',price:12999,original:18999,rating:4.9,reviews:123,badge:'',desc:'18K gold with certified diamond studs, comes with certificate.',colors:['#d4af37','#fff'],sizes:[]},
  {id:17,name:'Coffee Maker Deluxe',cat:'home',emoji:'☕',price:8499,original:12999,rating:4.7,reviews:567,badge:'sale',desc:'12-cup capacity, built-in grinder, programmable timer.',colors:['#1a1a2e','#e8e8f0'],sizes:[]},
  {id:18,name:'Bestseller Novel Bundle',cat:'books',emoji:'📚',price:999,original:1799,rating:4.8,reviews:2340,badge:'sale',desc:'Collection of 5 bestselling novels across genres.',colors:[],sizes:[]},
  {id:19,name:'LEGO Architecture Set',cat:'toys',emoji:'🧱',price:4299,original:5999,rating:4.9,reviews:456,badge:'new',desc:'Iconic skyline collection, 744 pieces, ages 12+.',colors:[],sizes:[]},
  {id:20,name:'Belgian Chocolate Box',cat:'food',emoji:'🍫',price:1299,original:1899,rating:4.8,reviews:789,badge:'hot',desc:'Assorted premium Belgian chocolates, 500g gift box.',colors:[],sizes:[]},
  {id:21,name:'Sony WH-1000XM6',cat:'electronics',emoji:'🎧',price:32999,original:39999,rating:4.9,reviews:4567,badge:'new',desc:'Industry-leading ANC with improved sound personalization.',colors:['#1a1a2e','#e8e8f0'],sizes:[]},
  {id:22,name:'MacBook Air M4',cat:'electronics',emoji:'💻',price:114999,original:119999,rating:4.9,reviews:2341,badge:'hot',desc:'M4 chip, 18-hour battery, fanless ultra-thin design.',colors:['#d4af37','#e8e8f0','#1a1a2e'],sizes:['8GB/256GB','16GB/512GB']},
  {id:23,name:'Perfume Collection',cat:'beauty',emoji:'🌹',price:3499,original:5999,rating:4.7,reviews:567,badge:'sale',desc:'Set of 3 designer fragrances for all occasions.',colors:[],sizes:[]},
  {id:24,name:'Formal Suit',cat:'fashion',emoji:'🤵',price:9999,original:18000,rating:4.8,reviews:234,badge:'sale',desc:'Italian wool blend, slim-fit, includes jacket and trousers.',colors:['#1a1a2e','#4a4a6a','#6b5c4a'],sizes:['38','40','42','44']},
];

const FLASH_PRODUCTS = [1,5,11,13];
const TESTIMONIALS=[
  {text:"I've been shopping at NEXUS for 2 years now. The product quality is consistently excellent, and delivery is always on time. Highly recommended!",name:"Priya Sharma",role:"Verified Buyer",color:"#6c63ff"},
  {text:"The flash deals are insane — I got Sony headphones for almost 40% off. The checkout process is super smooth too. Love the app!",name:"Rahul Mehta",role:"Premium Member",color:"#ff6584"},
  {text:"Excellent customer service. Had a return issue and it was resolved within 24 hours. NEXUS truly cares about their customers.",name:"Ananya Singh",role:"Verified Buyer",color:"#43e97b"},
  {text:"Ordered a MacBook and it was delivered the next morning in perfect condition. The unboxing experience was premium-level.",name:"Arjun Kapoor",role:"Tech Enthusiast",color:"#ffd700"},
  {text:"Best prices online for fashion. I compare every time and NEXUS always wins. Free shipping on my orders makes it even better!",name:"Meera Patel",role:"Fashion Blogger",color:"#6c63ff"},
  {text:"The loyalty points system is brilliant. I've already earned ₹2,000 worth of credits just from regular shopping. Smart!",name:"Vikram Nair",role:"Gold Member",color:"#ff6584"},
];
const BLOG_POSTS=[
  {emoji:'👗',tag:'Fashion',title:'Top 10 Summer Trends of 2026 You Need in Your Wardrobe',date:'May 2, 2026',read:'5 min'},
  {emoji:'💻',tag:'Tech',title:'Best Budget Laptops Under ₹50,000 — Our Expert Picks',date:'Apr 28, 2026',read:'7 min'},
  {emoji:'🏃',tag:'Sports',title:'How to Choose the Perfect Running Shoes for Your Foot Type',date:'Apr 20, 2026',read:'4 min'},
  {emoji:'🏠',tag:'Home',title:'Minimalist Home Decor Ideas That Won\'t Break the Bank',date:'Apr 15, 2026',read:'6 min'},
  {emoji:'💄',tag:'Beauty',title:'The Korean Skincare Routine That Changed My Skin in 30 Days',date:'Apr 10, 2026',read:'8 min'},
  {emoji:'📦',tag:'Shopping Tips',title:'How to Get the Most Out of NEXUS Flash Sales',date:'Apr 5, 2026',read:'3 min'},
];
const TEAM=[
  {emoji:'👨‍💼',name:'Vikram Anand',role:'CEO & Co-Founder',color:'#6c63ff'},
  {emoji:'👩‍💻',name:'Neha Gupta',role:'CTO & Co-Founder',color:'#ff6584'},
  {emoji:'👨‍🎨',name:'Rohan Das',role:'Head of Design',color:'#43e97b'},
  {emoji:'👩‍📊',name:'Priya Malhotra',role:'VP Marketing',color:'#ffd700'},
  {emoji:'👨‍🔧',name:'Arun Kumar',role:'Head of Operations',color:'#6c63ff'},
  {emoji:'👩‍💼',name:'Sonali Shah',role:'Customer Success',color:'#ff6584'},
];
