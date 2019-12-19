const fs = require('fs');

fs.readdir('./src/assets/mp3', function (err, files) {

	//listing all files using forEach
	console.log('[')
  files.forEach(function (file) {
    if(file.includes('mp3'))
    {  
      let naem = file.split('.')[0];
     
			//console.log(`\"${naem}\" : \"${url}\",`); 
		
			console.log(`'${naem}',`)

    }
	});
	console.log(']')
});