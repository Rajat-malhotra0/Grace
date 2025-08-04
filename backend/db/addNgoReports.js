constmongoose=require("mongoose");
constNgoReport=require("../models/ngoReport");
constNgo=require("../models/ngo");
constUser=require("../models/user");
constconnectDB=require("./connect");

constsampleReports=[
{
title:"Leakingtapinkitchen",
description:
"Themainkitchentaphasbeenleakingsinceyesterdayevening,causingwaterwastage.",
category:"Facilities",
urgency:"Medium",
dateOfIncident:newDate("2025-01-20"),
reportedBy:"AnitaSharma",
status:"pending",
},
{
title:"Shortageofdiapers",
description:
"Runningcriticallylowondiapersinthechildren'sroom.Needimmediaterestocking.",
category:"Supplies",
urgency:"High",
dateOfIncident:newDate("2025-01-21"),
reportedBy:"RahulVerma",
status:"pending",
},
{
title:"Brokenwheelchair",
description:
"Oneofthewheelchairshasadamagedwheelandneedsrepair.",
category:"Other",
urgency:"Medium",
dateOfIncident:newDate("2025-01-19"),
reportedBy:"PriyaSingh",
status:"pending",
},
{
title:"Staffshortageineveningshift",
description:"Notenoughvolunteersfortheeveningshiftthisweek.",
category:"Personnel",
urgency:"High",
dateOfIncident:newDate("2025-01-22"),
reportedBy:"AmitKumar",
status:"pending",
},
{
title:"Computernotworking",
description:"Maincomputerintheofficeisnotstartingup.",
category:"Technology",
urgency:"Low",
dateOfIncident:newDate("2025-01-18"),
reportedBy:"SarahJohnson",
status:"resolved",
},
];

asyncfunctionseedNgoReports(keepConnectionOpen=false){
try{
if(mongoose.connection.readyState!==1){
awaitconnectDB();
console.log("ConnectedtoMongoDB");
}

//Clearexistingreports
awaitNgoReport.deleteMany({});
console.log("ClearedexistingNGOreports");

//Get"LittleLanterns"NGOandanyavailableuserforthereports
constlittleLanternsNgo=awaitNgo.findOne({
name:"LittleLanterns",
});

//TrytofindauserassociatedwithLittleLanternsoruseanyuser
letreporterUser=awaitUser.findOne({email:"worker@gmail.com"});
if(!reporterUser){
//Ifworker@gmail.comdoesn'texist,findanyuser
reporterUser=awaitUser.findOne({
role:{$in:["volunteer","ngoMember"]},
});
}

if(!littleLanternsNgo||!reporterUser){
console.log(
"LittleLanternsNGOorsuitableusernotfound.Pleasecreatethemfirst."
);
return;
}

//AddNGOandUserreferencestosamplereports
constreportsWithRefs=sampleReports.map((report)=>({
...report,
ngo:littleLanternsNgo._id,
reportedByUser:reporterUser._id,
}));

//Insertsamplereports
constinsertedReports=awaitNgoReport.insertMany(reportsWithRefs);
console.log(`✅Inserted${insertedReports.length}sampleNGOreports`);

console.log("📋SampleNGOreports:");
insertedReports.forEach((report)=>{
console.log(
`•${report.title}(${report.urgency}priority,${report.status})`
);
});

if(!keepConnectionOpen){
awaitmongoose.connection.close();
console.log("🔒Databaseconnectionclosed");
}

returninsertedReports;
}catch(error){
console.error("❌ErrorseedingNGOreports:",error);
throwerror;
}
}

//Runifcalleddirectly
if(require.main===module){
seedNgoReports();
}

module.exports=seedNgoReports;
