# differentiateLang
A vanilla JS script to differentiate characters from multiple languages.

# Usage
Clone the project, open the simple demo, testLang.html in browser.  
The file wrapLang.js in the src folder is the script itself,  
and the consoleDebug.js is the console ready code to be run in browser console  
with some console.log added to che the status of the main stack storing the DOM nodes.  
If you want to implant this little component in your project, you may copy the script then set font-family property to :lang pseudo-class in CSS.  
  
## Expected output
The parts written in roman(latin) characters should be automatically set to the font 'Source Code Pro',  
while the parts written in Chinese characters should be in 'Noto Sans SC', as the style sheet in the demo html document.
  
## Shortcomings
The performance still has its space to be optimized.  
Some weird compatibility problem takes place, as indentations in text editor is interpreted as text node with various number of spacial characters in brwoser.  
I tryed to fix with it by preproccessing the html code and eliminate all indentations, which worked at the cost of readability.  
But when I migrated this component to my own project, it works without any preprocessing.
Still working on it.  
