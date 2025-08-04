constmongoose=require("mongoose");
constImpactStory=require("../models/impactStory");
constTask=require("../models/task");
constUser=require("../models/user");
constconnectDB=require("./connect");

constsampleStories=[
{
title:"BuildingHopeforUnderprivilegedChildren",
content:
"Throughourreadingcircleinitiative,we'veseenremarkabletransformationinchildren'sliteracylevels.Maria,age8,wentfromstrugglingwithbasicwordstoreadingentirestorybooks.Herconfidencehassoared,andshenowhelpsotherchildrenduringreadingsessions.Thisisthepowerofdedicatedvolunteersandcommunitysupport.",
category:"Education",
},
{
title:"HealingThroughArtTherapy",
content:
"Ourarttherapyprogramhastouchedthelivesof45childrendealingwithtrauma.Throughcolors,shapes,andcreativeexpression,they'vefoundwaystocommunicatetheirfeelingsandbeginhealing.Onechild,whohadn'tspokeninmonths,startedexpressinghimselfthroughbeautifulpaintingsandslowlybegantoopenup.",
category:"Children",
},
{
title:"CommunityGardenTransformsNeighborhood",
content:
"Whatstartedasanemptylotfilledwithdebrisisnowathrivingcommunitygardenfeeding20families.Volunteersworkedtirelesslytocleartheland,plantvegetables,andcreateasustainablefoodsource.Thegardenhasnotonlyprovidedfreshproducebutalsobroughtthecommunityclosertogether.",
category:"Environment",
},
{
title:"Women'sEmpowermentThroughSkillTraining",
content:
"Reshmalearnedtailoringthroughourvocationaltrainingprogramandnowrunsherownsmallbusiness.Sheemploys3otherwomenfromhercommunityandhastripledherfamily'sincome.Hersuccessstoryhasinspired15morewomentojoinournexttrainingbatch.",
category:"WomenEmpowerment",
},
{
title:"MobileHealthCampSavesLives",
content:
"Ourmobilehealthcampreachedaremotevillagewheremedicalfacilitieswerenon-existent.Weprovidedfreehealthcheckupsto200+villagersandidentifiedcriticalhealthconditionsin12patientswhowereimmediatelyreferredfortreatment.Twolivesweresavedthatdaythankstoearlydetection.",
category:"Health",
},
];

asyncfunctionaddImpactStories(keepConnectionOpen=false){
try{
if(mongoose.connection.readyState!==1){
awaitconnectDB();
console.log("🔗ConnectedtoMongoDBforimpactstoriesseeding");
}

//Clearexistingimpactstories
awaitImpactStory.deleteMany({});
console.log("🗑️Clearedexistingimpactstories");

//Getuserstoassignasstorycreators
constusers=awaitUser.find({
role:{$in:["volunteer","ngoMember"]},
}).limit(5);

if(users.length===0){
console.log("⚠️Nousersfound.Pleaseseedusersfirst.");
return;
}

//Getsomecompletedtaskstolinktostories
constcompletedTasks=awaitTask.find({status:"done"}).limit(10);

//Createstorieswithuserreferencesandoptionaltasklinks
conststoriesWithRefs=sampleStories.map((story,index)=>({
...story,
createdBy:users[index%users.length]._id,
relatedTask:
completedTasks.length>0
?[completedTasks[index%completedTasks.length]._id]
:[],
}));

constcreatedStories=awaitImpactStory.insertMany(storiesWithRefs);
console.log(`✅Created${createdStories.length}impactstories`);

console.log("📖SampleImpactStories:");
createdStories.forEach((story,index)=>{
constuser=users[index%users.length];
console.log(
`•"${story.title}"by${user.userName}(${story.category})`
);
});

if(!keepConnectionOpen){
awaitmongoose.connection.close();
console.log("🔒Databaseconnectionclosed");
}

returncreatedStories;
}catch(error){
console.error("❌Errorseedingimpactstories:",error);
throwerror;
}
}

//Runifcalleddirectly
if(require.main===module){
addImpactStories()
.then(()=>{
console.log("🏁Impactstoriesseedingcompleted!");
process.exit(0);
})
.catch((error)=>{
console.error("💥Impactstoriesseedingfailed:",error);
process.exit(1);
});
}

module.exports={addImpactStories};
