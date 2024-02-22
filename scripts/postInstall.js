var fs = require('fs');

var replaceArray = [
  {
    file: 'node_modules/imokhles-react-native-app-tour/android/build.gradle',
    find: 'com.getkeepsafe.taptargetview:taptargetview:1.13.0',
    replace: 'com.getkeepsafe.taptargetview:taptargetview:1.13.3',
    special: true,
  },
];

replaceArray.forEach(replaceObj => {
  fs.readFile(replaceObj.file, 'utf8', function (err, data) {
    if (err) {
      return console.log(err);
    }

    var sRegExInput = new RegExp(replaceObj.find, 'g');
    var result = data.replace(sRegExInput, replaceObj.replace);

    fs.writeFile(replaceObj.file, result, 'utf8', function (error) {
      if (err) return console.log(error);
      console.log('Written ===> ');
    });
  });
});
