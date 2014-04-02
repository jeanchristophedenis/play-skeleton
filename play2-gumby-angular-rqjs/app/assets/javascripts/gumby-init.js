define([
    'jquery',
    'lib/gumby/libs/gumby.min',
    'lib/gumby/plugins',
    'lib/gumby/main'
], function(){
    console.log('jQuery ' + $().jquery); // jQuery 1.9.1
    console.log('Gumby is ready to go...', Gumby.debug()); //Gumby is ready to go... Object { $dom={...}, isOldie=false, uiModules={...}, more...}
    Gumby.debug('test!');
});