
if (navigator.serviceWorker){
navigator.serviceWorker.register('/sw.js').then(function(reg) {console.log("reg " + reg)})
.catch(function(err){console.log("error "+ err)})
}
