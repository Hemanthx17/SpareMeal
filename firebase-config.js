// ══════════════════════════════════════════
//  firebase-config.js  —  SpareMeal
//  STEP 1: Replace config below with yours
//  STEP 2: Enable Firestore in Firebase console
//  STEP 3: Set Firestore rules to test mode
// ══════════════════════════════════════════

var firebaseConfig = {
  apiKey:            "AIzaSyCtOFnwjIqU7sPt0Q3JHeldbrkNH8LolMI",
  authDomain:        "sparemeal-ade47.firebaseapp.com",
  databaseURL:       "https://sparemeal-ade47-default-rtdb.firebaseio.com",
  projectId:         "sparemeal-ade47",
  storageBucket:     "sparemeal-ade47.firebasestorage.app",
  messagingSenderId: "202714263862",
  appId:             "1:202714263862:web:5d731cb813ac560cdcc397",
  measurementId:     "G-JT5HCNSX1N2",
  appId:             "1:202714263862:web:5d731cb813ac560cdcc397",
  measurementId:     "G-JT5HCNSX1N"
};

// Init only once
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

var db        = firebase.firestore();
var USERS     = db.collection('users');
var NGOS      = db.collection('ngos');
var DONATIONS = db.collection('donations');

// ── Static NGO display data ──
var NGO_LIST = [
  {
    id:'humana', name:'Hanuman Foundation', emoji:'🤝',
    meals:19, hours:'2pm-6pm', rating:'4.6', feeds:'850+', campaigns:'45+', volunteers:'100+',
    about:'Hanuman Foundation has been providing nutritious meals since 2008. We operate in 14 cities.',
    events:[{title:'Weekend Meal Drive',date:'Mar 1, 2026'},{title:'Volunteer Training',date:'Apr 5, 2026'}],
    reviews:[{name:'Ananya S.',stars:5,text:'Wonderful! Very easy donation process.'},{name:'Rahul M.',stars:4,text:'Professional and on time.'}]
  },
  {
    id:'national', name:'National NGO', emoji:'🌏',
    meals:15, hours:'3pm-10pm', rating:'4.3', feeds:'600+', campaigns:'30+', volunteers:'75+',
    about:'National NGO has been serving communities across India since 2012. Our network spans 22 states.',
    events:[{title:'National Food Fest',date:'Mar 8, 2026'},{title:'Elder Care Program',date:'Mar 20, 2026'}],
    reviews:[{name:'Vikram T.',stars:4,text:'Great initiative, well organised.'},{name:'Sonal R.',stars:5,text:'200 meals donated seamlessly!'}]
  },
  {
    id:'bahubali', name:'Bahubali Army', emoji:'🏹',
    meals:13, hours:'8pm-10pm', rating:'4.8', feeds:'1200+', campaigns:'80+', volunteers:'500+',
    about:'Bahubali Army redistributes surplus food from restaurants across 50+ cities.',
    events:[{title:'Night Distribution Drive',date:'Every Saturday'},{title:'Brigade Onboarding',date:'Mar 10, 2026'}],
    reviews:[{name:'Aakash P.',stars:5,text:'Most efficient organisation I have seen!'},{name:'Siddharth J.',stars:4,text:'Great cause and great people.'}]
  },
  {
    id:'avengers', name:'Avengers', emoji:'💚',
    meals:10, hours:'11am-8pm', rating:'4.1', feeds:'400+', campaigns:'20+', volunteers:'60+',
    about:'Avengers Foundation focuses on community health including food, clean water and wellness.',
    events:[{title:'Nutrition Awareness Walk',date:'Mar 22, 2026'}],
    reviews:[{name:'Meena L.',stars:4,text:'Caring team, great approach.'},{name:'Rohan B.',stars:4,text:'Quick pickup and genuine smiles!'}]
  },
  {
    id:'vishwas', name:'Vishwas', emoji:'🌿',
    meals:26, hours:'2pm-8pm', rating:'4.7', feeds:'2000+', campaigns:'120+', volunteers:'800+',
    about:'Vishwas channels urban surplus food to rural communities. Present in 26 states.',
    events:[{title:'Urban-Rural Food Bridge',date:'Apr 2, 2026'},{title:'Vishwas Annual Gala',date:'Apr 14, 2026'}],
    reviews:[{name:'Lavanya P.',stars:5,text:'Truly inspiring!'},{name:'Kiran G.',stars:5,text:'Handled 26 meals perfectly!'}]
  }
];

// ── Session helpers ──
function setSession(k, v) { sessionStorage.setItem(k, v); }
function getSession(k)    { return sessionStorage.getItem(k) || ''; }
function clearSession()   { sessionStorage.clear(); }

// ── Seed NGO credentials once ──
function seedNGOs() {
  NGOS.doc('humana').get()
    .then(function(snap) {
      if (snap.exists) return;
      var list = [
        {username:'humana',   password:'123456', name:'Hanuman Foundation'},
        {username:'national', password:'123456', name:'National NGO'},
        {username:'bahubali', password:'123456', name:'Bahubali Army'},
        {username:'avengers', password:'123456', name:'Avengers'},
        {username:'vishwas',  password:'123456', name:'Vishwas'}
      ];
      list.forEach(function(n){ NGOS.doc(n.username).set(n); });
    })
    .catch(function(e){ console.warn('seedNGOs failed:', e.message); });
}

// ── Sort donations newest first (client-side, no index needed) ──
function sortByDate(arr) {
  return arr.sort(function(a, b) {
    var ta = a.createdAt && a.createdAt.toMillis ? a.createdAt.toMillis() : 0;
    var tb = b.createdAt && b.createdAt.toMillis ? b.createdAt.toMillis() : 0;
    return tb - ta;
  });
}
